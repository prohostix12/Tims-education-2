import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "faqs";

type FaqPayload = {
  question?: unknown;
  answer?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid FAQ id." }, { status: 400 });
  }

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

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          question: question.trim(),
          answer: answer.trim(),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "FAQ item not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update FAQ:", error);
    return NextResponse.json({ error: "Could not update FAQ." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid FAQ id." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "FAQ item not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete FAQ:", error);
    return NextResponse.json({ error: "Could not delete FAQ." }, { status: 500 });
  }
}
