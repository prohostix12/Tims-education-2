import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "directors";

type CreateDirectorPayload = {
  name?: unknown;
  role?: unknown;
  image?: unknown;
  accentBg?: unknown;
  bio?: unknown;
  order?: unknown;
  isPublished?: unknown;
};

export async function GET() {
  try {
    const db = await getDb();
    const items = await db.collection(COLLECTION).find().sort({ order: 1, createdAt: -1 }).toArray();

    const formattedDirectors = items.map((item) => ({
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
    }));

    return NextResponse.json({ directors: formattedDirectors });
  } catch (error) {
    console.error("Failed to fetch directors:", error);
    return NextResponse.json({ error: "Could not load directors." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: CreateDirectorPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { name, role, image, accentBg, bio, order, isPublished } = body;

  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Director full name is required." }, { status: 400 });
  }

  if (typeof role !== "string" || role.trim().length === 0) {
    return NextResponse.json({ error: "Director role / title is required." }, { status: 400 });
  }

  const doc = {
    name: name.trim(),
    role: role.trim(),
    image: typeof image === "string" ? image.trim() : "",
    accentBg: typeof accentBg === "string" && accentBg.trim().length > 0 ? accentBg.trim() : "#14161c",
    bio: typeof bio === "string" ? bio.trim() : "",
    order: typeof order === "number" ? order : 0,
    isPublished: typeof isPublished === "boolean" ? isPublished : true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        director: {
          id: result.insertedId.toString(),
          ...doc,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create director:", error);
    return NextResponse.json({ error: "Could not save director profile." }, { status: 500 });
  }
}
