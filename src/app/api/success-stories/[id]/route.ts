import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "success_stories";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid story ID format." }, { status: 400 });
    }

    const db = await getDb();
    const item = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });

    if (!item) {
      return NextResponse.json({ error: "Story card not found." }, { status: 404 });
    }

    return NextResponse.json({
      story: {
        id: item._id.toString(),
        title: item.title || "",
        caption: item.caption || "",
        category: item.category || "EVENT",
        dateLocation: item.dateLocation || "",
        imageSrc: item.imageSrc || "",
        imageAlt: item.imageAlt || "",
        tagBg: item.tagBg || "#ffe4e2",
        tagColor: item.tagColor || "#dc2626",
        studentName: item.studentName || "",
        role: item.role || "",
        order: typeof item.order === "number" ? item.order : 0,
        isPublished: typeof item.isPublished === "boolean" ? item.isPublished : true,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
  } catch (error) {
    console.error("Failed to fetch story card:", error);
    return NextResponse.json({ error: "Could not load story card." }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid story ID format." }, { status: 400 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const updateDoc: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (typeof body.title === "string" && body.title.trim().length > 0) {
      updateDoc.title = body.title.trim();
    }
    if (typeof body.caption === "string" && body.caption.trim().length > 0) {
      updateDoc.caption = body.caption.trim();
    }
    if (typeof body.category === "string" && body.category.trim().length > 0) {
      updateDoc.category = body.category.trim().toUpperCase();
    }
    if (typeof body.dateLocation === "string") {
      updateDoc.dateLocation = body.dateLocation.trim();
    }
    if (typeof body.imageSrc === "string" && body.imageSrc.trim().length > 0) {
      updateDoc.imageSrc = body.imageSrc.trim();
    }
    if (typeof body.imageAlt === "string") {
      updateDoc.imageAlt = body.imageAlt.trim();
    }
    if (typeof body.tagBg === "string") {
      updateDoc.tagBg = body.tagBg.trim();
    }
    if (typeof body.tagColor === "string") {
      updateDoc.tagColor = body.tagColor.trim();
    }
    if (typeof body.studentName === "string") {
      updateDoc.studentName = body.studentName.trim();
    }
    if (typeof body.role === "string") {
      updateDoc.role = body.role.trim();
    }
    if (typeof body.order === "number") {
      updateDoc.order = body.order;
    }
    if (typeof body.isPublished === "boolean") {
      updateDoc.isPublished = body.isPublished;
    }

    const db = await getDb();
    const result = await db
      .collection(COLLECTION)
      .updateOne({ _id: new ObjectId(id) }, { $set: updateDoc });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Story card not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Story card updated successfully." });
  } catch (error) {
    console.error("Failed to update story card:", error);
    return NextResponse.json({ error: "Could not update story card." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid story ID format." }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Story card not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Story card deleted successfully." });
  } catch (error) {
    console.error("Failed to delete story card:", error);
    return NextResponse.json({ error: "Could not delete story card." }, { status: 500 });
  }
}
