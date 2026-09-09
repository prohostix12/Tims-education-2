import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { parseBlogDate } from "@/data/blogData";

const COLLECTION = "blog_posts";

type BlogPayload = {
  slug?: unknown;
  title?: unknown;
  subtitle?: unknown;
  day?: unknown;
  month?: unknown;
  year?: unknown;
  dateString?: unknown;
  author?: unknown;
  authorRole?: unknown;
  comments?: unknown;
  readTime?: unknown;
  category?: unknown;
  image?: unknown;
  excerpt?: unknown;
  content?: unknown;
  tags?: unknown;
  isPublished?: unknown;
  isFeaturedOnHome?: unknown;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";
    const featuredOnly = searchParams.get("featured") === "true";
    const categoryFilter = searchParams.get("category");

    const query: Record<string, unknown> = {};
    if (publishedOnly) {
      query.isPublished = true;
    }
    if (featuredOnly) {
      query.isFeaturedOnHome = true;
    }
    if (categoryFilter) {
      query.category = categoryFilter;
    }

    const db = await getDb();
    const items = await db.collection(COLLECTION).find(query).sort({ createdAt: -1 }).toArray();

    const formattedItems = items.map((item) => ({
      id: item._id.toString(),
      slug: item.slug || "",
      title: item.title || "",
      subtitle: item.subtitle || "",
      day: item.day || "",
      month: item.month || "",
      year: item.year || "",
      dateString: item.dateString || "",
      author: item.author || "TIMS Education",
      authorRole: item.authorRole || "Academic Team",
      comments: typeof item.comments === "number" ? item.comments : 0,
      readTime: item.readTime || "5 min read",
      category: item.category || "General",
      image: item.image || "",
      excerpt: item.excerpt || "",
      content: item.content || {
        intro: "",
        keyTakeaways: [],
        sections: [],
        conclusion: "",
      },
      tags: Array.isArray(item.tags) ? item.tags : [],
      isPublished: typeof item.isPublished === "boolean" ? item.isPublished : true,
      isFeaturedOnHome: typeof item.isFeaturedOnHome === "boolean" ? item.isFeaturedOnHome : false,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return NextResponse.json({ posts: formattedItems });
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json({ error: "Could not load blog posts." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: BlogPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const {
    slug,
    title,
    subtitle,
    day,
    month,
    year,
    dateString,
    author,
    authorRole,
    comments,
    readTime,
    category,
    image,
    excerpt,
    content,
    tags,
    isPublished,
    isFeaturedOnHome,
  } = body;

  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Article title is required." }, { status: 400 });
  }

  const generatedSlug =
    typeof slug === "string" && slug.trim().length > 0
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      : title
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

  const currentDate = new Date();
  const parsedDate = parseBlogDate(typeof dateString === "string" && dateString.trim() ? dateString.trim() : undefined);

  const doc = {
    slug: generatedSlug,
    title: title.trim(),
    subtitle: typeof subtitle === "string" ? subtitle.trim() : "",
    day: typeof day === "string" && day.trim() ? day.trim() : parsedDate.day,
    month: typeof month === "string" && month.trim() ? month.trim() : parsedDate.month,
    year: typeof year === "string" && year.trim() ? year.trim() : parsedDate.year,
    dateString: typeof dateString === "string" && dateString.trim() ? dateString.trim() : parsedDate.dateString,
    author: typeof author === "string" && author.trim() ? author.trim() : "TIMS Education",
    authorRole: typeof authorRole === "string" ? authorRole.trim() : "Academic Team",
    comments: typeof comments === "number" ? comments : 0,
    readTime: typeof readTime === "string" && readTime.trim() ? readTime.trim() : "5 min read",
    category: typeof category === "string" && category.trim() ? category.trim() : "General",
    image: typeof image === "string" ? image.trim() : "",
    excerpt: typeof excerpt === "string" ? excerpt.trim() : "",
    content: content && typeof content === "object" ? content : {
      intro: "",
      keyTakeaways: [],
      sections: [],
      conclusion: "",
    },
    tags: Array.isArray(tags) ? tags : [],
    isPublished: typeof isPublished === "boolean" ? isPublished : true,
    isFeaturedOnHome: typeof isFeaturedOnHome === "boolean" ? isFeaturedOnHome : false,
    createdAt: currentDate,
    updatedAt: currentDate,
  };

  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        post: {
          id: result.insertedId.toString(),
          ...doc,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return NextResponse.json({ error: "Could not save blog post." }, { status: 500 });
  }
}

