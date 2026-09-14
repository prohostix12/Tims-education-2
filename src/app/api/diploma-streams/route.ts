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

const SEED_DIPLOMA_STREAMS = [
  {
    streamId: "diploma",
    label: "Diploma",
    status: "Published",
    order: 1,
    courses: [
      { id: "d-1", name: "Mechanic – (Refrigeration & Air Conditioning)", eligibility: "10th Pass", status: "Published", order: 1 },
      { id: "d-2", name: "Draughtsman", eligibility: "10th Pass", status: "Published", order: 2 },
      { id: "d-3", name: "Mechanical", eligibility: "10th Pass", status: "Published", order: 3 },
      { id: "d-4", name: "Civil", eligibility: "10th Pass", status: "Published", order: 4 },
      { id: "d-5", name: "Electrician", eligibility: "10th Pass", status: "Published", order: 5 },
      { id: "d-6", name: "Fitter", eligibility: "10th Pass", status: "Published", order: 6 },
      { id: "d-7", name: "Turner", eligibility: "10th Pass", status: "Published", order: 7 },
      { id: "d-8", name: "Machinist", eligibility: "10th Pass", status: "Published", order: 8 },
      { id: "d-9", name: "Mechanic (Diesel / Tractor)", eligibility: "10th Pass", status: "Published", order: 9 },
      { id: "d-10", name: "Plumber", eligibility: "10th Pass", status: "Published", order: 10 },
      { id: "d-11", name: "Welder (Gas & Electric)", eligibility: "10th Pass", status: "Published", order: 11 },
      { id: "d-12", name: "Painter", eligibility: "10th Pass", status: "Published", order: 12 },
      { id: "d-13", name: "Carpenter", eligibility: "10th Pass", status: "Published", order: 13 },
      { id: "d-14", name: "Mason (Raj Mistri)", eligibility: "10th Pass", status: "Published", order: 14 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "diploma-engineering",
    label: "Diploma in Engineering",
    status: "Published",
    order: 2,
    courses: [
      { id: "d-15", name: "Automobile", eligibility: "10+2 or Its Equivalent", status: "Published", order: 1 },
      { id: "d-16", name: "Civil", eligibility: "10+2 or Its Equivalent", status: "Published", order: 2 },
      { id: "d-17", name: "Computer Science", eligibility: "10+2 or Its Equivalent", status: "Published", order: 3 },
      { id: "d-18", name: "Electronics & Communication", eligibility: "10+2 or Its Equivalent", status: "Published", order: 4 },
      { id: "d-19", name: "Electrical", eligibility: "10+2 or Its Equivalent", status: "Published", order: 5 },
      { id: "d-20", name: "Mechanical", eligibility: "10+2 or Its Equivalent", status: "Published", order: 6 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET() {
  try {
    const db = await getDb();
    let docs = await db
      .collection(DIPLOMA_STREAMS_COLLECTION)
      .find()
      .sort({ order: 1 })
      .toArray();

    // Auto-seed MongoDB collection if empty
    if (!docs || docs.length === 0) {
      console.log("Seeding MongoDB collection diploma_streams with initial dataset...");
      await db.collection(DIPLOMA_STREAMS_COLLECTION).insertMany(SEED_DIPLOMA_STREAMS);
      docs = await db
        .collection(DIPLOMA_STREAMS_COLLECTION)
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

      setDiplomaMemoryStore(dbStreams as any);
      return NextResponse.json({ streams: dbStreams });
    }
  } catch (error: any) {
    console.warn("MongoDB unavailable for diploma streams, serving fallback seed streams:", error?.message || error);
  }

  let memoryStreams = getDiplomaMemoryStore();
  if (!memoryStreams || memoryStreams.length === 0) {
    memoryStreams = SEED_DIPLOMA_STREAMS as any;
    setDiplomaMemoryStore(memoryStreams);
  }
  return NextResponse.json({ streams: memoryStreams, fallback: true });
}

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { type, streamId, label, status, order, name, eligibility, courseId } = body || {};

  // Case A: Create a new Stream
  if (type === "stream") {
    if (!isNonEmptyString(label)) {
      return NextResponse.json({ error: "Stream label is required" }, { status: 400 });
    }

    const generatedStreamId = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newStreamDoc: DiplomaStreamDoc = {
      streamId: generatedStreamId || `stream-${Date.now()}`,
      label: label.trim(),
      status: status === "Draft" ? "Draft" : "Published",
      order: typeof order === "number" ? order : 1,
      courses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const db = await getDb();
      const result = await db.collection(DIPLOMA_STREAMS_COLLECTION).insertOne(newStreamDoc as any);
      newStreamDoc.id = result.insertedId.toString();
      newStreamDoc._id = result.insertedId;
    } catch {
      newStreamDoc.id = `mem-stream-${Date.now()}`;
    }

    const currentStore = getDiplomaMemoryStore();
    setDiplomaMemoryStore([...currentStore, newStreamDoc]);

    return NextResponse.json({ stream: newStreamDoc }, { status: 201 });
  }

  // Case B: Create a new Course inside an existing Stream
  if (type === "course") {
    if (!isNonEmptyString(streamId)) {
      return NextResponse.json({ error: "streamId is required" }, { status: 400 });
    }
    if (!isNonEmptyString(name)) {
      return NextResponse.json({ error: "Course name is required" }, { status: 400 });
    }

    const newCourseItem: DiplomaCourse = {
      id: courseId || `d-course-${Date.now()}`,
      name: name.trim(),
      eligibility: (eligibility || "").trim(),
      status: status === "Draft" ? "Draft" : "Published",
      order: typeof order === "number" ? order : 1,
    };

    try {
      const db = await getDb();
      const filter = ObjectId.isValid(streamId)
        ? { _id: new ObjectId(streamId) }
        : { streamId: streamId };

      await db.collection(DIPLOMA_STREAMS_COLLECTION).updateOne(filter, {
        $push: { courses: newCourseItem } as any,
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
        return NextResponse.json({ stream: streamObj, course: newCourseItem }, { status: 201 });
      }
    } catch (err) {
      console.warn("Falling back to memory store for course creation:", err);
    }

    // Memory Store fallback
    const store = getDiplomaMemoryStore();
    const target = store.find((s) => s.id === streamId || s.streamId === streamId);
    if (target) {
      target.courses = target.courses || [];
      target.courses.push(newCourseItem);
      return NextResponse.json({ stream: target, course: newCourseItem }, { status: 201 });
    }

    return NextResponse.json({ error: "Target stream not found" }, { status: 444 });
  }

  return NextResponse.json({ error: "Invalid type specified" }, { status: 400 });
}
