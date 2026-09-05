import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "success_stories";

type CreateSuccessStoryPayload = {
  title?: unknown;
  caption?: unknown;
  category?: unknown;
  dateLocation?: unknown;
  imageSrc?: unknown;
  imageAlt?: unknown;
  tagBg?: unknown;
  tagColor?: unknown;
  studentName?: unknown;
  role?: unknown;
  order?: unknown;
  isPublished?: unknown;
};

export async function GET() {
  try {
    const db = await getDb();
    const items = await db.collection(COLLECTION).find().sort({ order: 1, createdAt: -1 }).toArray();

    const formattedItems = items.map((item) => ({
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
    }));

    return NextResponse.json({ stories: formattedItems });
  } catch (error) {
    console.error("Failed to fetch success stories:", error);
    return NextResponse.json({ error: "Could not load success stories." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: CreateSuccessStoryPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const {
    title,
    caption,
    category,
    dateLocation,
    imageSrc,
    imageAlt,
    tagBg,
    tagColor,
    studentName,
    role,
    order,
    isPublished,
  } = body;

  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Base heading (title) is required." }, { status: 400 });
  }

  if (typeof caption !== "string" || caption.trim().length === 0) {
    return NextResponse.json({ error: "Description is required." }, { status: 400 });
  }

  if (typeof category !== "string" || category.trim().length === 0) {
    return NextResponse.json({ error: "Event name / Category tag is required." }, { status: 400 });
  }

  if (typeof imageSrc !== "string" || imageSrc.trim().length === 0) {
    return NextResponse.json({ error: "Image URL or file path is required." }, { status: 400 });
  }

  const doc = {
    title: title.trim(),
    caption: caption.trim(),
    category: category.trim().toUpperCase(),
    dateLocation: typeof dateLocation === "string" ? dateLocation.trim() : "",
    imageSrc: imageSrc.trim(),
    imageAlt: typeof imageAlt === "string" ? imageAlt.trim() : title.trim(),
    tagBg: typeof tagBg === "string" && tagBg.trim().length > 0 ? tagBg.trim() : "#ffe4e2",
    tagColor: typeof tagColor === "string" && tagColor.trim().length > 0 ? tagColor.trim() : "#dc2626",
    studentName: typeof studentName === "string" ? studentName.trim() : "",
    role: typeof role === "string" ? role.trim() : "",
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
        story: {
          id: result.insertedId.toString(),
          ...doc,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create success story:", error);
    return NextResponse.json({ error: "Could not save success story card." }, { status: 500 });
  }
}
