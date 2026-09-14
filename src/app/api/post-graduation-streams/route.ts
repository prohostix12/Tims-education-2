import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  POST_GRADUATION_STREAMS_COLLECTION,
  getPostGraduationMemoryStore,
  setPostGraduationMemoryStore,
  PostGraduationStreamDoc,
  PostGraduationCourse,
} from "@/lib/postGraduationDb";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

const SEED_PG_STREAMS = [
  {
    streamId: "traditional-stream",
    label: "Traditional Stream",
    status: "Published",
    order: 1,
    courses: [
      { id: "pg-1", name: "Master of Commerce (M.Com)", eligibility: "Graduation", status: "Published", order: 1 },
      { id: "pg-2", name: "M.A (Human Rights)", eligibility: "Graduation", status: "Published", order: 2 },
      { id: "pg-3", name: "M.A (Hindi)", eligibility: "Graduation", status: "Published", order: 3 },
      { id: "pg-4", name: "M.A (Sanskrit)", eligibility: "Graduation", status: "Published", order: 4 },
      { id: "pg-5", name: "M.A (English)", eligibility: "Graduation", status: "Published", order: 5 },
      { id: "pg-6", name: "M.A (Political Science)", eligibility: "Graduation", status: "Published", order: 6 },
      { id: "pg-7", name: "M.A (History)", eligibility: "Graduation", status: "Published", order: 7 },
      { id: "pg-8", name: "M.A (Philosophy)", eligibility: "Graduation", status: "Published", order: 8 },
      { id: "pg-9", name: "M.A (Sociology)", eligibility: "Graduation", status: "Published", order: 9 },
      { id: "pg-10", name: "M.A (Mathematics)", eligibility: "Graduation", status: "Published", order: 10 },
      { id: "pg-11", name: "M.A (Economics)", eligibility: "Graduation", status: "Published", order: 11 },
      { id: "pg-12", name: "M.A (Education)", eligibility: "Graduation", status: "Published", order: 12 },
      { id: "pg-13", name: "M.A (Psychology)", eligibility: "Graduation", status: "Published", order: 13 },
      { id: "pg-14", name: "M.A (Geography)", eligibility: "Graduation", status: "Published", order: 14 },
      { id: "pg-15", name: "M.A (Physical Education)", eligibility: "Graduation", status: "Published", order: 15 },
      { id: "pg-16", name: "M.A (Public Administration)", eligibility: "Graduation", status: "Published", order: 16 },
      { id: "pg-17", name: "Master of Social Work (M.S.W)", eligibility: "Graduation", status: "Published", order: 17 },
      { id: "pg-18", name: "Master of Library Information Science (M.L.I.S)", eligibility: "B.L.I.S", status: "Published", order: 18 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "cs-it",
    label: "Department of CS/IT",
    status: "Published",
    order: 2,
    courses: [
      { id: "pg-19", name: "MCA", eligibility: "Graduation", status: "Published", order: 1 },
      { id: "pg-20", name: "M.Sc Computer Science", eligibility: "Graduation", status: "Published", order: 2 },
      { id: "pg-21", name: "M.Sc Information Technology (IT)", eligibility: "Graduation", status: "Published", order: 3 },
      { id: "pg-22", name: "Post Graduate Diploma in Computer Application (PGDCA)", eligibility: "Graduation", status: "Published", order: 4 },
      { id: "pg-23", name: "Post Graduate Diploma in Information Technology (PGDIT)", eligibility: "Graduation", status: "Published", order: 5 },
      { id: "pg-24", name: "Post Graduate Diploma in Computer Science (PGDCS)", eligibility: "Graduation", status: "Published", order: 6 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "science",
    label: "Department of Science",
    status: "Published",
    order: 3,
    courses: [
      { id: "pg-25", name: "MCA", eligibility: "B.Sc With Relevant Subject", status: "Published", order: 1 },
      { id: "pg-26", name: "M.sc (Mathematics)", eligibility: "B.Sc With Relevant Subject", status: "Published", order: 2 },
      { id: "pg-27", name: "M.Sc (Chemistry)", eligibility: "B.Sc With Relevant Subject", status: "Published", order: 3 },
      { id: "pg-28", name: "M.Sc (Physics)", eligibility: "B.Sc With Relevant Subject", status: "Published", order: 4 },
      { id: "pg-29", name: "M.Sc (Environment Science)", eligibility: "B.Sc With PCM/PCB", status: "Published", order: 5 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "paramedical",
    label: "Paramedical Stream",
    status: "Published",
    order: 4,
    courses: [
      { id: "pg-30", name: "M.A in Yoga and Health Education", eligibility: "Graduation", status: "Published", order: 1 },
      { id: "pg-31", name: "M.Sc in Yoga and Health Education", eligibility: "Graduation", status: "Published", order: 2 },
      { id: "pg-32", name: "Post Graduate Diploma in Yoga and Health Education", eligibility: "Graduation", status: "Published", order: 3 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "hospitality-tourism",
    label: "Department of Hospitality & Tourism",
    status: "Published",
    order: 5,
    courses: [
      { id: "pg-33", name: "M.A (Tourism Management)", eligibility: "Graduation", status: "Published", order: 1 },
      { id: "pg-34", name: "Post Graduate Diploma in Hotel Administration & Hospitality", eligibility: "Graduation", status: "Published", order: 2 },
      { id: "pg-35", name: "PG Diploma in Hospitality & Tourism", eligibility: "Graduation", status: "Published", order: 3 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "media-communication",
    label: "Department of Media & Communication",
    status: "Published",
    order: 6,
    courses: [
      { id: "pg-36", name: "M.A (Advertising & Mass Communication)", eligibility: "Graduation", status: "Published", order: 1 },
      { id: "pg-37", name: "M.A (Journalism & Mass Communication)", eligibility: "Graduation", status: "Published", order: 2 },
      {
        id: "pg-38",
        name: "PG Diploma in Media Management/ PR & Marketing Communication/ Print Journal / Broadcast/ Advtg. & Event Planning/ Corp Com/Brand Management",
        eligibility: "Graduation",
        status: "Published",
        order: 3,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "fashion-textile",
    label: "Department of Fashion & Textile Design",
    status: "Published",
    order: 7,
    courses: [
      { id: "pg-39", name: "M.Sc in Fashion Designing", eligibility: "B.Sc in Fashion Designing", status: "Published", order: 1 },
      { id: "pg-40", name: "Post Graduate Diploma IN Fashion Designing", eligibility: "B.Sc in Fashion Designing", status: "Published", order: 2 },
      { id: "pg-41", name: "Post Graduate Diploma Graphics & Multimedia", eligibility: "B.Sc Graphics & Multimedia", status: "Published", order: 3 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET() {
  try {
    const db = await getDb();
    let docs = await db
      .collection(POST_GRADUATION_STREAMS_COLLECTION)
      .find()
      .sort({ order: 1 })
      .toArray();

    // Auto-seed MongoDB collection if empty
    if (!docs || docs.length === 0) {
      console.log("Seeding MongoDB collection post_graduation_streams with initial dataset...");
      await db.collection(POST_GRADUATION_STREAMS_COLLECTION).insertMany(SEED_PG_STREAMS);
      docs = await db
        .collection(POST_GRADUATION_STREAMS_COLLECTION)
        .find()
        .sort({ order: 1 })
        .toArray();
    }

    if (docs && docs.length > 0) {
      const dbStreams = docs.map((doc) => ({
        id: doc._id.toString(),
        streamId: doc.streamId,
        label: doc.label,
        status: doc.status || "Published",
        order: typeof doc.order === "number" ? doc.order : 1,
        courses: Array.isArray(doc.courses) ? doc.courses : [],
      }));

      setPostGraduationMemoryStore(dbStreams as any);
      return NextResponse.json({ streams: dbStreams });
    }
  } catch (error: any) {
    console.warn("MongoDB unavailable for post graduation streams, serving fallback seed streams:", error?.message || error);
  }

  let memoryStreams = getPostGraduationMemoryStore();
  if (!memoryStreams || memoryStreams.length === 0) {
    memoryStreams = SEED_PG_STREAMS as any;
    setPostGraduationMemoryStore(memoryStreams);
  }
  return NextResponse.json({ streams: memoryStreams, fallback: true });
}

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { type, label, streamId, courseName, eligibility, status, order } = body;

  // Case A: Create New Stream / Department
  if (type === "stream" || isNonEmptyString(label)) {
    if (!isNonEmptyString(label)) {
      return NextResponse.json({ error: "Stream label is required." }, { status: 400 });
    }

    const generatedSlug = (streamId || label)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newStream: PostGraduationStreamDoc = {
      id: `stream-${Date.now()}`,
      streamId: generatedSlug,
      label: label.trim(),
      status: status === "Draft" ? "Draft" : "Published",
      order: typeof order === "number" ? order : getPostGraduationMemoryStore().length + 1,
      courses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const memory = getPostGraduationMemoryStore();
    setPostGraduationMemoryStore([...memory, newStream]);

    try {
      const db = await getDb();
      const result = await db.collection(POST_GRADUATION_STREAMS_COLLECTION).insertOne({
        streamId: newStream.streamId,
        label: newStream.label,
        status: newStream.status,
        order: newStream.order,
        courses: newStream.courses,
        createdAt: newStream.createdAt,
        updatedAt: newStream.updatedAt,
      });

      return NextResponse.json(
        { stream: { ...newStream, id: result.insertedId.toString() } },
        { status: 201 }
      );
    } catch (error) {
      console.error("Failed to insert stream into MongoDB:", error);
      return NextResponse.json({ stream: newStream }, { status: 201 });
    }
  }

  // Case B: Add New Course to an Existing Stream
  if (type === "course") {
    const { targetStreamId } = body;
    if (!isNonEmptyString(targetStreamId)) {
      return NextResponse.json({ error: "targetStreamId is required to add course." }, { status: 400 });
    }

    if (!isNonEmptyString(courseName)) {
      return NextResponse.json({ error: "Course name is required." }, { status: 400 });
    }

    const newCourse: PostGraduationCourse = {
      id: `course-${Date.now()}`,
      name: courseName.trim(),
      eligibility: isNonEmptyString(eligibility) ? eligibility.trim() : "Graduation",
      status: status === "Draft" ? "Draft" : "Published",
      order: typeof order === "number" ? order : 1,
    };

    const memory = getPostGraduationMemoryStore();
    const updatedMemory = memory.map((s) => {
      if (s.id === targetStreamId || s.streamId === targetStreamId || s._id?.toString() === targetStreamId) {
        return {
          ...s,
          courses: [...s.courses, newCourse],
          updatedAt: new Date(),
        };
      }
      return s;
    });
    setPostGraduationMemoryStore(updatedMemory);

    try {
      const db = await getDb();
      const targetDoc = memory.find(
        (s) => s.id === targetStreamId || s.streamId === targetStreamId || s._id?.toString() === targetStreamId
      );

      let queryFilter: any = { streamId: targetStreamId };
      if (targetDoc && targetDoc._id && ObjectId.isValid(targetDoc._id.toString())) {
        queryFilter = { _id: new ObjectId(targetDoc._id.toString()) };
      }

      await db
        .collection(POST_GRADUATION_STREAMS_COLLECTION)
        .updateOne(
          queryFilter,
          { $push: { courses: newCourse as any }, $set: { updatedAt: new Date() } }
        );
    } catch (error) {
      console.error("Failed to push course into MongoDB stream:", error);
    }

    return NextResponse.json({ course: newCourse }, { status: 201 });
  }

  return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
}
