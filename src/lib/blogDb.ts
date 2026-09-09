import { getDb } from "@/lib/mongodb";
import { BLOG_POSTS, parseBlogDate, BlogPost } from "@/data/blogData";

function resolveItemDates(item: any) {
  const parsed = parseBlogDate(item.dateString || item.createdAt);
  return {
    day: parsed.day,
    month: parsed.month,
    year: parsed.year,
    dateString:
      item.dateString && typeof item.dateString === "string" && item.dateString.trim()
        ? item.dateString.trim()
        : parsed.dateString,
  };
}

export async function fetchAllBlogPostsFromDb(): Promise<BlogPost[]> {
  try {
    const db = await getDb();
    const items = await db.collection("blog_posts").find({ isPublished: true }).sort({ createdAt: -1 }).toArray();

    if (items.length > 0) {
      return items.map((item) => {
        const dates = resolveItemDates(item);
        return {
          slug: item.slug || "",
          title: item.title || "",
          subtitle: item.subtitle || "",
          day: dates.day,
          month: dates.month,
          year: dates.year,
          dateString: dates.dateString,
          author: item.author || "TIMS Education",
          authorRole: item.authorRole || "Academic Team",
          comments: typeof item.comments === "number" ? item.comments : 0,
          readTime: item.readTime || "5 min read",
          category: item.category || "General",
          image: item.image || "",
          excerpt: item.excerpt || "",
          content: item.content || { intro: "", keyTakeaways: [], sections: [], conclusion: "" },
          tags: Array.isArray(item.tags) ? item.tags : [],
        };
      });
    }
  } catch (err) {
    console.error("Error fetching blog posts from DB:", err);
  }
  return BLOG_POSTS;
}

export async function fetchBlogPostBySlugFromDb(slug: string): Promise<BlogPost | undefined> {
  try {
    const db = await getDb();
    const item = await db.collection("blog_posts").findOne({ slug, isPublished: true });

    if (item) {
      const dates = resolveItemDates(item);
      return {
        slug: item.slug || "",
        title: item.title || "",
        subtitle: item.subtitle || "",
        day: dates.day,
        month: dates.month,
        year: dates.year,
        dateString: dates.dateString,
        author: item.author || "TIMS Education",
        authorRole: item.authorRole || "Academic Team",
        comments: typeof item.comments === "number" ? item.comments : 0,
        readTime: item.readTime || "5 min read",
        category: item.category || "General",
        image: item.image || "",
        excerpt: item.excerpt || "",
        content: item.content || { intro: "", keyTakeaways: [], sections: [], conclusion: "" },
        tags: Array.isArray(item.tags) ? item.tags : [],
      };
    }
  } catch (err) {
    console.error("Error fetching blog post by slug from DB:", err);
  }
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export async function fetchRelatedPostsFromDb(currentSlug: string, limit = 2): Promise<BlogPost[]> {
  const allPosts = await fetchAllBlogPostsFromDb();
  return allPosts.filter((post) => post.slug !== currentSlug).slice(0, limit);
}

export async function fetchFeaturedHomeBlogPostsFromDb(limit = 3): Promise<BlogPost[]> {
  try {
    const db = await getDb();

    // First try fetching published posts specifically marked as isFeaturedOnHome
    const featuredItems = await db
      .collection("blog_posts")
      .find({ isPublished: true, isFeaturedOnHome: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    if (featuredItems.length > 0) {
      return featuredItems.map((item) => {
        const dates = resolveItemDates(item);
        return {
          slug: item.slug || "",
          title: item.title || "",
          subtitle: item.subtitle || "",
          day: dates.day,
          month: dates.month,
          year: dates.year,
          dateString: dates.dateString,
          author: item.author || "TIMS Education",
          authorRole: item.authorRole || "Academic Team",
          comments: typeof item.comments === "number" ? item.comments : 0,
          readTime: item.readTime || "5 min read",
          category: item.category || "General",
          image: item.image || "",
          excerpt: item.excerpt || "",
          content: item.content || { intro: "", keyTakeaways: [], sections: [], conclusion: "" },
          tags: Array.isArray(item.tags) ? item.tags : [],
          isFeaturedOnHome: true,
        };
      });
    }

    // Fallback: get latest published posts if no posts have isFeaturedOnHome: true
    const recentItems = await db
      .collection("blog_posts")
      .find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    if (recentItems.length > 0) {
      return recentItems.map((item) => {
        const dates = resolveItemDates(item);
        return {
          slug: item.slug || "",
          title: item.title || "",
          subtitle: item.subtitle || "",
          day: dates.day,
          month: dates.month,
          year: dates.year,
          dateString: dates.dateString,
          author: item.author || "TIMS Education",
          authorRole: item.authorRole || "Academic Team",
          comments: typeof item.comments === "number" ? item.comments : 0,
          readTime: item.readTime || "5 min read",
          category: item.category || "General",
          image: item.image || "",
          excerpt: item.excerpt || "",
          content: item.content || { intro: "", keyTakeaways: [], sections: [], conclusion: "" },
          tags: Array.isArray(item.tags) ? item.tags : [],
          isFeaturedOnHome: Boolean(item.isFeaturedOnHome),
        };
      });
    }
  } catch (err) {
    console.error("Error fetching featured blog posts from DB:", err);
  }

  // Fallback to static array
  return BLOG_POSTS.slice(0, limit);
}
