import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UniversityDetailPage, { type UniversityPageDetails } from "@/components/UniversityDetailPage/UniversityDetailPage";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

// Fallback data for Suresh Gyan Vihar University if not yet edited in MongoDB
const sgvuFallbackData: UniversityPageDetails = {
  name: "Suresh Gyan Vihar University",
  slug: "suresh-gyan-vihar-university",
  image: "https://www.gyanvihar.org/media-library/uploads/158331894266081.jpg",
  logo: "/images/sureshviharuniversity.png",
  about:
    "Suresh Gyan Vihar University (SGVU) is a not-for-profit autonomous private university located in Jaipur, Rajasthan, India. In 2017, the university became the first private university in Rajasthan to be awarded an 'A' grade by National Assessment and Accreditation Council, out of the 22 NAAC accredited universities in Rajasthan. The University was established through the Suresh Gyan Vihar University, Jaipur Act (Act no. 16 of 2008) of the Government of Rajasthan. Its predecessor institution, Gyan Vihar College, Jaipur, had been in existence since 1999. Its parent institution Sahitya Sadawart Samiti was founded in 1938.",
  achievementsTitle: "University Achievements",
  achievementsText:
    "In 2017, the university was awarded an 'A' grade by National Assessment and Accreditation Council (NAAC). It was the first private university in Jaipur to receive accreditation from National Board of Accreditation (NBA).",
  affiliationsText: "NAAC 'A' grade, UGC, AICTE, NBA, AIU, PCI, NCTE.",
  cdoeTitle: "CDOE",
  cdoeText:
    "Center for Distance and Online Education (CDOE), Suresh GyanVihar University has set out its journey in the year 2012 with the vision to serve the aspirant students who could not enter into regular mode for higher education. Today owing to the quality of educational programmes offered and the degree awarded regular mode, there is a great demand of the programmes offered by Center for Distance and Online Education (CDOE), Suresh GyanVihar University across the nation. CODE, SGVU offers BBA, BA, B.COM, MA, M.COM and MBA programmes in UG & PG courses.",
  programsHeading: "Course Fees",
  programsTable: [
    {
      sl: 1,
      course: "BA General",
      specialization: [
        "Economics, History, English Literature, Psychology, Political Science, Public Administration, Geography",
      ],
      fees: "10+2 or its equivalent",
    },
    { sl: 2, course: "BJMC", specialization: "", fees: "10+2 or its equivalent" },
    { sl: 3, course: "BBA", specialization: "", fees: "10+2 or its equivalent" },
    { sl: 4, course: "B COM", specialization: "", fees: "10+2 or its equivalent" },
    {
      sl: 5,
      course: "MBA",
      specialization: [
        "1. Human Resource Management",
        "2. Financial Planning & Analysis",
        "3. Marketing",
        "4. Finance",
        "5. Operation & Production Management",
      ],
      fees: "Graduation with a 50% score, from a recognized university.",
    },
    {
      sl: 6,
      course: "MBA",
      specialization: [
        "1. International Marketing",
        "2. Hospital Management",
        "3. Information Technology",
        "4. Business Analytics & Intelligence.",
        "5. Branding & Advertising",
        "6. Project Leadership Management",
        "7. Banking Management",
        "8. E-commerce Marketing & Management",
        "9. Mass Communication",
        "10. Digital Marketing",
        "11. Risk Management",
        "12. Business Leadership",
        "13. Strategic Management",
        "14. Entrepreneurship",
        "15. Media & Entertainment Management",
        "16. Foreign Trade & Global Business management",
        "17. Investment Banking & Wealth Management",
        "18. Supply Chain Management",
      ],
      fees: "Graduation with a 50% score, from a recognized university.",
    },
    {
      sl: 7,
      course: "MA",
      specialization: ["English, Hindi, Political Science, Sociology, History, Economics"],
      fees: "Any Degree from Recognized University",
    },
  ],
  brochure: "/documents/sgvu-brochure.pdf",
};

async function getUniversityData(slug: string): Promise<UniversityPageDetails | null> {
  if (slug === "suresh-gyan-vihar-university") {
    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();
      const dbItem = await db.collection("universities").findOne({ slug });
      if (dbItem) {
        return {
          name: dbItem.name || sgvuFallbackData.name,
          slug: dbItem.slug || sgvuFallbackData.slug,
          image: dbItem.image || sgvuFallbackData.image,
          logo: dbItem.logo || sgvuFallbackData.logo,
          description: dbItem.description,
          about: dbItem.about || sgvuFallbackData.about,
          achievementsTitle: dbItem.achievementsTitle || sgvuFallbackData.achievementsTitle,
          achievementsText: dbItem.achievementsText || sgvuFallbackData.achievementsText,
          affiliationsText: dbItem.affiliationsText || sgvuFallbackData.affiliationsText,
          cdoeTitle: dbItem.cdoeTitle || sgvuFallbackData.cdoeTitle,
          cdoeText: dbItem.cdoeText || sgvuFallbackData.cdoeText,
          programsHeading: dbItem.programsHeading || sgvuFallbackData.programsHeading,
          programsTable:
            Array.isArray(dbItem.programsTable) && dbItem.programsTable.length > 0
              ? dbItem.programsTable
              : sgvuFallbackData.programsTable,
          brochure: dbItem.brochure || sgvuFallbackData.brochure,
          accreditations: dbItem.accreditations,
          courses: dbItem.courses,
        };
      }
    } catch {
      // Fallback
    }
    return sgvuFallbackData;
  }

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
  const uni = await getUniversityData(slug);
  if (!uni) return { title: "University Not Found | TIMS Education" };
  return {
    title: `${uni.name} | TIMS Education`,
    description: uni.description || `${uni.name} distance and online education programs.`,
  };
}

export default async function DegreePgUniversityPage({ params }: RouteParams) {
  const { slug } = await params;
  const data = await getUniversityData(slug);

  if (!data) {
    notFound();
  }

  return <UniversityDetailPage data={data} />;
}
