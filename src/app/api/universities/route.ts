import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "universities";

const defaultUniversities = [
  {
    name: "Aligarh Muslim University",
    slug: "aligarh-muslim-university",
    href: "/universities/degree-pg/aligarh-muslim-university",
    category: "degree-pg",
    categoryLabel: "Degree & PG",
    logo: "/images/aligrh_image.png",
    image: "/images/aligrh_image.png",
    description:
      "Aligarh Muslim University (AMU): Shaping Futures, Empowering Minds with recognized distance & online degree programs.",
    about:
      "Aligarh Muslim University is a premier Central University offering NAAC A+ accredited online and distance learning programs with global recognition.",
    brochure: "",
    accreditations: ["UGC Entitled", "DEB Approved", "NAAC A+"],
    courses: ["BA", "B.Com", "MA", "M.Com"],
    shape: "hexagon",
    accent: "red",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Swami Vivekanand Subharti University",
    slug: "swami-vivekanand-subharti-university",
    href: "/universities/degree-pg/swami-vivekanand-subharti-university",
    category: "degree-pg",
    categoryLabel: "Degree & PG",
    logo: "/images/swami-logo.webp",
    image: "/images/swami-logo.webp",
    description:
      "Swami Vivekanand Subharti University (SVSU): UGC & DEB approved online and distance learning programs.",
    about:
      "Swami Vivekanand Subharti University is a renowned institution dedicated to accessible higher education through modern distance learning.",
    brochure: "",
    accreditations: ["UGC Approved", "DEB Entitled", "AICTE"],
    courses: ["BBA", "BCA", "MBA", "MCA"],
    shape: "diamond",
    accent: "gold",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Guru Kashi University",
    slug: "guru-kashi-university",
    href: "/universities/degree-pg/guru-kashi-university",
    category: "degree-pg",
    categoryLabel: "Degree & PG",
    logo: "/images/universities/guru-kashi-university.jpg",
    image: "/images/universities/guru-kashi-university.jpg",
    description:
      "Guru Kashi University: Prominent institution offering accredited distance degree, credit transfer, and PG courses.",
    about:
      "Guru Kashi University offers industry-aligned undergraduate and postgraduate degree programs with flexible learning schedules.",
    brochure: "",
    accreditations: ["UGC Approved", "DEB Entitled", "AIU Member"],
    courses: ["BA", "B.Sc", "MA", "M.Sc"],
    shape: "circle",
    accent: "navy",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Mizoram University",
    slug: "mizoram-university",
    href: "/universities/degree-pg/mizoram-university",
    category: "degree-pg",
    categoryLabel: "Degree & PG",
    logo: "/images/andhra_image.png",
    image: "/images/andhra_image.png",
    description:
      "Mizoram University: Premier Central University offering UGC entitled online degree and post graduation programs.",
    about:
      "Mizoram University is a Central University established by an Act of Parliament offering high quality accredited online degree courses.",
    brochure: "",
    accreditations: ["Central University", "UGC Entitled", "NAAC A Grade"],
    courses: ["B.Com", "BBA", "M.Com", "MBA"],
    shape: "pentagon",
    accent: "red",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Suresh Gyan Vihar University",
    slug: "suresh-gyan-vihar-university",
    href: "/universities/degree-pg/suresh-gyan-vihar-university",
    category: "degree-pg",
    categoryLabel: "Degree & PG",
    logo: "/images/bg-1.png",
    image: "/images/bg-1.png",
    description:
      "Suresh Gyan Vihar University: NAAC A+ accredited university offering flexible recognized distance education degrees.",
    about:
      "Suresh Gyan Vihar University is the first private university in Rajasthan to be awarded NAAC A+ accreditation.",
    brochure: "",
    accreditations: ["NAAC A+", "UGC Approved", "DEB Entitled"],
    courses: ["BBA", "MBA", "MCA", "Executive MBA"],
    shape: "shield",
    accent: "gold",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Andhra University",
    slug: "andhra-university",
    href: "/universities/degree-pg/andhra-university",
    category: "degree-pg",
    categoryLabel: "Degree & PG",
    logo: "/images/andra-logo.webp",
    image: "/images/andra-logo.webp",
    description:
      "Andhra University: Renowned public university offering accredited online and distance learning degree programs.",
    about:
      "Andhra University is one of India's oldest public universities with a legacy of academic excellence and global recognition.",
    brochure: "",
    accreditations: ["Public University", "NAAC A++", "UGC Approved"],
    courses: ["BA", "B.Sc", "MA", "M.Sc", "MBA"],
    shape: "hexagon",
    accent: "navy",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "National Institute of Open Schooling",
    slug: "national-institute-of-open-schooling",
    href: "/universities/10th-plus-two/national-institute-of-open-schooling",
    category: "10th-plus-two",
    categoryLabel: "10th & Plus Two",
    logo: "/images/aligrh_image.png",
    image: "/images/aligrh_image.png",
    description:
      "National Institute of Open Schooling (NIOS): Globally recognized secondary (10th) and senior secondary (12th) open school board.",
    about:
      "NIOS is an autonomous institution under the Ministry of Education, Govt. of India, providing open secondary and senior secondary education.",
    brochure: "",
    accreditations: ["Govt. of India Recognized", "COBSE Member"],
    courses: ["Secondary (10th)", "Senior Secondary (12th)", "Vocational Courses"],
    shape: "circle",
    accent: "red",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Jamia Urdu Aligarh",
    slug: "jamia-urdu-aligarh",
    href: "/universities/10th-plus-two/jamia-urdu-aligarh",
    category: "10th-plus-two",
    categoryLabel: "10th & Plus Two",
    logo: "/images/swami-logo.webp",
    image: "/images/swami-logo.webp",
    description:
      "Jamia Urdu Aligarh: Historical educational institution offering secondary & senior secondary equivalency programs.",
    about:
      "Jamia Urdu Aligarh is a historic minority educational institution providing secondary and senior secondary level qualifications.",
    brochure: "",
    accreditations: ["Government Recognized", "Equivalency Certification"],
    courses: ["Adeeb (10th Equivalent)", "Adeeb-e-Maher (12th Equivalent)"],
    shape: "pentagon",
    accent: "gold",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "BOSSE Board",
    slug: "bosse",
    href: "/universities/10th-plus-two/bosse",
    category: "10th-plus-two",
    categoryLabel: "10th & Plus Two",
    logo: "/images/andra-logo.webp",
    image: "/images/andra-logo.webp",
    description:
      "Board of Open Schooling and Skill Education (BOSSE): Recognized open schooling board for 10th, 12th & skill certifications.",
    about:
      "BOSSE is a recognized open schooling board in Sikkim providing secondary, senior secondary, and skill-based vocational certifications.",
    brochure: "",
    accreditations: ["Statutory Board", "COBSE Recognized"],
    courses: ["Secondary Schooling", "Senior Secondary", "Skill Diploma"],
    shape: "shield",
    accent: "navy",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION);

    let items = await collection.find().sort({ createdAt: -1 }).toArray();

    // Auto-seed default dataset if MongoDB collection is empty
    if (items.length === 0) {
      await collection.insertMany(defaultUniversities);
      items = await collection.find().sort({ createdAt: -1 }).toArray();
    }

    const universities = items.map((item) => ({
      id: item._id.toString(),
      name: item.name || "Untitled University",
      slug: item.slug || "",
      href: item.href || "",
      category: item.category || "degree-pg",
      categoryLabel: item.categoryLabel || (item.category === "10th-plus-two" ? "10th & Plus Two" : "Degree & PG"),
      logo: item.logo || "",
      image: item.image || "",
      description: item.description || "",
      about: item.about || "",
      brochure: item.brochure || "",
      accreditations: Array.isArray(item.accreditations) ? item.accreditations : [],
      courses: Array.isArray(item.courses) ? item.courses : [],
      shape: item.shape || "hexagon",
      accent: item.accent || "red",
      status: item.status || "published",
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return NextResponse.json({ universities });
  } catch (error) {
    console.error("Failed to load universities:", error);
    return NextResponse.json({ error: "Could not load universities." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "University name is required." }, { status: 400 });
  }

  const slug =
    typeof body.slug === "string" && body.slug.trim().length > 0
      ? body.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const category = body.category === "10th-plus-two" ? "10th-plus-two" : "degree-pg";
  const categoryLabel =
    typeof body.categoryLabel === "string" && body.categoryLabel.trim()
      ? body.categoryLabel.trim()
      : category === "10th-plus-two"
      ? "10th & Plus Two"
      : "Degree & PG";

  const defaultHref =
    category === "10th-plus-two"
      ? `/universities/10th-plus-two/${slug}`
      : `/universities/degree-pg/${slug}`;

  const href = typeof body.href === "string" && body.href.trim() ? body.href.trim() : defaultHref;
  const logo = typeof body.logo === "string" ? body.logo.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const about = typeof body.about === "string" ? body.about.trim() : "";
  const brochure = typeof body.brochure === "string" ? body.brochure.trim() : "";

  const accreditations = Array.isArray(body.accreditations)
    ? body.accreditations.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : typeof body.accreditations === "string"
    ? body.accreditations.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const courses = Array.isArray(body.courses)
    ? body.courses.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : typeof body.courses === "string"
    ? body.courses.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const shape =
    typeof body.shape === "string" && ["hexagon", "diamond", "circle", "pentagon", "shield"].includes(body.shape)
      ? body.shape
      : "hexagon";

  const accent =
    typeof body.accent === "string" && ["red", "navy", "gold"].includes(body.accent) ? body.accent : "red";

  const status = body.status === "draft" ? "draft" : "published";

  const doc = {
    name,
    slug,
    href,
    category,
    categoryLabel,
    logo,
    image,
    description,
    about,
    brochure,
    accreditations,
    courses,
    shape,
    accent,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).insertOne(doc);
    return NextResponse.json(
      {
        success: true,
        university: {
          id: result.insertedId.toString(),
          ...doc,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create university:", error);
    return NextResponse.json({ error: "Could not save university document." }, { status: 500 });
  }
}
