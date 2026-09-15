import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "reviews";
const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB

type ReviewPayload = {
  name?: unknown;
  date?: unknown;
  rating?: unknown;
  text?: unknown;
  image?: unknown;
  selected?: unknown;
  source?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fetchAll = searchParams.get("all") === "true";

    const db = await getDb();
    const query = fetchAll ? {} : { selected: true };

    const reviews = await db
      .collection(COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r._id.toString(),
        name: r.name,
        date: r.date || new Date(r.createdAt || Date.now()).toISOString().slice(0, 10),
        rating: r.rating || 5,
        text: r.text || "",
        image: r.image || null,
        selected: Boolean(r.selected),
        source: r.source || "student",
        createdAt: r.createdAt || new Date(),
      })),
    });
  } catch (error) {
    console.error("Failed to load reviews:", error);
    return NextResponse.json({ error: "Could not load reviews." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: ReviewPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, date, rating, text, image, selected, source } = body;

  if (!isNonEmptyString(name)) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  if (!isNonEmptyString(text)) {
    return NextResponse.json({ error: "Review text is required." }, { status: 400 });
  }

  const ratingNumber = Number(rating);
  if (!Number.isFinite(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
    return NextResponse.json({ error: "Rating must be a number between 1 and 5." }, { status: 400 });
  }

  if (image !== undefined && image !== null && isNonEmptyString(image)) {
    if (typeof image === "string" && image.startsWith("data:image/")) {
      if (image.length > (MAX_IMAGE_BYTES * 4) / 3) {
        return NextResponse.json({ error: "Image is too large. Please use a file under 3MB." }, { status: 400 });
      }
    }
  }

  const displayDate = isNonEmptyString(date)
    ? date.trim()
    : new Date().toISOString().slice(0, 10);

  const doc = {
    name: name.trim(),
    rating: Math.round(ratingNumber),
    text: (text as string).trim(),
    date: displayDate,
    image: isNonEmptyString(image) ? image.trim() : null,
    selected: typeof selected === "boolean" ? selected : false,
    source: source === "admin" ? "admin" : "student",
    createdAt: new Date(),
  };

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).insertOne(doc);
    return NextResponse.json({ id: result.insertedId.toString(), ...doc }, { status: 201 });
  } catch (error) {
    console.error("Failed to save review:", error);
    return NextResponse.json({ error: "Could not save review. Please try again." }, { status: 500 });
  }
}

