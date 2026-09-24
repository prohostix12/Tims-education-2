import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "universities";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Slug parameter is required." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const item = await db.collection(COLLECTION).findOne({ slug: slug.toLowerCase() });

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
        aboutHeading: item.aboutHeading || "",
        about: item.about || "",
        achievementsTitle: item.achievementsTitle || "",
        achievementsText: item.achievementsText || "",
        affiliationsText: item.affiliationsText || "",
        cdoeTitle: item.cdoeTitle || "",
        cdoeText: item.cdoeText || "",
        programsHeading: item.programsHeading || "Course Fees",
        programsTable: Array.isArray(item.programsTable) ? item.programsTable : [],
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
    console.error("Failed to load university by slug:", error);
    return NextResponse.json({ error: "Could not load university." }, { status: 500 });
  }
}
