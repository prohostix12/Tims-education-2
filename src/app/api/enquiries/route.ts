import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { createLead, getCRMConfig, type TIMSEnquiryData } from "@/lib/crmService";

const COLLECTION = "enquiries";

type EnquiryPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  preference?: unknown;
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

  const { name, email, phone, preference, source, utm_source, utm_medium, utm_campaign, utm_term, utm_content } = body;

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(phone)) {
    return NextResponse.json({ error: "Name, email, and phone are required." }, { status: 400 });
  }

  const now = new Date();
  const crmConfig = await getCRMConfig();

  const doc = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    preference: isNonEmptyString(preference) ? preference.trim() : "",
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
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        preference: doc.preference,
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

  return NextResponse.json({ id: insertedId }, { status: 201 });
}

export async function GET() {
  try {
    const db = await getDb();
    const enquiries = await db.collection(COLLECTION).find().sort({ createdAt: -1 }).limit(200).toArray();
    return NextResponse.json({
      enquiries: enquiries.map((e) => ({
        id: e._id.toString(),
        name: e.name,
        email: e.email,
        phone: e.phone,
        preference: e.preference,
        source: e.source,
        createdAt: e.createdAt,
        crmSyncStatus: e.crmSyncStatus || "disabled",
        crmLeadId: e.crmLeadId || null,
        crmSyncedAt: e.crmSyncedAt || null,
        crmSyncAttempts: e.crmSyncAttempts || 0,
        crmLastSyncError: e.crmLastSyncError || null,
      })),
    });
  } catch (error) {
    console.error("Failed to load enquiries:", error);
    return NextResponse.json({ error: "Could not load enquiries." }, { status: 500 });
  }
}

