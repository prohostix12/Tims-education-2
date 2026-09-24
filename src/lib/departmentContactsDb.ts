import { getDb } from "./mongodb";
import { ObjectId } from "mongodb";

export const DEPARTMENT_CONTACTS_COLLECTION = "department_contacts";

export interface DepartmentContact {
  _id?: string;
  id: string;
  departmentName: string;
  description?: string;
  landline?: string;
  mobile?: string;
  email?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function getDepartmentContacts(): Promise<DepartmentContact[]> {
  try {
    const db = await getDb();
    const collection = db.collection(DEPARTMENT_CONTACTS_COLLECTION);

    const docs = await collection
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    if (!docs || docs.length === 0) {
      return [];
    }

    return docs.map((doc, index) => ({
      _id: doc._id.toString(),
      id: typeof doc.id === "string" ? doc.id : doc._id.toString(),
      departmentName: String(doc.departmentName || doc.title || ""),
      description: doc.description ? String(doc.description) : "",
      landline: doc.landline ? String(doc.landline) : doc.phone ? String(doc.phone) : "",
      mobile: doc.mobile ? String(doc.mobile) : "",
      email: doc.email ? String(doc.email) : "",
      order: typeof doc.order === "number" ? doc.order : index + 1,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined,
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch department contacts from DB:", error);
    return [];
  }
}

export async function createDepartmentContact(
  data: Omit<DepartmentContact, "id">
): Promise<DepartmentContact> {
  const db = await getDb();
  const collection = db.collection(DEPARTMENT_CONTACTS_COLLECTION);
  const count = await collection.countDocuments();

  const newDoc = {
    id: new ObjectId().toString(),
    departmentName: data.departmentName.trim(),
    description: (data.description || "").trim(),
    landline: (data.landline || "").trim(),
    mobile: (data.mobile || "").trim(),
    email: (data.email || "").trim(),
    order: typeof data.order === "number" ? data.order : count + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const res = await collection.insertOne(newDoc);
  return {
    ...newDoc,
    _id: res.insertedId.toString(),
    createdAt: newDoc.createdAt.toISOString(),
    updatedAt: newDoc.updatedAt.toISOString(),
  };
}

export async function updateDepartmentContact(
  id: string,
  data: Partial<DepartmentContact>
): Promise<boolean> {
  const db = await getDb();
  const collection = db.collection(DEPARTMENT_CONTACTS_COLLECTION);

  const filter: Record<string, unknown> = ObjectId.isValid(id)
    ? { $or: [{ id }, { _id: new ObjectId(id) }] }
    : { id };

  const updateFields: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (data.departmentName !== undefined) updateFields.departmentName = data.departmentName.trim();
  if (data.description !== undefined) updateFields.description = data.description.trim();
  if (data.landline !== undefined) updateFields.landline = data.landline.trim();
  if (data.mobile !== undefined) updateFields.mobile = data.mobile.trim();
  if (data.email !== undefined) updateFields.email = data.email.trim();
  if (typeof data.order === "number") updateFields.order = data.order;

  const res = await collection.updateOne(filter, { $set: updateFields });
  return res.matchedCount > 0;
}

export async function deleteDepartmentContact(id: string): Promise<boolean> {
  const db = await getDb();
  const collection = db.collection(DEPARTMENT_CONTACTS_COLLECTION);

  const filter: Record<string, unknown> = ObjectId.isValid(id)
    ? { $or: [{ id }, { _id: new ObjectId(id) }] }
    : { id };

  const res = await collection.deleteOne(filter);
  return res.deletedCount > 0;
}
