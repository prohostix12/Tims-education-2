import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  HERO_CONTENT_COLLECTION,
  DEFAULT_HERO_CONTENT,
  getHeroMemoryStore,
  setHeroMemoryStore,
} from "@/lib/heroSectionDb";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET() {
  try {
    const db = await getDb();
    const doc = await db.collection(HERO_CONTENT_COLLECTION).findOne({});

    if (doc) {
      const data = {
        eyebrow: doc.eyebrow || DEFAULT_HERO_CONTENT.eyebrow,
        headingMain: doc.headingMain || DEFAULT_HERO_CONTENT.headingMain,
        headingHighlight: doc.headingHighlight || DEFAULT_HERO_CONTENT.headingHighlight,
        subtitle: doc.subtitle || DEFAULT_HERO_CONTENT.subtitle,
      };
      setHeroMemoryStore(data);
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Failed to fetch hero content from MongoDB (using fallback store):", error);
  }

  return NextResponse.json(getHeroMemoryStore());
}

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { eyebrow, headingMain, headingHighlight, subtitle } = body;

  const updatedData = {
    eyebrow: isNonEmptyString(eyebrow) ? eyebrow.trim() : DEFAULT_HERO_CONTENT.eyebrow,
    headingMain: isNonEmptyString(headingMain) ? headingMain.trim() : DEFAULT_HERO_CONTENT.headingMain,
    headingHighlight: isNonEmptyString(headingHighlight) ? headingHighlight.trim() : DEFAULT_HERO_CONTENT.headingHighlight,
    subtitle: isNonEmptyString(subtitle) ? subtitle.trim() : DEFAULT_HERO_CONTENT.subtitle,
    updatedAt: new Date(),
  };

  setHeroMemoryStore(updatedData);

  try {
    const db = await getDb();
    await db.collection(HERO_CONTENT_COLLECTION).updateOne(
      {},
      { $set: updatedData },
      { upsert: true }
    );
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error("Failed to save hero content in MongoDB (saved in memory):", error);
    return NextResponse.json({ success: true, data: updatedData, fallback: true });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
