import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "universities";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid university ID." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const item = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });

    if (!item) {
      return NextResponse.json({ error: "University not found." }, { status: 404 });
    }

    return NextResponse.json({
      university: {
        id: item._id.toString(),
        name: item.name || "",
        slug: item.slug || "",
        href: item.href || "",
        category: item.category || "degree-pg",
        categoryLabel: item.categoryLabel || "",
        logo: item.logo || "",
        image: item.image || "",
        description: item.description || "",
        about: item.about || "",
        brochure: item.brochure || "",
        accreditations: Array.isArray(item.accreditations) ? item.accreditations : [],
        courses: Array.isArray(item.courses) ? item.courses : [],
        shape: item.shape || "hexagon",
        accent: item.accent || "red",
        status: item.status || "published",
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
  } catch (error) {
    console.error("Failed to load university:", error);
    return NextResponse.json({ error: "Could not load university." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid university ID." }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "University name is required." }, { status: 400 });
  }

  const slug =
    typeof body.slug === "string" && body.slug.trim().length > 0
      ? body.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const category = body.category === "10th-plus-two" ? "10th-plus-two" : "degree-pg";
  const categoryLabel =
    typeof body.categoryLabel === "string" && body.categoryLabel.trim()
      ? body.categoryLabel.trim()
      : category === "10th-plus-two"
      ? "10th & Plus Two"
      : "Degree & PG";

  const defaultHref =
    category === "10th-plus-two"
      ? `/universities/10th-plus-two/${slug}`
      : `/universities/degree-pg/${slug}`;

  const href = typeof body.href === "string" && body.href.trim() ? body.href.trim() : defaultHref;
  const logo = typeof body.logo === "string" ? body.logo.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const about = typeof body.about === "string" ? body.about.trim() : "";
  const brochure = typeof body.brochure === "string" ? body.brochure.trim() : "";

  const accreditations = Array.isArray(body.accreditations)
    ? body.accreditations.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : typeof body.accreditations === "string"
    ? body.accreditations.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const courses = Array.isArray(body.courses)
    ? body.courses.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : typeof body.courses === "string"
    ? body.courses.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const shape =
    typeof body.shape === "string" && ["hexagon", "diamond", "circle", "pentagon", "shield"].includes(body.shape)
      ? body.shape
      : "hexagon";

  const accent =
    typeof body.accent === "string" && ["red", "navy", "gold"].includes(body.accent) ? body.accent : "red";

  const status = body.status === "draft" ? "draft" : "published";

  const updateDoc = {
    name,
    slug,
    href,
    category,
    categoryLabel,
    logo,
    image,
    description,
    about,
    brochure,
    accreditations,
    courses,
    shape,
    accent,
    status,
    updatedAt: new Date(),
  };

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "University not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      university: {
        id,
        ...updateDoc,
      },
    });
  } catch (error) {
    console.error("Failed to update university:", error);
    return NextResponse.json({ error: "Could not update university document." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid university ID." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "University not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Failed to delete university:", error);
    return NextResponse.json({ error: "Could not delete university." }, { status: 500 });
  }
}
