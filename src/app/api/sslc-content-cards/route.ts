import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { SSL_CARDS_COLLECTION, getMemoryStore, setMemoryStore } from "@/lib/sslcContentCardsDb";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection(SSL_CARDS_COLLECTION)
      .find()
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const dbCards = docs.map((doc) => ({
      id: doc._id.toString(),
      section: doc.section,
      number: doc.number || "01",
      heading: doc.heading,
      image: doc.image || "",
      descriptionHtml: doc.descriptionHtml || "",
      status: doc.status || "Published",
      order: typeof doc.order === "number" ? doc.order : 1,
      lastUpdated: doc.updatedAt
        ? new Date(doc.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Today",
    }));

    setMemoryStore(dbCards as any);
    return NextResponse.json({ cards: dbCards });
  } catch (error) {
    console.error("Failed to fetch SSLC content cards from MongoDB (using memory store fallback):", error);
    const memoryCards = getMemoryStore();
    return NextResponse.json({ cards: memoryCards, fallback: true });
  }
}

export async function POST(request: Request) {
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

  const newCard = {
    id: `card-${Date.now()}`,
    section: finalSection as any,
    number: String(order || 1).padStart(2, "0"),
    heading: heading.trim(),
    image: isNonEmptyString(image) ? image.trim() : "",
    descriptionHtml: typeof descriptionHtml === "string" ? descriptionHtml : "",
    status: (status === "Draft" ? "Draft" : "Published") as any,
    order: typeof order === "number" ? order : 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUpdated: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };

  const memory = getMemoryStore();
  setMemoryStore([newCard, ...memory]);

  try {
    const db = await getDb();
    const result = await db.collection(SSL_CARDS_COLLECTION).insertOne({
      section: newCard.section,
      number: newCard.number,
      heading: newCard.heading,
      image: newCard.image,
      descriptionHtml: newCard.descriptionHtml,
      status: newCard.status,
      order: newCard.order,
      createdAt: newCard.createdAt,
      updatedAt: newCard.updatedAt,
    });
    return NextResponse.json({ ...newCard, id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("Failed to insert card into MongoDB (saved to fallback store):", error);
    return NextResponse.json(newCard, { status: 201 });
  }
}
