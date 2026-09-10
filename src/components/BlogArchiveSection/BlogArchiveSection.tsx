import Link from "next/link";
import { fetchAllBlogPostsFromDb } from "@/lib/blogDb";
import { BlogPost } from "@/data/blogData";
import "./tims-blog-archive.css";

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path
        d="M4 12.5a7.5 7.5 0 1 1 3.2 6.1L4 19.5l1-3.1a7.4 7.4 0 0 1-1-3.9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="tims-blog-card-arrow"
      viewBox="0 0 24 24"
      width="16"
      height="16"
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
          <span className="tims-blog-archive-label">From the Blog</span>
          <h2 className="tims-blog-archive-heading">News &amp; Articles</h2>
          <p className="tims-blog-archive-subtitle">
            Updates, guides, and announcements from TIMS Education.
          </p>
        </div>

        <div className="tims-blog-archive-grid">
          {posts.map((post, index) => (
            <div
              className={`tims-blog-paper-wrapper torn-variant-${(index % 3) + 1}`}
              key={post.slug}
            >
              <article className="tims-blog-paper-card">
                <Link href={`/blog/${post.slug}`} className="tims-blog-paper-image-wrap">
                  {Boolean(post.image) && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={post.image} alt={post.title} className="tims-blog-paper-image" />
                  )}
                  {Boolean(post.day) && Boolean(post.month) && (
                    <span className="tims-blog-paper-date">
                      <span className="tims-blog-paper-date-day">{post.day}</span>
                      <span className="tims-blog-paper-date-month">
                        {post.month} {post.year}
                      </span>
                    </span>
                  )}
                  {Boolean(post.category) && (
                    <span className="tims-blog-paper-category">{post.category}</span>
                  )}
                </Link>

                <div className="tims-blog-paper-content">
                  <h3 className="tims-blog-paper-title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  {Boolean(post.excerpt) && (
                    <p className="tims-blog-paper-excerpt">{post.excerpt}</p>
                  )}

                  <div className="tims-blog-paper-footer">
                    <div className="tims-blog-paper-meta">
                      <span className="tims-blog-paper-author">{post.author}</span>
                      <span className="tims-blog-paper-meta-divider" aria-hidden="true" />
                      <span className="tims-blog-paper-comments">
                        <CommentIcon />
                        {post.comments ?? 0} Comments
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="tims-blog-paper-link">
                      <span>Read More</span>
                      <ArrowIcon />
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


