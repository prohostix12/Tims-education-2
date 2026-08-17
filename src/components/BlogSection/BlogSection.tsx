import Link from "next/link";
import "./tims-blog-section.css";

type BlogPost = {
  slug: string;
  day: string;
  month: string;
  year: string;
  title: string;
  author: string;
  comments: number;
  image: string;
};

const posts: BlogPost[] = [
  {
    slug: "svsu-december-2025-results",
    day: "13",
    month: "Mar",
    year: "2026",
    title: "SVSU December 2025 Session Exam Results Published",
    author: "Tims",
    comments: 0,
    image: "/images/blog/svsu-results.jpg",
  },
  {
    slug: "best-distance-education-kerala",
    day: "08",
    month: "Jan",
    year: "2026",
    title: "Best Distance Education Institution in Kerala",
    author: "Tims",
    comments: 0,
    image: "/images/blog/best-distance-education-kerala.jpg",
  },
  {
    slug: "online-degree-vs-distance-degree",
    day: "08",
    month: "Jan",
    year: "2026",
    title: "Online Degree vs Distance Degree: Which One Is Better?",
    author: "Tims",
    comments: 0,
    image: "/images/blog/online-vs-distance-degree.jpg",
  },
];

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
      width="15"
      height="15"
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

export default function BlogSection() {
  return (
    <section className="tims-blog-section">
      <div className="tims-blog-inner">
        <div className="tims-blog-header">
          <span className="tims-blog-label">From the Blog</span>
          <h2 className="tims-blog-title">Latest news &amp; articles from the blog</h2>
        </div>

        <div className="tims-blog-grid">
          {posts.map((post) => (
            <article className="tims-blog-card" key={post.slug}>
              <Link href="#" className="tims-blog-card-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt={post.title} className="tims-blog-card-image" />
                <span className="tims-blog-card-scrim" aria-hidden="true" />

                <span className="tims-blog-card-date">
                  <span className="tims-blog-card-date-day">{post.day}</span>
                  <span className="tims-blog-card-date-month">
                    {post.month} {post.year}
                  </span>
                </span>

                <h3 className="tims-blog-card-title">{post.title}</h3>
              </Link>

              <div className="tims-blog-card-footer">
                <span className="tims-blog-card-meta">
                  <span className="tims-blog-card-author">{post.author}</span>
                  <span className="tims-blog-card-meta-divider" aria-hidden="true" />
                  <span className="tims-blog-card-comments">
                    <CommentIcon />
                    {post.comments} Comments
                  </span>
                </span>

                <Link href="#" className="tims-blog-card-link">
                  <span>Read More</span>
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
