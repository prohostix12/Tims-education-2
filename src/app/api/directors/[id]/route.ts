import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "directors";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid director ID format." }, { status: 400 });
    }

    const db = await getDb();
    const item = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });

    if (!item) {
      return NextResponse.json({ error: "Director profile not found." }, { status: 404 });
    }

    return NextResponse.json({
      director: {
        id: item._id.toString(),
        name: item.name || "",
        role: item.role || "",
        image: item.image || "",
        accentBg: item.accentBg || "#14161c",
        bio: item.bio || "",
        order: typeof item.order === "number" ? item.order : 0,
        isPublished: typeof item.isPublished === "boolean" ? item.isPublished : true,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
  } catch (error) {
    console.error("Failed to fetch director:", error);
    return NextResponse.json({ error: "Could not load director profile." }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid director ID format." }, { status: 400 });
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

    if (typeof body.name === "string" && body.name.trim().length > 0) {
      updateDoc.name = body.name.trim();
    }
    if (typeof body.role === "string" && body.role.trim().length > 0) {
      updateDoc.role = body.role.trim();
    }
    if (typeof body.image === "string") {
      updateDoc.image = body.image.trim();
    }
    if (typeof body.accentBg === "string" && body.accentBg.trim().length > 0) {
      updateDoc.accentBg = body.accentBg.trim();
    }
    if (typeof body.bio === "string") {
      updateDoc.bio = body.bio.trim();
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
      return NextResponse.json({ error: "Director profile not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Director profile updated successfully." });
  } catch (error) {
    console.error("Failed to update director:", error);
    return NextResponse.json({ error: "Could not update director profile." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid director ID format." }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Director profile not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Director profile deleted successfully." });
  } catch (error) {
    console.error("Failed to delete director:", error);
    return NextResponse.json({ error: "Could not delete director profile." }, { status: 500 });
  }
}
