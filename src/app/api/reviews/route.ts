import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "reviews";
const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB, before base64 overhead

type ReviewPayload = {
  name?: unknown;
  date?: unknown;
  rating?: unknown;
  image?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET() {
  try {
    const db = await getDb();
    const reviews = await db.collection(COLLECTION).find().sort({ createdAt: -1 }).limit(200).toArray();
    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r._id.toString(),
        name: r.name,
        date: r.date,
        rating: r.rating,
        image: r.image,
        createdAt: r.createdAt,
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

  const { name, date, rating, image } = body;

  if (!isNonEmptyString(name)) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!isNonEmptyString(date)) {
    return NextResponse.json({ error: "Date is required." }, { status: 400 });
  }
  const ratingNumber = Number(rating);
  if (!Number.isFinite(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
    return NextResponse.json({ error: "Rating must be a number between 1 and 5." }, { status: 400 });
  }
  if (image !== undefined && image !== null) {
    if (typeof image !== "string" || !image.startsWith("data:image/")) {
      return NextResponse.json({ error: "Image must be an uploaded image file." }, { status: 400 });
    }
    // Rough size check on the base64 payload (~4/3 the original byte size).
    if (image.length > (MAX_IMAGE_BYTES * 4) / 3) {
      return NextResponse.json({ error: "Image is too large. Please use a file under 3MB." }, { status: 400 });
    }
  }

  const doc = {
    name: name.trim(),
    date: date.trim(),
    rating: Math.round(ratingNumber),
    image: isNonEmptyString(image) ? image : null,
    createdAt: new Date(),
  };

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).insertOne(doc);
    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Failed to save review:", error);
    return NextResponse.json({ error: "Could not save review. Please try again." }, { status: 500 });
  }
}
