import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  ONLINE_DEGREE_STREAMS_COLLECTION,
  getOnlineDegreeMemoryStore,
  setOnlineDegreeMemoryStore,
} from "@/lib/onlineDegreeDb";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Stream ID is required." }, { status: 400 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { label, streamId, status, order, courses } = body;

  const updateFields: Record<string, any> = {
    updatedAt: new Date(),
  };

  if (typeof label === "string" && label.trim()) updateFields.label = label.trim();
  if (typeof streamId === "string" && streamId.trim()) updateFields.streamId = streamId.trim();
  if (status === "Published" || status === "Draft") updateFields.status = status;
  if (typeof order === "number") updateFields.order = order;
  if (Array.isArray(courses)) updateFields.courses = courses;

  // Update memory store
  const memory = getOnlineDegreeMemoryStore();
  const updatedMemory = memory.map((stream) =>
    stream.id === id || stream.streamId === id || stream._id?.toString() === id
      ? { ...stream, ...updateFields }
      : stream
  );
  setOnlineDegreeMemoryStore(updatedMemory);

  try {
    const db = await getDb();
    let query: any = { $or: [{ _id: id }, { streamId: id }] };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { streamId: id }] };
    }

    const result = await db.collection(ONLINE_DEGREE_STREAMS_COLLECTION).findOneAndUpdate(
      query,
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (result) {
      return NextResponse.json({
        stream: {
          id: result._id.toString(),
          streamId: result.streamId,
          label: result.label,
          status: result.status,
          order: result.order,
          courses: result.courses,
        },
      });
    }
  } catch (error) {
    console.error(`Failed to update online degree stream ${id} in MongoDB:`, error);
  }

  const fallbackStream = updatedMemory.find(
    (s) => s.id === id || s.streamId === id || s._id?.toString() === id
  );
  return NextResponse.json({ stream: fallbackStream });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID is required." }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  const memory = getOnlineDegreeMemoryStore();

  // If courseId query param is passed, remove single course from stream
  if (courseId) {
    const updatedMemory = memory.map((stream) => {
      if (stream.id === id || stream.streamId === id || stream._id?.toString() === id) {
        return {
          ...stream,
          courses: stream.courses.filter((c) => c.id !== courseId),
        };
      }
      return stream;
    });
    setOnlineDegreeMemoryStore(updatedMemory);

    try {
      const db = await getDb();
      let query: any = { $or: [{ _id: id }, { streamId: id }] };
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { streamId: id }] };
      }
      await db
        .collection(ONLINE_DEGREE_STREAMS_COLLECTION)
        .updateOne(query, { $pull: { courses: { id: courseId } as any } });
    } catch (error) {
      console.error(`Failed to delete course ${courseId} from stream ${id}:`, error);
    }

    return NextResponse.json({ success: true, type: "course" });
  }

  // Otherwise, delete entire stream
  setOnlineDegreeMemoryStore(
    memory.filter((s) => s.id !== id && s.streamId !== id && s._id?.toString() !== id)
  );

  try {
    const db = await getDb();
    let query: any = { $or: [{ _id: id }, { streamId: id }] };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { streamId: id }] };
    }
    await db.collection(ONLINE_DEGREE_STREAMS_COLLECTION).deleteOne(query);
  } catch (error) {
    console.error(`Failed to delete online degree stream ${id} from MongoDB:`, error);
  }

  return NextResponse.json({ success: true, type: "stream" });
}
