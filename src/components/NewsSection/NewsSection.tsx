/*
import Link from "next/link";
import "./tims-news-section.css";

type NewsItem = {
  slug: string;
  day: string;
  month: string;
  tag: string;
  title: string;
  excerpt: string;
};

const newsItems: NewsItem[] = [
  {
    slug: "admissions-2026-open",
    day: "02",
    month: "Feb",
    tag: "Admissions",
    title: "TIMS Education Announces New Admission Batch for 2026",
    excerpt:
      "Applications are now open for the upcoming academic session across distance, online, and skill-based programs. Counselling slots are available for interested students.",
  },
  {
    slug: "svsu-december-2025-results",
    day: "13",
    month: "Mar",
    tag: "Results",
    title: "SVSU December 2025 Session Exam Results Published",
    excerpt:
      "Results for the December 2025 examination session are now available. Students can check their scores and connect with their assigned mentor for guidance on next steps.",
  },
  {
    slug: "new-ugc-online-mba",
    day: "20",
    month: "Jan",
    tag: "Courses",
    title: "New UGC-Approved Online MBA Program Added",
    excerpt:
      "TIMS Education has partnered with a UGC-approved university to launch a new online MBA program with specialisations in Finance, Marketing, and Human Resources.",
  },
  {
    slug: "university-tie-ups-expansion",
    day: "05",
    month: "Jan",
    tag: "Partnerships",
    title: "TIMS Education Expands University Tie-ups Across Kerala",
    excerpt:
      "New partnerships have been formed with reputed universities, giving students more flexibility in choosing recognised degree and postgraduate programs close to home.",
  },
  {
    slug: "scholarship-applications-open",
    day: "18",
    month: "Dec",
    tag: "Scholarships",
    title: "Scholarship Applications Open for Distance Education Students",
    excerpt:
      "Eligible students pursuing distance and online degree programs can now apply for merit-based scholarships. Applications close at the end of the month.",
  },
];

function ArrowIcon() {
  return (
    <svg
      className="tims-news-link-arrow"
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

export default function NewsSection() {
  return (
    <section className="tims-news-section">
      <div className="tims-news-inner">
        <div className="tims-news-header">
          <span className="tims-news-label">Latest Updates</span>
          <h1 className="tims-news-heading">News from TIMS Education</h1>
          <p className="tims-news-subtitle">
            Announcements, results, and updates from across our courses and university
            partnerships.
          </p>
        </div>

        <div className="tims-news-list">
          {newsItems.map((item) => (
            <article className="tims-news-item" key={item.slug}>
              <div className="tims-news-date">
                <span className="tims-news-date-day">{item.day}</span>
                <span className="tims-news-date-month">{item.month}</span>
              </div>

              <div className="tims-news-content">
                <span className="tims-news-tag">{item.tag}</span>
                <h2 className="tims-news-title">{item.title}</h2>
                <p className="tims-news-excerpt">{item.excerpt}</p>
                <Link href="#" className="tims-news-link">
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
*/

export default function NewsSection() {
  return null;
}
