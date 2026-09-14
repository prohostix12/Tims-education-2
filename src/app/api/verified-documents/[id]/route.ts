import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  VERIFIED_DOCS_COLLECTION,
  getVerifiedDocsMemoryStore,
  setVerifiedDocsMemoryStore,
} from "@/lib/verifiedDocumentsDb";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Document ID is required." }, { status: 400 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { title, pdfUrl, fileName, status, order } = body;

  const updateFields: Record<string, any> = {
    updatedAt: new Date(),
  };

  if (isNonEmptyString(title)) updateFields.title = title.trim();
  if (isNonEmptyString(pdfUrl)) updateFields.pdfUrl = pdfUrl.trim();
  if (isNonEmptyString(fileName)) updateFields.fileName = fileName.trim();
  if (status === "Published" || status === "Draft") updateFields.status = status;
  if (typeof order === "number") updateFields.order = order;

  // Update memory store
  const memory = getVerifiedDocsMemoryStore();
  const updatedMemory = memory.map((doc) =>
    doc.id === id || doc._id?.toString() === id ? { ...doc, ...updateFields } : doc
  );
  setVerifiedDocsMemoryStore(updatedMemory);

  try {
    const db = await getDb();
    let query: any = { _id: id };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    }

    const result = await db.collection(VERIFIED_DOCS_COLLECTION).findOneAndUpdate(
      query,
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (result) {
      const updatedDoc = {
        id: result._id.toString(),
        title: result.title,
        pdfUrl: result.pdfUrl,
        fileName: result.fileName,
        status: result.status,
        order: result.order,
        lastUpdated: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      return NextResponse.json({ document: updatedDoc });
    }
  } catch (error) {
    console.error(`Failed to update verified document ${id} in MongoDB:`, error);
  }

  const fallbackDoc = updatedMemory.find((d) => d.id === id || d._id?.toString() === id);
  return NextResponse.json({ document: fallbackDoc });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Document ID is required." }, { status: 400 });
  }

  // Update memory store
  const memory = getVerifiedDocsMemoryStore();
  setVerifiedDocsMemoryStore(memory.filter((d) => d.id !== id && d._id?.toString() !== id));

  try {
    const db = await getDb();
    let query: any = { _id: id };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    }

    await db.collection(VERIFIED_DOCS_COLLECTION).deleteOne(query);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete verified document ${id} from MongoDB:`, error);
    return NextResponse.json({ success: true, fallback: true });
  }
}
