import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "gallery";

type CreateGalleryPayload = {
  sectionName?: unknown;
  images?: unknown;
  homeImages?: unknown;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isHomeQuery = searchParams.get("home") === "true" || searchParams.get("featured") === "true";

    const db = await getDb();
    const items = await db.collection(COLLECTION).find().sort({ createdAt: -1 }).toArray();

    const sections = items.map((item) => ({
      id: item._id.toString(),
      sectionName: item.sectionName || "Untitled Section",
      images: Array.isArray(item.images) ? item.images : [],
      homeImages: Array.isArray(item.homeImages) ? item.homeImages : [],
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    if (isHomeQuery) {
      // Gather all images specifically marked by admin for the Landing Page
      const homeImages: string[] = [];
      sections.forEach((sec) => {
        if (Array.isArray(sec.homeImages)) {
          sec.homeImages.forEach((img) => {
            if (typeof img === "string" && img.trim().length > 0 && !homeImages.includes(img)) {
              homeImages.push(img);
            }
          });
        }
      });

      return NextResponse.json({ homeImages, sections });
    }

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

  const { sectionName, images, homeImages } = body;

  if (typeof sectionName !== "string" || sectionName.trim().length === 0) {
    return NextResponse.json({ error: "Section name (event name) is required." }, { status: 400 });
  }

  if (!Array.isArray(images)) {
    return NextResponse.json({ error: "Images must be an array." }, { status: 400 });
  }

  const cleanedImages = images.filter((img): img is string => typeof img === "string" && img.trim().length > 0);
  const cleanedHomeImages = Array.isArray(homeImages)
    ? homeImages.filter((img): img is string => typeof img === "string" && img.trim().length > 0 && cleanedImages.includes(img))
    : [];

  const doc = {
    sectionName: sectionName.trim(),
    images: cleanedImages,
    homeImages: cleanedHomeImages,
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
