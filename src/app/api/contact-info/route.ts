import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "contact_info";

export type OfficeInfo = {
  title: string;
  address: string;
  phone: string;
  email: string;
};

export type SocialInfo = {
  youtube: string;
  facebook: string;
  instagram: string;
  x: string;
  telegram: string;
};

export type ContactInfoData = {
  offices: OfficeInfo[];
  socials: SocialInfo;
  updatedAt?: string;
};

export const DEFAULT_CONTACT_INFO: ContactInfoData = {
  offices: [
    {
      title: "Head Office",
      address: "2nd Floor, Pamls Tower, near Central Bank, Thazhepalam, Tirur, Kerala 676101",
      phone: "+91 9961967777",
      email: "info@timseducation.com",
    },
    {
      title: "Edapal Office",
      address: "2nd floor Al madeela complex Calicut road Edappal 679576 MALAPPURAM DT Kerala",
      phone: "+91 9526387777",
      email: "info@timseducation.com",
    },
  ],
  socials: {
    youtube: "https://youtube.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    x: "https://x.com",
    telegram: "https://telegram.org",
  },
};

export async function GET() {
  try {
    const db = await getDb();
    const doc = await db.collection(COLLECTION).findOne({});

    if (!doc) {
      return NextResponse.json({ contactInfo: DEFAULT_CONTACT_INFO });
    }

    return NextResponse.json({
      contactInfo: {
        offices: Array.isArray(doc.offices) && doc.offices.length > 0
          ? doc.offices.map((o: Record<string, unknown>) => ({
              title: String(o.title || ""),
              address: String(o.address || ""),
              phone: String(o.phone || ""),
              email: String(o.email || ""),
            }))
          : DEFAULT_CONTACT_INFO.offices,
        socials: {
          youtube: String(doc.socials?.youtube ?? DEFAULT_CONTACT_INFO.socials.youtube),
          facebook: String(doc.socials?.facebook ?? DEFAULT_CONTACT_INFO.socials.facebook),
          instagram: String(doc.socials?.instagram ?? DEFAULT_CONTACT_INFO.socials.instagram),
          x: String(doc.socials?.x ?? DEFAULT_CONTACT_INFO.socials.x),
          telegram: String(doc.socials?.telegram ?? DEFAULT_CONTACT_INFO.socials.telegram),
        },
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
      },
    });
  } catch (error) {
    console.error("Failed to load contact info from MongoDB:", error);
    return NextResponse.json({ contactInfo: DEFAULT_CONTACT_INFO });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { offices, socials } = body || {};

    if (!Array.isArray(offices)) {
      return NextResponse.json({ error: "Offices must be an array." }, { status: 400 });
    }

    const cleanedOffices = offices.map((o: Record<string, unknown>) => ({
      title: String(o.title || "").trim(),
      address: String(o.address || "").trim(),
      phone: String(o.phone || "").trim(),
      email: String(o.email || "").trim(),
    }));

    const cleanedSocials = {
      youtube: String(socials?.youtube || "").trim(),
      facebook: String(socials?.facebook || "").trim(),
      instagram: String(socials?.instagram || "").trim(),
      x: String(socials?.x || "").trim(),
      telegram: String(socials?.telegram || "").trim(),
    };

    const updateDoc = {
      offices: cleanedOffices,
      socials: cleanedSocials,
      updatedAt: new Date(),
    };

    const db = await getDb();
    await db.collection(COLLECTION).updateOne({}, { $set: updateDoc }, { upsert: true });

    return NextResponse.json({
      success: true,
      contactInfo: {
        ...updateDoc,
        updatedAt: updateDoc.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to save contact info to MongoDB:", error);
    return NextResponse.json({ error: "Failed to save contact information. Please try again." }, { status: 500 });
  }
}
