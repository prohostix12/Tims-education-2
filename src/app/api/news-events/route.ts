import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "news_events";

type CreateNewsEventPayload = {
  type?: unknown;
  tag?: unknown;
  title?: unknown;
  description?: unknown;
  eventDate?: unknown;
  isMarquee?: unknown;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const marqueeOnly = searchParams.get("marquee") === "true";
    const typeFilter = searchParams.get("type");

    const query: Record<string, unknown> = {};
    if (marqueeOnly) {
      query.isMarquee = true;
    }
    if (typeFilter && (typeFilter === "news" || typeFilter === "event")) {
      query.type = typeFilter;
    }

    const db = await getDb();
    const items = await db.collection(COLLECTION).find(query).sort({ createdAt: -1 }).toArray();

    const formattedItems = items.map((item) => ({
      id: item._id.toString(),
      type: item.type || "news",
      tag: item.tag || "NEWS",
      title: item.title || "",
      description: item.description || "",
      eventDate: item.eventDate || "",
      isMarquee: Boolean(item.isMarquee),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return NextResponse.json({ items: formattedItems });
  } catch (error) {
    console.error("Failed to fetch news & events:", error);
    return NextResponse.json({ error: "Could not load news & events." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: CreateNewsEventPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { type, tag, title, description, eventDate, isMarquee } = body;

  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Main heading (title) is required." }, { status: 400 });
  }

  if (typeof description !== "string" || description.trim().length === 0) {
    return NextResponse.json({ error: "Description is required." }, { status: 400 });
  }

  const doc = {
    type: type === "event" ? "event" : "news",
    tag: typeof tag === "string" && tag.trim().length > 0 ? tag.trim().toUpperCase() : "NEWS",
    title: title.trim(),
    description: description.trim(),
    eventDate: typeof eventDate === "string" ? eventDate.trim() : "",
    isMarquee: typeof isMarquee === "boolean" ? isMarquee : true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        item: {
          id: result.insertedId.toString(),
          ...doc,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create news/event item:", error);
    return NextResponse.json({ error: "Could not save news/event item." }, { status: 500 });
  }
}
