import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  SKILL_COURSES_COLLECTION,
  getSkillCoursesMemoryStore,
  setSkillCoursesMemoryStore,
  type SkillCourseItem,
} from "@/lib/skillCoursesDb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await Promise.race([
      getDb(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
    ]);

    if (db) {
      const docs = await db
        .collection<SkillCourseItem>(SKILL_COURSES_COLLECTION)
        .find({})
        .sort({ order: 1, createdAt: 1 })
        .toArray();

      const courses = docs.map((doc) => ({
        ...doc,
        id: doc.id || String(doc._id),
      }));

      setSkillCoursesMemoryStore(courses);
      return NextResponse.json({ success: true, courses });
    }
  } catch (err) {
    console.error("MongoDB fetch skill-courses error:", err);
  }

  const memoryStore = getSkillCoursesMemoryStore();
  const sorted = [...memoryStore].sort((a, b) => (a.order || 0) - (b.order || 0));
  return NextResponse.json({ success: true, courses: sorted });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, duration, eligibility, description, topics, order } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: "Title is required." }, { status: 400 });
    }

    const topicsArray = Array.isArray(topics)
      ? topics.map((t: string) => t.trim()).filter(Boolean)
      : typeof topics === "string"
      ? topics.split("\n").map((t) => t.trim()).filter(Boolean)
      : [];

    const now = new Date();
    const newCourse: SkillCourseItem = {
      id: new ObjectId().toString(),
      title: title.trim(),
      category: (category || "General").trim(),
      duration: (duration || "3 - 6 Months").trim(),
      eligibility: (eligibility || "10th / Plus Two / Any Graduate").trim(),
      description: (description || "").trim(),
      topics: topicsArray,
      order: Number(order) || 1,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const db = await Promise.race([
        getDb(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
      ]);

      if (db) {
        const result = await db
          .collection<SkillCourseItem>(SKILL_COURSES_COLLECTION)
          .insertOne({ ...newCourse, _id: new ObjectId(newCourse.id) });

        newCourse.id = String(result.insertedId);
      }
    } catch (dbErr) {
      console.error("Failed to insert skill course to DB:", dbErr);
    }

    const memoryStore = getSkillCoursesMemoryStore();
    memoryStore.push(newCourse);
    setSkillCoursesMemoryStore(memoryStore);

    return NextResponse.json({ success: true, course: newCourse });
  } catch (error) {
    console.error("POST /api/skill-courses error:", error);
    return NextResponse.json({ success: false, error: "Failed to create skill course." }, { status: 500 });
  }
}
