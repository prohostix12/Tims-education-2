import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  SKILL_COURSES_COLLECTION,
  getSkillCoursesMemoryStore,
  setSkillCoursesMemoryStore,
  type SkillCourseItem,
} from "@/lib/skillCoursesDb";
import { ObjectId } from "mongodb";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.type === "reorder") {
      const { courses } = body;
      if (Array.isArray(courses)) {
        try {
          const db = await Promise.race([
            getDb(),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
          ]);

          if (db) {
            for (const item of courses) {
              let filter: any = { id: item.id };
              if (ObjectId.isValid(item.id)) {
                filter = { $or: [{ _id: new ObjectId(item.id) }, { id: item.id }] };
              }
              await db
                .collection(SKILL_COURSES_COLLECTION)
                .updateOne(filter, { $set: { order: Number(item.order), updatedAt: new Date() } });
            }
          }
        } catch (dbErr) {
          console.error("Failed to update reorder in DB:", dbErr);
        }

        const store = getSkillCoursesMemoryStore();
        for (const item of courses) {
          const found = store.find((c) => c.id === item.id);
          if (found) found.order = Number(item.order);
        }
        setSkillCoursesMemoryStore(store);

        return NextResponse.json({ success: true, message: "Order updated." });
      }
    }

    const { title, category, duration, eligibility, description, topics, order } = body;

    const topicsArray = Array.isArray(topics)
      ? topics.map((t: string) => t.trim()).filter(Boolean)
      : typeof topics === "string"
      ? topics.split("\n").map((t) => t.trim()).filter(Boolean)
      : [];

    const now = new Date();
    const updateFields = {
      title: (title || "").trim(),
      category: (category || "General").trim(),
      duration: (duration || "3 - 6 Months").trim(),
      eligibility: (eligibility || "").trim(),
      description: (description || "").trim(),
      topics: topicsArray,
      order: Number(order) || 1,
      updatedAt: now,
    };

    let updatedCourse: SkillCourseItem | null = null;

    try {
      const db = await Promise.race([
        getDb(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
      ]);

      if (db) {
        let filter: any = { id };
        if (ObjectId.isValid(id)) {
          filter = { $or: [{ _id: new ObjectId(id) }, { id }] };
        }

        const res = await db
          .collection<SkillCourseItem>(SKILL_COURSES_COLLECTION)
          .findOneAndUpdate(filter, { $set: updateFields }, { returnDocument: "after" });

        if (res) {
          updatedCourse = {
            ...res,
            id: res.id || String(res._id),
          };
        }
      }
    } catch (dbErr) {
      console.error("Failed to update skill course in DB:", dbErr);
    }

    const memoryStore = getSkillCoursesMemoryStore();
    const idx = memoryStore.findIndex((c) => c.id === id);
    if (idx !== -1) {
      memoryStore[idx] = {
        ...memoryStore[idx],
        ...updateFields,
      };
      setSkillCoursesMemoryStore(memoryStore);
      if (!updatedCourse) updatedCourse = memoryStore[idx];
    }

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error("PUT /api/skill-courses/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update skill course." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      const db = await Promise.race([
        getDb(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
      ]);

      if (db) {
        let filter: any = { id };
        if (ObjectId.isValid(id)) {
          filter = { $or: [{ _id: new ObjectId(id) }, { id }] };
        }
        await db.collection(SKILL_COURSES_COLLECTION).deleteOne(filter);
      }
    } catch (dbErr) {
      console.error("Failed to delete skill course from DB:", dbErr);
    }

    const memoryStore = getSkillCoursesMemoryStore();
    const filtered = memoryStore.filter((c) => c.id !== id);
    setSkillCoursesMemoryStore(filtered);

    return NextResponse.json({ success: true, message: "Skill course deleted." });
  } catch (error) {
    console.error("DELETE /api/skill-courses/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete skill course." }, { status: 500 });
  }
}
