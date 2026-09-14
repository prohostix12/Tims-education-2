import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  DIPLOMA_STREAMS_COLLECTION,
  getDiplomaMemoryStore,
  setDiplomaMemoryStore,
  DiplomaStreamDoc,
  DiplomaCourse,
} from "@/lib/diplomaDb";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Stream ID parameter missing" }, { status: 400 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { type, label, status, order, courseId, name, eligibility, courses } = body || {};

  // Case A: Update Stream details
  if (type === "stream") {
    const updateFields: Record<string, any> = { updatedAt: new Date().toISOString() };
    if (isNonEmptyString(label)) updateFields.label = label.trim();
    if (status === "Published" || status === "Draft") updateFields.status = status;
    if (typeof order === "number") updateFields.order = order;

    try {
      const db = await getDb();
      const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { streamId: id };
      await db.collection(DIPLOMA_STREAMS_COLLECTION).updateOne(filter, { $set: updateFields });

      const updated = await db.collection(DIPLOMA_STREAMS_COLLECTION).findOne(filter);
      if (updated) {
        const streamObj = {
          id: updated._id.toString(),
          streamId: updated.streamId,
          label: updated.label,
          status: updated.status,
          order: updated.order,
          courses: updated.courses || [],
        };
        return NextResponse.json({ stream: streamObj });
      }
    } catch (err) {
      console.warn("MongoDB update stream failed, falling back to memory store:", err);
    }

    const store = getDiplomaMemoryStore();
    const target = store.find((s) => s.id === id || s.streamId === id);
    if (target) {
      if (updateFields.label) target.label = updateFields.label;
      if (updateFields.status) target.status = updateFields.status;
      if (typeof updateFields.order === "number") target.order = updateFields.order;
      return NextResponse.json({ stream: target });
    }
    return NextResponse.json({ error: "Stream not found" }, { status: 404 });
  }

  // Case B: Update a single Course inside the Stream
  if (type === "course") {
    if (!isNonEmptyString(courseId)) {
      return NextResponse.json({ error: "courseId is required for editing course" }, { status: 400 });
    }

    try {
      const db = await getDb();
      const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { streamId: id };
      const streamDoc = await db.collection(DIPLOMA_STREAMS_COLLECTION).findOne(filter);

      if (streamDoc && Array.isArray(streamDoc.courses)) {
        const updatedCourses = streamDoc.courses.map((c: DiplomaCourse) => {
          if (c.id === courseId) {
            return {
              ...c,
              name: isNonEmptyString(name) ? name.trim() : c.name,
              eligibility: typeof eligibility === "string" ? eligibility.trim() : c.eligibility,
              status: status === "Published" || status === "Draft" ? status : c.status,
              order: typeof order === "number" ? order : c.order,
            };
          }
          return c;
        });

        await db.collection(DIPLOMA_STREAMS_COLLECTION).updateOne(filter, {
          $set: { courses: updatedCourses, updatedAt: new Date().toISOString() },
        });

        const reFetched = await db.collection(DIPLOMA_STREAMS_COLLECTION).findOne(filter);
        if (reFetched) {
          const streamObj = {
            id: reFetched._id.toString(),
            streamId: reFetched.streamId,
            label: reFetched.label,
            status: reFetched.status,
            order: reFetched.order,
            courses: reFetched.courses || [],
          };
          return NextResponse.json({ stream: streamObj });
        }
      }
    } catch (err) {
      console.warn("MongoDB update course failed, falling back to memory store:", err);
    }

    const store = getDiplomaMemoryStore();
    const target = store.find((s) => s.id === id || s.streamId === id);
    if (target && Array.isArray(target.courses)) {
      target.courses = target.courses.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            name: isNonEmptyString(name) ? name.trim() : c.name,
            eligibility: typeof eligibility === "string" ? eligibility.trim() : c.eligibility,
            status: status === "Published" || status === "Draft" ? status : c.status,
            order: typeof order === "number" ? order : c.order,
          };
        }
        return c;
      });
      return NextResponse.json({ stream: target });
    }
    return NextResponse.json({ error: "Stream or Course not found" }, { status: 404 });
  }

  // Case C: Reorder courses list in Stream
  if (type === "reorder_courses" && Array.isArray(courses)) {
    try {
      const db = await getDb();
      const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { streamId: id };
      await db.collection(DIPLOMA_STREAMS_COLLECTION).updateOne(filter, {
        $set: { courses, updatedAt: new Date().toISOString() },
      });

      const updated = await db.collection(DIPLOMA_STREAMS_COLLECTION).findOne(filter);
      if (updated) {
        return NextResponse.json({
          stream: {
            id: updated._id.toString(),
            streamId: updated.streamId,
            label: updated.label,
            status: updated.status,
            order: updated.order,
            courses: updated.courses || [],
          },
        });
      }
    } catch (err) {
      console.warn("MongoDB reorder courses failed, falling back to memory store:", err);
    }

    const store = getDiplomaMemoryStore();
    const target = store.find((s) => s.id === id || s.streamId === id);
    if (target) {
      target.courses = courses;
      return NextResponse.json({ stream: target });
    }
  }

  return NextResponse.json({ error: "Invalid type operation" }, { status: 400 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Stream ID parameter missing" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  // Case A: Delete an individual Course inside a Stream
  if (courseId) {
    try {
      const db = await getDb();
      const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { streamId: id };
      await db.collection(DIPLOMA_STREAMS_COLLECTION).updateOne(filter, {
        $pull: { courses: { id: courseId } } as any,
        $set: { updatedAt: new Date().toISOString() },
      });

      const updatedDoc = await db.collection(DIPLOMA_STREAMS_COLLECTION).findOne(filter);
      if (updatedDoc) {
        const streamObj = {
          id: updatedDoc._id.toString(),
          streamId: updatedDoc.streamId,
          label: updatedDoc.label,
          status: updatedDoc.status,
          order: updatedDoc.order,
          courses: updatedDoc.courses || [],
        };
        return NextResponse.json({ stream: streamObj, deletedCourseId: courseId });
      }
    } catch (err) {
      console.warn("MongoDB delete course failed, falling back to memory store:", err);
    }

    const store = getDiplomaMemoryStore();
    const target = store.find((s) => s.id === id || s.streamId === id);
    if (target && Array.isArray(target.courses)) {
      target.courses = target.courses.filter((c) => c.id !== courseId);
      return NextResponse.json({ stream: target, deletedCourseId: courseId });
    }
    return NextResponse.json({ error: "Stream not found" }, { status: 404 });
  }

  // Case B: Delete entire Stream
  try {
    const db = await getDb();
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { streamId: id };
    await db.collection(DIPLOMA_STREAMS_COLLECTION).deleteOne(filter);
  } catch (err) {
    console.warn("MongoDB delete stream failed, falling back to memory store:", err);
  }

  const store = getDiplomaMemoryStore();
  setDiplomaMemoryStore(store.filter((s) => s.id !== id && s.streamId !== id));

  return NextResponse.json({ message: "Stream deleted successfully", deletedId: id });
}
