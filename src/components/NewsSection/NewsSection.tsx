import Link from "next/link";
import "./tims-news-section.css";

type NewsItem = {
  slug: string;
  day: string;
  month: string;
  year: string;
  tag: string;
  title: string;
  excerpt: string;
};

const newsItems: NewsItem[] = [
  {
    slug: "admissions-2026-open",
    day: "02",
    month: "Feb",
    year: "2026",
    tag: "Admissions",
    title: "TIMS Education Announces New Admission Batch for 2026",
    excerpt:
      "Applications are now open for the upcoming academic session across distance, online, and skill-based programs. Free counselling slots are available for interested students.",
  },
  {
    slug: "convocation-ceremony-2026",
    day: "28",
    month: "Jan",
    year: "2026",
    tag: "Events",
    title: "Annual Convocation Ceremony & Graduation Day Announced",
    excerpt:
      "The annual graduation day ceremony for completed degree and postgraduate batches will take place next month. Registered students can collect their admit passes.",
  },
  {
    slug: "svsu-december-2025-results",
    day: "13",
    month: "Jan",
    year: "2026",
    tag: "Results",
    title: "SVSU Examination Session Results Published",
    excerpt:
      "Results for the recent examination session are now available online. Students can check their scorecards or contact student support for marklist delivery.",
  },
  {
    slug: "new-ugc-online-mba",
    day: "08",
    month: "Jan",
    year: "2026",
    tag: "Courses",
    title: "New UGC-Approved Online MBA Program Added",
    excerpt:
      "TIMS Education has partnered with leading UGC-approved universities to launch online MBA specialisations in Finance, Marketing, HR, and Operations.",
  },
  {
    slug: "university-tie-ups-expansion",
    day: "22",
    month: "Dec",
    year: "2025",
    tag: "Partnerships",
    title: "TIMS Education Expands Partner University Tie-ups Across Kerala",
    excerpt:
      "New university affiliations provide students more flexibility in choosing recognised degree, diploma, and postgraduate programs close to home.",
  },
  {
    slug: "scholarship-applications-open",
    day: "10",
    month: "Dec",
    year: "2025",
    tag: "Scholarships",
    title: "Merit Scholarship Applications Open for Distance Education Students",
    excerpt:
      "Eligible students pursuing distance and online degree programs can now apply for merit scholarship waivers for the upcoming term.",
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
          <h1 className="tims-news-heading">News &amp; Events from TIMS Education</h1>
          <p className="tims-news-subtitle">
            Announcements, examination results, convocation schedules, and updates from across our university partnerships.
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
                <Link href="/contact" className="tims-news-link">
                  <span>Enquire Now</span>
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
