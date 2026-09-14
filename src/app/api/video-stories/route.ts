import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

function detectVideoType(url: string): "file" | "instagram" | "youtube" | "url" {
  if (!url) return "url";
  const lower = url.toLowerCase();
  if (lower.includes("instagram.com/reel") || lower.includes("instagram.com/p/") || lower.includes("instagr.am")) {
    return "instagram";
  }
  if (lower.includes("youtube.com") || lower.includes("youtu.be") || lower.includes("youtube.com/shorts")) {
    return "youtube";
  }
  if (lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.includes("/api/files/")) {
    return "file";
  }
  return "url";
}

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection("video_stories");

    const stories = await collection
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const formattedStories = stories.map((item) => ({
      id: item._id.toString(),
      videoUrl: item.videoUrl || "",
      videoType: item.videoType || detectVideoType(item.videoUrl || ""),
      thumbnailUrl: item.thumbnailUrl || "",
      duration: item.duration || "0:30",
      isPublished: item.isPublished ?? true,
      order: item.order ?? 0,
      createdAt: item.createdAt || new Date().toISOString(),
    }));

    return NextResponse.json({ stories: formattedStories });
  } catch (error) {
    console.error("Failed to fetch video stories:", error);
    return NextResponse.json({ error: "Failed to fetch video stories." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoUrl, thumbnailUrl, duration, isPublished = true, order = 0 } = body;

    if (!videoUrl) {
      return NextResponse.json({ error: "Video URL or File is required." }, { status: 400 });
    }

    const videoType = detectVideoType(videoUrl);
    const db = await getDb();
    const collection = db.collection("video_stories");

    const newStory = {
      videoUrl,
      videoType,
      thumbnailUrl: thumbnailUrl || "",
      duration: duration || "0:30",
      isPublished: Boolean(isPublished),
      order: Number(order) || 0,
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newStory);

    return NextResponse.json(
      {
        success: true,
        story: { id: result.insertedId.toString(), ...newStory },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create video story:", error);
    return NextResponse.json({ error: "Failed to create video story." }, { status: 500 });
  }
}
