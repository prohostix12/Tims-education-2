import { getDb } from "@/lib/mongodb";
import { preferenceLabel } from "@/lib/coursePreferences";

/**
 * Migrates existing legacy documents in MongoDB `enquiries` collection to the new schema:
 * - `name` -> `firstName` & `lastName`
 * - `phone` -> `phoneNumber`
 * - `preference` -> `enquiry`
 * - `company` -> `""`
 */
export async function migrateEnquiriesCollection(): Promise<{
  totalCount: number;
  migratedCount: number;
}> {
  const db = await getDb();
  const collection = db.collection("enquiries");
  const docs = await collection.find({}).toArray();

  let migratedCount = 0;

  for (const doc of docs) {
    let modified = false;
    const updateFields: Record<string, unknown> = {};

    // 1. Migrate Name -> firstName & lastName
    if (!doc.firstName) {
      const rawName = typeof doc.name === "string" ? doc.name.trim() : "";
      if (rawName) {
        const parts = rawName.split(/\s+/);
        updateFields.firstName = parts[0] || "";
        updateFields.lastName = parts.slice(1).join(" ") || "";
      } else {
        updateFields.firstName = "Anonymous";
        updateFields.lastName = "";
      }
      modified = true;
    }

    // 2. Migrate Phone -> phoneNumber
    if (!doc.phoneNumber) {
      updateFields.phoneNumber = typeof doc.phone === "string" ? doc.phone.trim() : "";
      modified = true;
    }

    // 3. Migrate Preference -> enquiry
    if (!doc.enquiry) {
      const legacyPref = typeof doc.preference === "string" ? doc.preference.trim() : "";
      updateFields.enquiry = legacyPref ? `Enquiry regarding: ${preferenceLabel(legacyPref)}` : "Website Enquiry";
      modified = true;
    }

    // 4. Default Company
    if (doc.company === undefined) {
      updateFields.company = "";
      modified = true;
    }

    if (modified) {
      await collection.updateOne({ _id: doc._id }, { $set: updateFields });
      migratedCount++;
    }
  }

  return { totalCount: docs.length, migratedCount };
}
