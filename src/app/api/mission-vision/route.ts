import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "mission_vision";
const DOCUMENT_ID = "main_mission_vision";

export interface MissionVisionData {
  missionEyebrow: string;
  missionHeading: string;
  missionDescription: string;
  missionPoints: string[];
  visionEyebrow: string;
  visionHeading: string;
  visionDescription: string;
  visionPoints: string[];
  updatedAt?: string | Date;
}

const DEFAULT_DATA: MissionVisionData = {
  missionEyebrow: "OUR MISSION",
  missionHeading: "Empowering Learners Through Accessible, Accredited Education",
  missionDescription:
    "Providing accessible, high-quality distance and online education that breaks geographical and financial barriers. We guide students and professionals to achieve recognized qualifications, personal growth, and successful career pathways.",
  missionPoints: [
    "UGC-DEB Recognized & Accredited University Affiliations",
    "Flexible Learning Models Tailored for Working Professionals",
    "Personalized Academic Counseling from Admission to Graduation"
  ],
  visionEyebrow: "OUR VISION",
  visionHeading: "Inspiring Academic Excellence and Global Opportunities",
  visionDescription:
    "To be the premier educational counseling and distance learning institution in Kerala and the GCC region, recognized for transforming lives through innovative learning pathways, higher education accessibility, and career excellence.",
  visionPoints: [
    "50,000+ Students Mentored Across India & GCC",
    "Continuous Innovation in Flexible Open & Distance Learning",
    "Building Confidence, Job Readiness & Lifelong Achievement"
  ]
};

export async function GET() {
  try {
    const db = await getDb();
    const doc = await db.collection(COLLECTION).findOne({ id: DOCUMENT_ID });

    if (!doc) {
      return NextResponse.json(DEFAULT_DATA);
    }

    return NextResponse.json({
      missionEyebrow: doc.missionEyebrow || DEFAULT_DATA.missionEyebrow,
      missionHeading: doc.missionHeading || DEFAULT_DATA.missionHeading,
      missionDescription: doc.missionDescription || DEFAULT_DATA.missionDescription,
      missionPoints: Array.isArray(doc.missionPoints) ? doc.missionPoints : DEFAULT_DATA.missionPoints,
      visionEyebrow: doc.visionEyebrow || DEFAULT_DATA.visionEyebrow,
      visionHeading: doc.visionHeading || DEFAULT_DATA.visionHeading,
      visionDescription: doc.visionDescription || DEFAULT_DATA.visionDescription,
      visionPoints: Array.isArray(doc.visionPoints) ? doc.visionPoints : DEFAULT_DATA.visionPoints,
      updatedAt: doc.updatedAt,
    });
  } catch (error) {
    console.error("Failed to fetch mission and vision:", error);
    return NextResponse.json(DEFAULT_DATA);
  }
}

export async function POST(request: Request) {
  let body: Partial<MissionVisionData>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const {
    missionEyebrow,
    missionHeading,
    missionDescription,
    missionPoints,
    visionEyebrow,
    visionHeading,
    visionDescription,
    visionPoints,
  } = body;

  const updateDoc = {
    id: DOCUMENT_ID,
    missionEyebrow: typeof missionEyebrow === "string" && missionEyebrow.trim() ? missionEyebrow.trim() : DEFAULT_DATA.missionEyebrow,
    missionHeading: typeof missionHeading === "string" && missionHeading.trim() ? missionHeading.trim() : DEFAULT_DATA.missionHeading,
    missionDescription: typeof missionDescription === "string" && missionDescription.trim() ? missionDescription.trim() : DEFAULT_DATA.missionDescription,
    missionPoints: Array.isArray(missionPoints)
      ? missionPoints.filter((p): p is string => typeof p === "string" && p.trim().length > 0)
      : DEFAULT_DATA.missionPoints,
    visionEyebrow: typeof visionEyebrow === "string" && visionEyebrow.trim() ? visionEyebrow.trim() : DEFAULT_DATA.visionEyebrow,
    visionHeading: typeof visionHeading === "string" && visionHeading.trim() ? visionHeading.trim() : DEFAULT_DATA.visionHeading,
    visionDescription: typeof visionDescription === "string" && visionDescription.trim() ? visionDescription.trim() : DEFAULT_DATA.visionDescription,
    visionPoints: Array.isArray(visionPoints)
      ? visionPoints.filter((p): p is string => typeof p === "string" && p.trim().length > 0)
      : DEFAULT_DATA.visionPoints,
    updatedAt: new Date(),
  };

  try {
    const db = await getDb();
    await db.collection(COLLECTION).updateOne(
      { id: DOCUMENT_ID },
      { $set: updateDoc },
      { upsert: true }
    );

    return NextResponse.json({ success: true, data: updateDoc });
  } catch (error) {
    console.error("Failed to update mission and vision:", error);
    return NextResponse.json({ error: "Could not save mission and vision content." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
