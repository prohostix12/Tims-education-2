import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "gallery";

type UpdateGalleryPayload = {
  sectionName?: unknown;
  images?: unknown;
};

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid section ID." }, { status: 400 });
  }

  let body: UpdateGalleryPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { sectionName, images } = body;
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (typeof sectionName === "string" && sectionName.trim().length > 0) {
    updateData.sectionName = sectionName.trim();
  }

  if (Array.isArray(images)) {
    updateData.images = images.filter((img): img is string => typeof img === "string" && img.trim().length > 0);
  }

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Gallery section not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update gallery section:", error);
    return NextResponse.json({ error: "Could not update gallery section." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid section ID." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Gallery section not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete gallery section:", error);
    return NextResponse.json({ error: "Could not delete gallery section." }, { status: 500 });
  }
}
