import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "faqs";

type FaqPayload = {
  question?: unknown;
  answer?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET() {
  try {
    const db = await getDb();
    const faqs = await db
      .collection(COLLECTION)
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      faqs: faqs.map((item) => ({
        id: item._id.toString(),
        question: item.question,
        answer: item.answer,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    console.error("Failed to load FAQs:", error);
    return NextResponse.json({ error: "Could not load FAQs." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: FaqPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { question, answer } = body;

  if (!isNonEmptyString(question)) {
    return NextResponse.json({ error: "Question is required." }, { status: 400 });
  }

  if (!isNonEmptyString(answer)) {
    return NextResponse.json({ error: "Answer is required." }, { status: 400 });
  }

  const doc = {
    question: question.trim(),
    answer: answer.trim(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).insertOne(doc);
    return NextResponse.json({ id: result.insertedId.toString(), ...doc }, { status: 201 });
  } catch (error) {
    console.error("Failed to create FAQ:", error);
    return NextResponse.json({ error: "Could not create FAQ." }, { status: 500 });
  }
}
