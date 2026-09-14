import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { DistanceEducationData, DEFAULT_DISTANCE_EDUCATION_DATA } from "@/types/distanceEducation";

const COLLECTION = "distance_education_settings";

function detectVideoType(url: string): "upload" | "youtube" | "instagram" | "direct" {
  if (!url) return "upload";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("instagram.com")) return "instagram";
  if (url.startsWith("/api/files/") || url.startsWith("/images/")) return "upload";
  return "direct";
}

export async function GET() {
  try {
    const db = await getDb();
    const doc = await db.collection(COLLECTION).findOne({});

    if (!doc) {
      return NextResponse.json({ settings: DEFAULT_DISTANCE_EDUCATION_DATA });
    }

    const videoUrl = String(doc.videoUrl || DEFAULT_DISTANCE_EDUCATION_DATA.videoUrl);
    const videoType = doc.videoType || detectVideoType(videoUrl);

    return NextResponse.json({
      settings: {
        videoUrl,
        videoType,
        heading: String(doc.heading || DEFAULT_DISTANCE_EDUCATION_DATA.heading),
        subheading: String(doc.subheading || DEFAULT_DISTANCE_EDUCATION_DATA.subheading),
        badgeValue: String(doc.badgeValue || DEFAULT_DISTANCE_EDUCATION_DATA.badgeValue),
        badgeLabel: String(doc.badgeLabel || DEFAULT_DISTANCE_EDUCATION_DATA.badgeLabel),
        highlights: Array.isArray(doc.highlights) && doc.highlights.length > 0
          ? doc.highlights.map((h: unknown) => String(h))
          : DEFAULT_DISTANCE_EDUCATION_DATA.highlights,
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
      },
    });
  } catch (error) {
    console.error("Failed to load distance education settings from MongoDB:", error);
    return NextResponse.json({ settings: DEFAULT_DISTANCE_EDUCATION_DATA });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoUrl, videoType, heading, subheading, badgeValue, badgeLabel, highlights } = body || {};

    if (!videoUrl || typeof videoUrl !== "string") {
      return NextResponse.json({ error: "Please provide a valid video URL or upload a video file." }, { status: 400 });
    }

    const finalVideoUrl = videoUrl.trim();
    const finalVideoType = videoType || detectVideoType(finalVideoUrl);

    const updateDoc = {
      videoUrl: finalVideoUrl,
      videoType: finalVideoType,
      heading: String(heading || DEFAULT_DISTANCE_EDUCATION_DATA.heading).trim(),
      subheading: String(subheading || DEFAULT_DISTANCE_EDUCATION_DATA.subheading).trim(),
      badgeValue: String(badgeValue || DEFAULT_DISTANCE_EDUCATION_DATA.badgeValue).trim(),
      badgeLabel: String(badgeLabel || DEFAULT_DISTANCE_EDUCATION_DATA.badgeLabel).trim(),
      highlights: Array.isArray(highlights)
        ? highlights.map((h: unknown) => String(h).trim()).filter(Boolean)
        : DEFAULT_DISTANCE_EDUCATION_DATA.highlights,
      updatedAt: new Date(),
    };

    const db = await getDb();
    await db.collection(COLLECTION).updateOne({}, { $set: updateDoc }, { upsert: true });

    return NextResponse.json({
      success: true,
      settings: {
        ...updateDoc,
        updatedAt: updateDoc.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to save distance education settings to MongoDB:", error);
    return NextResponse.json({ error: "Failed to save settings. Please try again." }, { status: 500 });
  }
}
