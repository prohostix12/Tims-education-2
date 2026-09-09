import Link from "next/link";
import { fetchAllBlogPostsFromDb, BlogPost } from "@/data/blogData";
import "./tims-blog-archive.css";

function ArrowIcon() {
  return (
    <svg
      className="tims-blog-archive-link-arrow"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function BlogArchiveSection({ initialPosts }: { initialPosts?: BlogPost[] }) {
  const posts = initialPosts || (await fetchAllBlogPostsFromDb());

  return (
    <section className="tims-blog-archive">
      <div className="tims-blog-archive-inner">
        <div className="tims-blog-archive-header">
          <span className="tims-blog-archive-label">Our Blog</span>
          <h2 className="tims-blog-archive-heading">News &amp; Articles</h2>
          <p className="tims-blog-archive-subtitle">
            Updates, guides, and announcements from TIMS Education.
          </p>
        </div>

        <div className="tims-blog-archive-grid">
          {posts.map((post) => (
            <article className="tims-blog-archive-card" key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="tims-blog-archive-media">
                {Boolean(post.image) && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={post.image} alt={post.title} className="tims-blog-archive-image" />
                )}
                <span className="tims-blog-archive-category">{post.category}</span>
              </Link>


              <div className="tims-blog-archive-body">
                <Link href={`/blog/${post.slug}`} className="tims-blog-archive-title-link">
                  <h3 className="tims-blog-archive-title">{post.title}</h3>
                </Link>

                <div className="tims-blog-archive-meta">
                  <span>{post.dateString}</span>
                  <span className="tims-blog-archive-meta-divider" aria-hidden="true">
                    /
                  </span>
                  <span>{post.readTime}</span>
                  <span className="tims-blog-archive-meta-divider" aria-hidden="true">
                    /
                  </span>
                  <span>{post.author}</span>
                </div>

                <p className="tims-blog-archive-excerpt">{post.excerpt}</p>

                <Link href={`/blog/${post.slug}`} className="tims-blog-archive-link">
                  <span>Read Full Article</span>
                  <ArrowIcon />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


