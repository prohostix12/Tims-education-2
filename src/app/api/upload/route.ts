import { NextResponse } from "next/server";
import { GridFSBucket } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { Readable } from "stream";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename to prevent collisions
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${sanitizedFilename}`;

    const db = await getDb();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    // Store in MongoDB GridFS (No local files written to disk)
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        contentType: file.type || "application/octet-stream",
        originalName: file.name,
      },
    });

    await new Promise<void>((resolve, reject) => {
      const readable = Readable.from(buffer);
      readable.pipe(uploadStream);
      uploadStream.on("finish", () => resolve());
      uploadStream.on("error", (err) => reject(err));
    });

    // Public URL pointing to MongoDB dynamic file handler
    const publicUrl = `/api/files/${encodeURIComponent(filename)}`;

    return NextResponse.json({ success: true, url: publicUrl }, { status: 201 });
  } catch (error) {
    console.error("Failed to upload file to MongoDB:", error);
    return NextResponse.json({ error: "File upload failed." }, { status: 500 });
  }
}
