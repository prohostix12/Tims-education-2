import Link from "next/link";
import "./tims-find-section.css";

const pairings = [
  { course: "BA, MA, BCOM, MCOM", university: "Guru Kashi University", href: "#" },
  { course: "BBA, MBA", university: "Aligarh Muslim University (AMU)", href: "#" },
  { course: "BCA, MCA", university: "Mizoram University", href: "#" },
  { course: "BSC, MSC", university: "Swami Vivekanand Subharti University", href: "#" },
  { course: "10th / Plus Two", university: "Andhra University", href: "#" },
];

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M4 5.5c2.2-1 5-1.2 8 0 3-1.2 5.8-1 8 0v13c-2.2-1-5-1.2-8 0-3-1.2-5.8-1-8 0v-13Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 5.5v13" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="tims-find-uni-arrow"
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

export default function FindCourseSection() {
  return (
    <section className="tims-find-section">
      <div className="tims-find-inner">
        <h2 className="tims-find-heading">
          <span className="tims-find-heading-line">Find your perfect</span>
          <span className="tims-find-heading-line tims-find-heading-line--accent">
            Destination / Course / University
          </span>
        </h2>

        <div className="tims-find-layout">
          <div className="tims-find-table">
            <div className="tims-find-table-head">
              <span className="tims-find-table-head-cell">Popular Courses</span>
              <span className="tims-find-table-head-cell">
                Top <span className="tims-find-column-title-accent">Universities</span>
              </span>
            </div>

            {pairings.map((pair) => (
              <div key={pair.university} className="tims-find-row">
                <div className="tims-find-course-chip">
                  <span className="tims-find-course-chip-icon">
                    <BookIcon />
                  </span>
                  <span>{pair.course}</span>
                </div>

                <Link href={pair.href} className="tims-find-uni-link">
                  <ArrowIcon />
                  <span>{pair.university}</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="tims-find-image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/find-course-university.jpg"
              alt="Students exploring course and university options with an advisor"
              className="tims-find-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
