import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  ONLINE_DEGREE_STREAMS_COLLECTION,
  getOnlineDegreeMemoryStore,
  setOnlineDegreeMemoryStore,
  OnlineDegreeStreamDoc,
  OnlineDegreeCourse,
} from "@/lib/onlineDegreeDb";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

const SEED_STREAMS = [
  {
    streamId: "traditional-stream",
    label: "Traditional Stream",
    status: "Published",
    order: 1,
    courses: [
      { id: "c-1", name: "B.A (General)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 1 },
      { id: "c-2", name: "B.A (Hindi)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 2 },
      { id: "c-3", name: "B.A (English)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 3 },
      { id: "c-4", name: "B.A (Sanskrit)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 4 },
      { id: "c-5", name: "B.A (Urdu)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 5 },
      { id: "c-6", name: "B.A (Political Science)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 6 },
      { id: "c-7", name: "B.A (History)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 7 },
      { id: "c-8", name: "B.A (Sociology)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 8 },
      { id: "c-9", name: "B.A (Economics)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 9 },
      { id: "c-10", name: "B.A (Mathematics)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 10 },
      { id: "c-11", name: "B.A (Education)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 11 },
      { id: "c-12", name: "B.A (Social Work)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 12 },
      { id: "c-13", name: "Bachelor of Library Information Science (B.L.I.S)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 13 },
      { id: "c-14", name: "Bachelor of Commerce (B.Com)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 14 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "management",
    label: "Department of Management",
    status: "Published",
    order: 2,
    courses: [
      { id: "c-15", name: "BBA", eligibility: "10 + 2", status: "Published", order: 1 },
      { id: "c-16", name: "Bachelor Insurance & Risk Management", eligibility: "10 + 2", status: "Published", order: 2 },
      { id: "c-17", name: "Diploma in Business Management", eligibility: "10 + 2", status: "Published", order: 3 },
      { id: "c-18", name: "Diploma in International Business", eligibility: "10 + 2", status: "Published", order: 4 },
      { id: "c-19", name: "Diploma in Hospital Management", eligibility: "10 + 2", status: "Published", order: 5 },
      { id: "c-20", name: "Diploma in Retail Management", eligibility: "10 + 2", status: "Published", order: 6 },
      { id: "c-21", name: "Diploma in Food Supply Chain Management", eligibility: "10 + 2", status: "Published", order: 7 },
      { id: "c-22", name: "Diploma in Marketing", eligibility: "10 + 2", status: "Published", order: 8 },
      { id: "c-23", name: "Diploma in Advertising", eligibility: "10 + 2", status: "Published", order: 9 },
      { id: "c-24", name: "Diploma in Insurance & Risk Management", eligibility: "10 + 2", status: "Published", order: 10 },
      { id: "c-25", name: "Certificate in all streams", eligibility: "10 + 2", status: "Published", order: 11 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "cs-it",
    label: "Department of CS/IT",
    status: "Published",
    order: 3,
    courses: [
      { id: "c-26", name: "BCA", eligibility: "10 + 2", status: "Published", order: 1 },
      { id: "c-27", name: "B.Sc Information Technology (IT)", eligibility: "10 + 2", status: "Published", order: 2 },
      { id: "c-28", name: "Diploma in Computer Applications (DCA)", eligibility: "10 + 2", status: "Published", order: 3 },
      { id: "c-29", name: "Diploma in Software Engineering (DSE)", eligibility: "10 + 2", status: "Published", order: 4 },
      { id: "c-30", name: "Diploma in Information Technology (DIT)", eligibility: "10 + 2", status: "Published", order: 5 },
      { id: "c-31", name: "Diploma in Computer Science (DCS)", eligibility: "10 + 2", status: "Published", order: 6 },
      { id: "c-32", name: "Advance Diploma in Hardware and Networking", eligibility: "10+2 in any stream or equivalent.", status: "Published", order: 7 },
      { id: "c-33", name: "Certificate in Computer Application (CCA)", eligibility: "10 + 2", status: "Published", order: 8 },
      { id: "c-34", name: "Certificate in Computing (CIC)", eligibility: "10 + 2", status: "Published", order: 9 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "science",
    label: "Department of Science",
    status: "Published",
    order: 4,
    courses: [
      { id: "c-35", name: "B.Sc (General)", eligibility: "10+ 2 With Science", status: "Published", order: 1 },
      { id: "c-36", name: "B.Sc (With Biology)", eligibility: "10+ 2 With Science", status: "Published", order: 2 },
      { id: "c-37", name: "B.Sc (Mathematics)", eligibility: "10+ 2 With Science", status: "Published", order: 3 },
      { id: "c-38", name: "B.Sc (Statistics)", eligibility: "10+ 2 With Science", status: "Published", order: 4 },
      { id: "c-39", name: "B.Sc (Physics)", eligibility: "10+ 2 With Science", status: "Published", order: 5 },
      { id: "c-40", name: "B.Sc (Botany)", eligibility: "10+ 2 With Science", status: "Published", order: 6 },
      { id: "c-41", name: "B.Sc (Zoology)", eligibility: "10+ 2 With Science", status: "Published", order: 7 },
      { id: "c-42", name: "M.A (Political Science)", eligibility: "10+ 2 With Science", status: "Published", order: 8 },
      { id: "c-43", name: "B.Sc (Chemistry)", eligibility: "10+ 2 With Science", status: "Published", order: 9 },
      { id: "c-44", name: "B.Sc (Microbiology)", eligibility: "10+ 2 With Science", status: "Published", order: 10 },
      { id: "c-45", name: "B.Sc (Bio-Chemistry)", eligibility: "10+ 2 With Science", status: "Published", order: 11 },
      { id: "c-46", name: "B.Sc (Applied Chemistry)", eligibility: "10+ 2 With Science", status: "Published", order: 12 },
      { id: "c-47", name: "Diploma In (Fire-safety and Hazard Management)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 13 },
      { id: "c-48", name: "B.Sc In (Fire-safety and Hazard Management)", eligibility: "10+2 or Its Equivalent", status: "Published", order: 14 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "biotechnology",
    label: "Department of Biotechnology",
    status: "Published",
    order: 5,
    courses: [
      { id: "c-49", name: "B.Sc (Biotechnology)", eligibility: "10 + 2", status: "Published", order: 1 },
      { id: "c-50", name: "B.Sc (Bioinformatics)", eligibility: "10 + 2", status: "Published", order: 2 },
      { id: "c-51", name: "Certificate Course in Advanced Bio-informatics", eligibility: "10 + 2", status: "Published", order: 3 },
      { id: "c-52", name: "Certificate Course in Industrial Biotechnology", eligibility: "10 + 2", status: "Published", order: 4 },
      { id: "c-53", name: "Certificate Course in IPR & Patents Law", eligibility: "10 + 2", status: "Published", order: 5 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "paramedical",
    label: "Paramedical Stream",
    status: "Published",
    order: 6,
    courses: [
      { id: "c-54", name: "B.Sc in Yoga and Naturopathy", eligibility: "10+2 With PCB", status: "Published", order: 1 },
      { id: "c-55", name: "Diploma in Yoga and Health Education", eligibility: "10+2", status: "Published", order: 2 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "hospitality-tourism",
    label: "Department of Hospitality & Tourism",
    status: "Published",
    order: 7,
    courses: [
      { id: "c-56", name: "B.A (Hospitality & Tourism)", eligibility: "10 + 2", status: "Published", order: 1 },
      { id: "c-57", name: "B.A (Hospitality & Hotel Administration)", eligibility: "10 + 2", status: "Published", order: 2 },
      { id: "c-58", name: "B.Sc (Hotel Administration & Hospitality)", eligibility: "10 + 2", status: "Published", order: 3 },
      { id: "c-59", name: "B.Sc (Hotel Administration & Hospitality) (Lateral)", eligibility: "10 + 2 AND ADHAH", status: "Published", order: 4 },
      { id: "c-60", name: "Diploma in Hotel Management", eligibility: "10 + 2", status: "Published", order: 5 },
      { id: "c-61", name: "Diploma in Hospitality Management", eligibility: "10 + 2", status: "Published", order: 6 },
      { id: "c-62", name: "Diploma in Hotel Administration & Hospitality Management", eligibility: "10 + 2", status: "Published", order: 7 },
      { id: "c-63", name: "Advance Diploma in Hotel Administration & Hospitality", eligibility: "10 + 2 AND DHM", status: "Published", order: 8 },
      { id: "c-64", name: "Advance Diploma in Hotel Administration & Hospitality in Sem III", eligibility: "10 + 2", status: "Published", order: 9 },
      { id: "c-65", name: "Certificate in Front Office Management", eligibility: "10 + 2", status: "Published", order: 10 },
      { id: "c-66", name: "Certificate in Tourism Management", eligibility: "10 + 2", status: "Published", order: 11 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "media-communication",
    label: "Department of Media & Communication",
    status: "Published",
    order: 8,
    courses: [
      { id: "c-67", name: "B.A (Advertising & Mass Communication)", eligibility: "10 + 2", status: "Published", order: 1 },
      { id: "c-68", name: "B.A (Journalism & Mass Communication)", eligibility: "10 + 2", status: "Published", order: 2 },
      { id: "c-69", name: "Diploma in Web Journalism", eligibility: "10 + 2", status: "Published", order: 3 },
      { id: "c-70", name: "Diploma in Brand Management", eligibility: "10 + 2", status: "Published", order: 4 },
      { id: "c-71", name: "Certificate in Event Management", eligibility: "10 + 2", status: "Published", order: 5 },
      { id: "c-72", name: "Certificate in Mass Communication", eligibility: "10 + 2", status: "Published", order: 6 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "fashion-textile",
    label: "Department of Fashion & Textile Design",
    status: "Published",
    order: 9,
    courses: [
      { id: "c-73", name: "B.A in Fashion Marketing & Promotion", eligibility: "10 + 2", status: "Published", order: 1 },
      { id: "c-74", name: "B.A in Fashion Technology", eligibility: "10 + 2", status: "Published", order: 2 },
      { id: "c-75", name: "B.Sc Interior Design", eligibility: "10 + 2", status: "Published", order: 3 },
      { id: "c-76", name: "B.Sc Graphics & Multimedia", eligibility: "10 + 2", status: "Published", order: 4 },
      { id: "c-77", name: "B.Sc in Fashion Designing", eligibility: "10 + 2", status: "Published", order: 5 },
      { id: "c-78", name: "Diploma in Art and Craft", eligibility: "10 + 2", status: "Published", order: 6 },
      { id: "c-79", name: "Diploma Fashion Design", eligibility: "10 + 2", status: "Published", order: 7 },
      { id: "c-80", name: "Diploma Fashion Marketing", eligibility: "10 + 2", status: "Published", order: 8 },
      { id: "c-81", name: "Diploma in Fashion Merchandising", eligibility: "10 + 2", status: "Published", order: 9 },
      { id: "c-82", name: "Diploma Interior Design", eligibility: "10th", status: "Published", order: 10 },
      { id: "c-83", name: "Diploma Graphics & Multimedia", eligibility: "10th", status: "Published", order: 11 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    streamId: "lateral-entry",
    label: "Lateral Entry & Respective Eligibility",
    status: "Published",
    order: 10,
    courses: [
      { id: "c-84", name: "BBA", eligibility: "2nd Year", status: "Published", order: 1 },
      { id: "c-85", name: "BCA", eligibility: "2nd Year", status: "Published", order: 2 },
      { id: "c-86", name: "B.SC IT", eligibility: "2nd Year", status: "Published", order: 3 },
      { id: "c-87", name: "B.SC CS", eligibility: "2nd Year", status: "Published", order: 4 },
      { id: "c-88", name: "B.Sc in Fashion Design", eligibility: "2nd Year", status: "Published", order: 5 },
      { id: "c-89", name: "B.Sc in Interior Design", eligibility: "2nd Year", status: "Published", order: 6 },
      { id: "c-90", name: "Advance Diploma in Fire Safety", eligibility: "2nd Year", status: "Published", order: 7 },
      { id: "c-91", name: "MCA", eligibility: "3rd & 5th Semester", status: "Published", order: 8 },
      { id: "c-92", name: "M.Sc IT", eligibility: "2nd Year", status: "Published", order: 9 },
      { id: "c-93", name: "M.Sc CS", eligibility: "2nd Year", status: "Published", order: 10 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET() {
  try {
    const db = await getDb();
    let docs = await db
      .collection(ONLINE_DEGREE_STREAMS_COLLECTION)
      .find()
      .sort({ order: 1 })
      .toArray();

    // Auto-seed database collection if empty
    if (!docs || docs.length === 0) {
      console.log("Seeding MongoDB collection online_degree_streams with initial dataset...");
      await db.collection(ONLINE_DEGREE_STREAMS_COLLECTION).insertMany(SEED_STREAMS);
      docs = await db
        .collection(ONLINE_DEGREE_STREAMS_COLLECTION)
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

      setOnlineDegreeMemoryStore(dbStreams as any);
      return NextResponse.json({ streams: dbStreams });
    }
  } catch (error) {
    console.error("Failed to fetch/seed online degree streams from MongoDB:", error);
  }

  const memoryStreams = getOnlineDegreeMemoryStore();
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

    const newStream: OnlineDegreeStreamDoc = {
      id: `stream-${Date.now()}`,
      streamId: generatedSlug,
      label: label.trim(),
      status: status === "Draft" ? "Draft" : "Published",
      order: typeof order === "number" ? order : getOnlineDegreeMemoryStore().length + 1,
      courses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const memory = getOnlineDegreeMemoryStore();
    setOnlineDegreeMemoryStore([...memory, newStream]);

    try {
      const db = await getDb();
      const result = await db.collection(ONLINE_DEGREE_STREAMS_COLLECTION).insertOne({
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

    const newCourse: OnlineDegreeCourse = {
      id: `course-${Date.now()}`,
      name: courseName.trim(),
      eligibility: isNonEmptyString(eligibility) ? eligibility.trim() : "10+2 or Its Equivalent",
      status: status === "Draft" ? "Draft" : "Published",
      order: typeof order === "number" ? order : 1,
    };

    const memory = getOnlineDegreeMemoryStore();
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
    setOnlineDegreeMemoryStore(updatedMemory);

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
        .collection(ONLINE_DEGREE_STREAMS_COLLECTION)
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
