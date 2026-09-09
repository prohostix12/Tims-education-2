import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { parseBlogDate } from "@/data/blogData";

const COLLECTION = "blog_posts";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const db = await getDb();

    let query: Record<string, unknown> = { slug: id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { slug: id }] };
    }

    const item = await db.collection(COLLECTION).findOne(query);

    if (!item) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    return NextResponse.json({
      post: {
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
      },
    });
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return NextResponse.json({ error: "Could not load blog post." }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const db = await getDb();

    let query: Record<string, unknown> = { slug: id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { slug: id }] };
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const updateDoc: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (typeof body.title === "string" && body.title.trim().length > 0) {
      updateDoc.title = body.title.trim();
    }
    if (typeof body.slug === "string" && body.slug.trim().length > 0) {
      updateDoc.slug = body.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }
    if (typeof body.subtitle === "string") {
      updateDoc.subtitle = body.subtitle.trim();
    }
    if (typeof body.dateString === "string" && body.dateString.trim()) {
      const parsed = parseBlogDate(body.dateString.trim());
      updateDoc.dateString = body.dateString.trim();
      updateDoc.day = body.day && typeof body.day === "string" && body.day.trim() ? body.day.trim() : parsed.day;
      updateDoc.month = body.month && typeof body.month === "string" && body.month.trim() ? body.month.trim() : parsed.month;
      updateDoc.year = body.year && typeof body.year === "string" && body.year.trim() ? body.year.trim() : parsed.year;
    } else {
      if (typeof body.day === "string") updateDoc.day = body.day.trim();
      if (typeof body.month === "string") updateDoc.month = body.month.trim();
      if (typeof body.year === "string") updateDoc.year = body.year.trim();
    }
    if (typeof body.author === "string") {
      updateDoc.author = body.author.trim();
    }
    if (typeof body.authorRole === "string") {
      updateDoc.authorRole = body.authorRole.trim();
    }
    if (typeof body.readTime === "string") {
      updateDoc.readTime = body.readTime.trim();
    }
    if (typeof body.category === "string") {
      updateDoc.category = body.category.trim();
    }
    if (typeof body.image === "string") {
      updateDoc.image = body.image.trim();
    }
    if (typeof body.excerpt === "string") {
      updateDoc.excerpt = body.excerpt.trim();
    }
    if (body.content && typeof body.content === "object") {
      updateDoc.content = body.content;
    }
    if (Array.isArray(body.tags)) {
      updateDoc.tags = body.tags;
    }
    if (typeof body.isPublished === "boolean") {
      updateDoc.isPublished = body.isPublished;
    }
    if (typeof body.isFeaturedOnHome === "boolean") {
      updateDoc.isFeaturedOnHome = body.isFeaturedOnHome;
    }
    if (typeof body.comments === "number") {
      updateDoc.comments = body.comments;
    }


    const result = await db.collection(COLLECTION).updateOne(query, { $set: updateDoc });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blog post updated successfully." });
  } catch (error) {
    console.error("Failed to update blog post:", error);
    return NextResponse.json({ error: "Could not update blog post." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const db = await getDb();

    let query: Record<string, unknown> = { slug: id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { slug: id }] };
    }

    const result = await db.collection(COLLECTION).deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blog post deleted successfully." });
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return NextResponse.json({ error: "Could not delete blog post." }, { status: 500 });
  }
}
