import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "enquiries";

type EnquiryPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  preference?: unknown;
  source?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let body: EnquiryPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, phone, preference, source } = body;

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(phone)) {
    return NextResponse.json({ error: "Name, email, and phone are required." }, { status: 400 });
  }

  const doc = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    preference: isNonEmptyString(preference) ? preference.trim() : "",
    source: isNonEmptyString(source) ? source.trim() : "unknown",
    createdAt: new Date(),
  };

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).insertOne(doc);
    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Failed to save enquiry:", error);
    return NextResponse.json({ error: "Could not save enquiry. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const enquiries = await db.collection(COLLECTION).find().sort({ createdAt: -1 }).limit(200).toArray();
    return NextResponse.json({
      enquiries: enquiries.map((e) => ({
        id: e._id.toString(),
        name: e.name,
        email: e.email,
        phone: e.phone,
        preference: e.preference,
        source: e.source,
        createdAt: e.createdAt,
      })),
    });
  } catch (error) {
    console.error("Failed to load enquiries:", error);
    return NextResponse.json({ error: "Could not load enquiries." }, { status: 500 });
  }
}
