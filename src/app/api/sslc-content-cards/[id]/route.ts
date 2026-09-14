import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { SSL_CARDS_COLLECTION, getMemoryStore, setMemoryStore } from "@/lib/sslcContentCardsDb";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { section, heading, image, descriptionHtml, status, order } = body;

  if (!isNonEmptyString(heading)) {
    return NextResponse.json({ error: "Card heading is required." }, { status: 400 });
  }

  const validSections = ["admission", "on-demand", "course-structure"];
  const finalSection = validSections.includes(section) ? section : "admission";

  const updatedCard = {
    id,
    section: finalSection as any,
    number: String(order || 1).padStart(2, "0"),
    heading: heading.trim(),
    image: typeof image === "string" ? image.trim() : "",
    descriptionHtml: typeof descriptionHtml === "string" ? descriptionHtml : "",
    status: (status === "Draft" ? "Draft" : "Published") as any,
    order: typeof order === "number" ? order : 1,
    lastUpdated: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };

  // Update memory store
  const memory = getMemoryStore();
  const existingIndex = memory.findIndex((c) => c.id === id);
  if (existingIndex >= 0) {
    memory[existingIndex] = { ...memory[existingIndex], ...updatedCard };
  } else {
    memory.push(updatedCard);
  }
  setMemoryStore(memory);

  if (ObjectId.isValid(id)) {
    try {
      const db = await getDb();
      await db.collection(SSL_CARDS_COLLECTION).updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            section: updatedCard.section,
            number: updatedCard.number,
            heading: updatedCard.heading,
            image: updatedCard.image,
            descriptionHtml: updatedCard.descriptionHtml,
            status: updatedCard.status,
            order: updatedCard.order,
            updatedAt: new Date(),
          },
        }
      );
    } catch (err) {
      console.error("Failed to update card in MongoDB (updated memory store):", err);
    }
  }

  return NextResponse.json({ ok: true, card: updatedCard });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Remove from memory store
  const memory = getMemoryStore();
  setMemoryStore(memory.filter((c) => c.id !== id));

  if (ObjectId.isValid(id)) {
    try {
      const db = await getDb();
      await db.collection(SSL_CARDS_COLLECTION).deleteOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.error("Failed to delete card from MongoDB (deleted from memory store):", err);
    }
  }

  return NextResponse.json({ ok: true });
}
