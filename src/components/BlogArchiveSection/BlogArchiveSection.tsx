import "./tims-blog-archive.css";

type ArchivePost = {
  slug: string;
  title: string;
  date: string;
  comments: number;
  excerpt: string;
};

const posts: ArchivePost[] = [
  {
    slug: "best-distance-education-kerala",
    title: "Best Distance Education Institution in Kerala",
    date: "January 8, 2026",
    comments: 0,
    excerpt:
      "Kerala is known for having great schools, and it has a lot of schools that offer distance learning. Because there…",
  },
  {
    slug: "online-degree-vs-distance-degree",
    title: "Online Degree vs Distance Degree: Which One Is Better?",
    date: "January 8, 2026",
    comments: 0,
    excerpt:
      "Choosing between an online degree and a distance degree can be confusing for many students. Here’s what sets them apart…",
  },
  {
    slug: "svsu-december-2025-results",
    title: "SVSU December 2025 Session Exam Results Published",
    date: "March 13, 2026",
    comments: 0,
    excerpt:
      "Swami Vivekanand Subharti University has released the results for the December 2025 examination session. Students can now…",
  },
];

function ImagePlaceholderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m4.5 17 4.8-5 3.4 3.6 2.4-2.6 4.4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

export default function BlogArchiveSection() {
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
              <div className="tims-blog-archive-media">
                <ImagePlaceholderIcon />
                <span className="tims-blog-archive-media-hint">Image coming soon</span>
              </div>

              <div className="tims-blog-archive-body">
                <h3 className="tims-blog-archive-title">{post.title}</h3>

                <div className="tims-blog-archive-meta">
                  <span>{post.date}</span>
                  <span className="tims-blog-archive-meta-divider" aria-hidden="true">
                    /
                  </span>
                  <span>{post.comments === 0 ? "No Comments" : `${post.comments} Comments`}</span>
                </div>

                <p className="tims-blog-archive-excerpt">{post.excerpt}</p>

                <span className="tims-blog-archive-link" aria-disabled="true">
                  <span>Read More</span>
                  <ArrowIcon />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
