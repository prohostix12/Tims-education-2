import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { createLead, getCRMConfig, type TIMSEnquiryData } from "@/lib/crmService";

const COLLECTION = "enquiries";

type EnquiryPayload = {
  firstName?: unknown;
  lastName?: unknown;
  phoneNumber?: unknown;
  email?: unknown;
  company?: unknown;
  enquiry?: unknown;
  // Fallbacks for legacy client requests
  name?: unknown;
  phone?: unknown;
  preference?: unknown;
  message?: unknown;
  source?: unknown;
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_term?: unknown;
  utm_content?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let body: EnquiryPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Resolve legacy payload fallbacks if needed
  let rawFirstName = isNonEmptyString(body.firstName) ? body.firstName.trim() : "";
  let rawLastName = isNonEmptyString(body.lastName) ? body.lastName.trim() : "";

  if (!rawFirstName && isNonEmptyString(body.name)) {
    const parts = body.name.trim().split(/\s+/);
    rawFirstName = parts[0] || "";
    rawLastName = parts.slice(1).join(" ") || "";
  }

  const rawPhone = isNonEmptyString(body.phoneNumber)
    ? body.phoneNumber.trim()
    : isNonEmptyString(body.phone)
    ? body.phone.trim()
    : "";

  const rawEmail = isNonEmptyString(body.email) ? body.email.trim() : "";
  const rawCompany = isNonEmptyString(body.company) ? body.company.trim() : "";

  const rawEnquiry = isNonEmptyString(body.enquiry)
    ? body.enquiry.trim()
    : isNonEmptyString(body.message)
    ? body.message.trim()
    : isNonEmptyString(body.preference)
    ? body.preference.trim()
    : "";

  const { source, utm_source, utm_medium, utm_campaign, utm_term, utm_content } = body;

  if (!rawFirstName) {
    return NextResponse.json({ error: "First name is required." }, { status: 400 });
  }

  if (!rawLastName) {
    return NextResponse.json({ error: "Last name is required." }, { status: 400 });
  }

  if (!rawPhone) {
    return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
  }

  if (!rawEmail) {
    return NextResponse.json({ error: "Email address is required." }, { status: 400 });
  }

  if (!rawEnquiry) {
    return NextResponse.json({ error: "Enquiry message is required." }, { status: 400 });
  }

  const now = new Date();
  const crmConfig = await getCRMConfig();

  const doc = {
    firstName: rawFirstName,
    lastName: rawLastName,
    phoneNumber: rawPhone,
    email: rawEmail,
    company: rawCompany,
    enquiry: rawEnquiry,
    // Preserve legacy attributes for DB index/migration compatibility
    name: `${rawFirstName} ${rawLastName}`.trim(),
    phone: rawPhone,
    preference: rawEnquiry,
    source: isNonEmptyString(source) ? source.trim() : "unknown",
    ...(isNonEmptyString(utm_source) ? { utm_source: utm_source.trim() } : {}),
    ...(isNonEmptyString(utm_medium) ? { utm_medium: utm_medium.trim() } : {}),
    ...(isNonEmptyString(utm_campaign) ? { utm_campaign: utm_campaign.trim() } : {}),
    ...(isNonEmptyString(utm_term) ? { utm_term: utm_term.trim() } : {}),
    ...(isNonEmptyString(utm_content) ? { utm_content: utm_content.trim() } : {}),
    createdAt: now,
    crmSyncStatus: crmConfig.enabled ? "pending" : "disabled",
    crmSyncAttempts: 0,
  };

  let insertedId: string;
  let mongoId: ObjectId;
  let db;

  try {
    db = await getDb();
    const result = await db.collection(COLLECTION).insertOne(doc);
    mongoId = result.insertedId;
    insertedId = result.insertedId.toString();
  } catch (error) {
    console.error("Failed to save enquiry:", error);
    return NextResponse.json({ error: "Could not save enquiry. Please try again." }, { status: 500 });
  }

  // Execute CRM Integration server-to-server (fail-safe)
  if (crmConfig.enabled) {
    try {
      const enquiryData: TIMSEnquiryData = {
        id: insertedId,
        firstName: doc.firstName,
        lastName: doc.lastName,
        phoneNumber: doc.phoneNumber,
        email: doc.email,
        company: doc.company,
        enquiry: doc.enquiry,
        source: doc.source,
        createdAt: now,
        ...(doc.utm_source ? { utm_source: doc.utm_source } : {}),
        ...(doc.utm_medium ? { utm_medium: doc.utm_medium } : {}),
        ...(doc.utm_campaign ? { utm_campaign: doc.utm_campaign } : {}),
        ...(doc.utm_term ? { utm_term: doc.utm_term } : {}),
        ...(doc.utm_content ? { utm_content: doc.utm_content } : {}),
      };

      const crmRes = await createLead(enquiryData, crmConfig);

      if (crmRes.success) {
        await db.collection(COLLECTION).updateOne(
          { _id: mongoId },
          {
            $set: {
              crmSyncStatus: "success",
              ...(crmRes.leadId ? { crmLeadId: crmRes.leadId } : {}),
              crmSyncedAt: new Date(),
              crmSyncAttempts: 1,
              crmLastSyncError: null,
            },
          }
        );
      } else {
        await db.collection(COLLECTION).updateOne(
          { _id: mongoId },
          {
            $set: {
              crmSyncStatus: crmRes.skipped ? "disabled" : "failed",
              crmSyncAttempts: 1,
              crmLastSyncError: crmRes.error || "CRM submission failed",
            },
          }
        );
      }
    } catch (crmErr) {
      console.error("CRM lead submission exception:", crmErr);
      try {
        await db.collection(COLLECTION).updateOne(
          { _id: mongoId },
          {
            $set: {
              crmSyncStatus: "failed",
              crmSyncAttempts: 1,
              crmLastSyncError: crmErr instanceof Error ? crmErr.message : "CRM error",
            },
          }
        );
      } catch {
        // Ignore DB update errors during fallback
      }
    }
  }

  return NextResponse.json({ id: insertedId, success: true }, { status: 201 });
}

export async function GET() {
  try {
    const db = await getDb();
    const enquiries = await db.collection(COLLECTION).find().sort({ createdAt: -1 }).limit(200).toArray();
    return NextResponse.json({
      enquiries: enquiries.map((e) => {
        const rawName = typeof e.name === "string" ? e.name.trim() : "";
        const nameParts = rawName.split(/\s+/);
        const resolvedFirstName = e.firstName || nameParts[0] || "";
        const resolvedLastName = e.lastName || nameParts.slice(1).join(" ") || "";

        return {
          id: e._id.toString(),
          firstName: resolvedFirstName,
          lastName: resolvedLastName,
          phoneNumber: e.phoneNumber || e.phone || "",
          email: e.email || "",
          company: e.company || "",
          enquiry: e.enquiry || e.preference || "",
          source: e.source || "unknown",
          createdAt: e.createdAt,
          crmSyncStatus: e.crmSyncStatus || "disabled",
          crmLeadId: e.crmLeadId || null,
          crmSyncedAt: e.crmSyncedAt || null,
          crmSyncAttempts: e.crmSyncAttempts || 0,
          crmLastSyncError: e.crmLastSyncError || null,
        };
      }),
    });
  } catch (error) {
    console.error("Failed to load enquiries:", error);
    return NextResponse.json({ error: "Could not load enquiries." }, { status: 500 });
  }
}

