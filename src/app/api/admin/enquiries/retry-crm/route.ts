import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { createLead, type TIMSEnquiryData } from "@/lib/crmService";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const enquiryId = body.enquiryId || body.id;

    if (!enquiryId || typeof enquiryId !== "string") {
      return NextResponse.json({ success: false, error: "Enquiry ID is required." }, { status: 400 });
    }

    const db = await getDb();
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(enquiryId);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid enquiry ID format." }, { status: 400 });
    }

    const doc = await db.collection("enquiries").findOne({ _id: objectId });

    if (!doc) {
      return NextResponse.json({ success: false, error: "Enquiry record not found." }, { status: 404 });
    }

    const rawName = typeof doc.name === "string" ? doc.name.trim() : "";
    const parts = rawName.split(/\s+/);
    const firstName = doc.firstName || parts[0] || "";
    const lastName = doc.lastName || parts.slice(1).join(" ") || "";

    const enquiryData: TIMSEnquiryData = {
      id: doc._id.toString(),
      firstName,
      lastName,
      phoneNumber: doc.phoneNumber || doc.phone || "",
      email: doc.email || "",
      company: doc.company || "",
      enquiry: doc.enquiry || doc.preference || "",
      source: doc.source || "",
      createdAt: doc.createdAt,
    };

    const currentAttempts = (typeof doc.crmSyncAttempts === "number" ? doc.crmSyncAttempts : 0) + 1;
    const crmRes = await createLead(enquiryData);

    const now = new Date();
    if (crmRes.success) {
      await db.collection("enquiries").updateOne(
        { _id: objectId },
        {
          $set: {
            crmSyncStatus: "success",
            ...(crmRes.leadId ? { crmLeadId: crmRes.leadId } : {}),
            crmSyncedAt: now,
            crmSyncAttempts: currentAttempts,
            crmLastSyncError: null,
          },
        }
      );
      return NextResponse.json({
        success: true,
        message: "Enquiry successfully synchronized with PypeCRM.",
        leadId: crmRes.leadId,
      });
    } else {
      await db.collection("enquiries").updateOne(
        { _id: objectId },
        {
          $set: {
            crmSyncStatus: crmRes.skipped ? "disabled" : "failed",
            crmSyncAttempts: currentAttempts,
            crmLastSyncError: crmRes.error || "CRM sync failed",
          },
        }
      );
      return NextResponse.json(
        {
          success: false,
          error: crmRes.error || "Failed to sync enquiry with PypeCRM.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("POST /api/admin/enquiries/retry-crm error:", error);
    return NextResponse.json(
      { success: false, error: "Server error while retrying CRM synchronization." },
      { status: 500 }
    );
  }
}
