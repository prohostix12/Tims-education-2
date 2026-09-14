import { NextResponse } from "next/server";
import { GridFSBucket } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const decodedFilename = decodeURIComponent(filename);

    const db = await getDb();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const files = await bucket.find({ filename: decodedFilename }).toArray();

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "File not found in database." }, { status: 404 });
    }

    const fileDoc = files[0];
    const downloadStream = bucket.openDownloadStream(fileDoc._id);

    const chunks: Uint8Array[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const metadata = (fileDoc as { metadata?: { contentType?: string } }).metadata;
    const contentType = metadata?.contentType || "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${fileDoc.filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error fetching file from MongoDB:", error);
    return NextResponse.json({ error: "Failed to retrieve file from database." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const decodedFilename = decodeURIComponent(filename);

    const db = await getDb();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const files = await bucket.find({ filename: decodedFilename }).toArray();

    if (files && files.length > 0) {
      for (const fileDoc of files) {
        await bucket.delete(fileDoc._id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file from MongoDB:", error);
    return NextResponse.json({ error: "Failed to delete file from database." }, { status: 500 });
  }
}
