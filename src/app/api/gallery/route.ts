import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "gallery";

type CreateGalleryPayload = {
  sectionName?: unknown;
  images?: unknown;
};

export async function GET() {
  try {
    const db = await getDb();
    const items = await db.collection(COLLECTION).find().sort({ createdAt: -1 }).toArray();

    const sections = items.map((item) => ({
      id: item._id.toString(),
      sectionName: item.sectionName || "Untitled Section",
      images: Array.isArray(item.images) ? item.images : [],
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return NextResponse.json({ sections });
  } catch (error) {
    console.error("Failed to load gallery sections:", error);
    return NextResponse.json({ error: "Could not load gallery sections." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: CreateGalleryPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { sectionName, images } = body;

  if (typeof sectionName !== "string" || sectionName.trim().length === 0) {
    return NextResponse.json({ error: "Section name (event name) is required." }, { status: 400 });
  }

  if (!Array.isArray(images)) {
    return NextResponse.json({ error: "Images must be an array." }, { status: 400 });
  }

  const cleanedImages = images.filter((img): img is string => typeof img === "string" && img.trim().length > 0);

  const doc = {
    sectionName: sectionName.trim(),
    images: cleanedImages,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).insertOne(doc);
    return NextResponse.json(
      {
        success: true,
        section: {
          id: result.insertedId.toString(),
          ...doc,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create gallery section:", error);
    return NextResponse.json({ error: "Could not save gallery section." }, { status: 500 });
  }
}
