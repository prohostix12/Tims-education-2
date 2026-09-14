import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  VERIFIED_DOCS_COLLECTION,
  getVerifiedDocsMemoryStore,
  setVerifiedDocsMemoryStore,
  VerifiedDocumentDoc,
} from "@/lib/verifiedDocumentsDb";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection(VERIFIED_DOCS_COLLECTION)
      .find()
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const dbDocuments = docs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      pdfUrl: doc.pdfUrl || "",
      fileName: doc.fileName || doc.pdfUrl?.split("/").pop() || "",
      status: doc.status || "Published",
      order: typeof doc.order === "number" ? doc.order : 1,
      lastUpdated: doc.updatedAt
        ? new Date(doc.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Today",
    }));

    setVerifiedDocsMemoryStore(dbDocuments as any);
    return NextResponse.json({ documents: dbDocuments });
  } catch (error) {
    console.error("Failed to fetch verified documents from MongoDB (using fallback store):", error);
    const memoryDocs = getVerifiedDocsMemoryStore();
    return NextResponse.json({ documents: memoryDocs, fallback: true });
  }
}

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { title, pdfUrl, fileName, status, order } = body;

  if (!isNonEmptyString(title)) {
    return NextResponse.json({ error: "Document title is required." }, { status: 400 });
  }

  if (!isNonEmptyString(pdfUrl)) {
    return NextResponse.json({ error: "PDF document file or URL is required." }, { status: 400 });
  }

  const newDoc: VerifiedDocumentDoc & { lastUpdated?: string } = {
    id: `doc-${Date.now()}`,
    title: title.trim(),
    pdfUrl: pdfUrl.trim(),
    fileName: isNonEmptyString(fileName) ? fileName.trim() : pdfUrl.split("/").pop() || "document.pdf",
    status: status === "Draft" ? "Draft" : "Published",
    order: typeof order === "number" ? order : 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUpdated: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };

  const memory = getVerifiedDocsMemoryStore();
  setVerifiedDocsMemoryStore([newDoc, ...memory]);

  try {
    const db = await getDb();
    const result = await db.collection(VERIFIED_DOCS_COLLECTION).insertOne({
      title: newDoc.title,
      pdfUrl: newDoc.pdfUrl,
      fileName: newDoc.fileName,
      status: newDoc.status,
      order: newDoc.order,
      createdAt: newDoc.createdAt,
      updatedAt: newDoc.updatedAt,
    });

    return NextResponse.json({ ...newDoc, id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("Failed to insert verified document into MongoDB (saved in memory):", error);
    return NextResponse.json(newDoc, { status: 201 });
  }
}
