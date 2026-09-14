import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid video story ID." }, { status: 400 });
    }

    const body = await request.json();
    const { videoUrl, thumbnailUrl, duration, isPublished, order } = body;

    const db = await getDb();
    const collection = db.collection("video_stories");

    const updateDoc: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (videoUrl !== undefined) {
      updateDoc.videoUrl = videoUrl;
      updateDoc.videoType = detectVideoType(videoUrl);
    }
    if (thumbnailUrl !== undefined) updateDoc.thumbnailUrl = thumbnailUrl;
    if (duration !== undefined) updateDoc.duration = duration;
    if (isPublished !== undefined) updateDoc.isPublished = Boolean(isPublished);
    if (order !== undefined) updateDoc.order = Number(order);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Video story not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Video story updated." });
  } catch (error) {
    console.error("Failed to update video story:", error);
    return NextResponse.json({ error: "Failed to update video story." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid video story ID." }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection("video_stories");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Video story not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Video story deleted." });
  } catch (error) {
    console.error("Failed to delete video story:", error);
    return NextResponse.json({ error: "Failed to delete video story." }, { status: 500 });
  }
}
