import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UniversityDetailPage, { type UniversityPageDetails } from "@/components/UniversityDetailPage/UniversityDetailPage";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

async function getBoardData(slug: string): Promise<UniversityPageDetails | null> {
  try {
    const { getDb } = await import("@/lib/mongodb");
    const db = await getDb();
    const item = await db.collection("universities").findOne({ slug });

    if (!item) return null;

    return {
      name: item.name,
      slug: item.slug,
      image: item.image,
      logo: item.logo,
      description: item.description,
      about: item.about,
      achievementsTitle: item.achievementsTitle,
      achievementsText: item.achievementsText,
      affiliationsText: item.affiliationsText,
      cdoeTitle: item.cdoeTitle,
      cdoeText: item.cdoeText,
      programsHeading: item.programsHeading,
      programsTable: item.programsTable,
      brochure: item.brochure,
      accreditations: item.accreditations,
      courses: item.courses,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const board = await getBoardData(slug);
  if (!board) return { title: "Board Not Found | TIMS Education" };
  return {
    title: `${board.name} | TIMS Education`,
    description: board.description || `${board.name} 10th and 12th open schooling programs.`,
  };
}

export default async function BoardDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  const data = await getBoardData(slug);

  if (!data) {
    notFound();
  }

  return <UniversityDetailPage data={data} />;
}
