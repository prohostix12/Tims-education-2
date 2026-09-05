import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "news_events";

type UpdateNewsEventPayload = {
  type?: unknown;
  tag?: unknown;
  title?: unknown;
  description?: unknown;
  eventDate?: unknown;
  isMarquee?: unknown;
};

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid item ID." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const item = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });

    if (!item) {
      return NextResponse.json({ error: "News or event item not found." }, { status: 404 });
    }

    return NextResponse.json({
      item: {
        id: item._id.toString(),
        type: item.type || "news",
        tag: item.tag || "NEWS",
        title: item.title || "",
        description: item.description || "",
        eventDate: item.eventDate || "",
        isMarquee: Boolean(item.isMarquee),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
  } catch (error) {
    console.error("Failed to fetch news/event item:", error);
    return NextResponse.json({ error: "Could not load item." }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid item ID." }, { status: 400 });
  }

  let body: UpdateNewsEventPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { type, tag, title, description, eventDate, isMarquee } = body;
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (typeof type === "string" && (type === "news" || type === "event")) {
    updateData.type = type;
  }
  if (typeof tag === "string" && tag.trim().length > 0) {
    updateData.tag = tag.trim().toUpperCase();
  }
  if (typeof title === "string" && title.trim().length > 0) {
    updateData.title = title.trim();
  }
  if (typeof description === "string" && description.trim().length > 0) {
    updateData.description = description.trim();
  }
  if (typeof eventDate === "string") {
    updateData.eventDate = eventDate.trim();
  }
  if (typeof isMarquee === "boolean") {
    updateData.isMarquee = isMarquee;
  }

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "News or event item not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update news/event item:", error);
    return NextResponse.json({ error: "Could not update item." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid item ID." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "News or event item not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete news/event item:", error);
    return NextResponse.json({ error: "Could not delete item." }, { status: 500 });
  }
}
