import Link from "next/link";
import "./tims-distance-section.css";

const highlights = [
  "Simple Admission Procedures",
  "Clear, Ongoing Support",
  "Experienced Mentors",
  "Reliable University Tie-ups",
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path
        d="M12 4 2 8.5 12 13l10-4.5L12 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M6 10.5v4.5c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20.5 9v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
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

export default function DistanceEducationSection() {
  return (
    <section className="tims-distance-section">
      <span className="tims-distance-blob" aria-hidden="true" />

      <div className="tims-distance-inner">
        <div className="tims-distance-media">
          <div className="tims-distance-image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/distance-education-student.jpg"
              alt="TIMS Education student"
              className="tims-distance-image"
            />
          </div>

          <div className="tims-distance-badge">
            <span className="tims-distance-badge-icon">
              <GraduationIcon />
            </span>
            <div>
              <p className="tims-distance-badge-value">15+ Years</p>
              <p className="tims-distance-badge-label">Guiding Students Forward</p>
            </div>
          </div>
        </div>

        <div className="tims-distance-content">
          <span className="tims-distance-label">Why Students Choose Us</span>
          <h2 className="tims-distance-heading">
            Best Distance Education Centre in Kerala &ndash; Building Futures with Flexible
            Learning
          </h2>

          <p className="tims-distance-text">
            TIMS Education has grown by helping students and working professionals complete
            their studies without disturbing their daily routine. Over the years, many
            learners have trusted us because they feel comfortable learning at their own pace
            with the right guidance beside them. That&rsquo;s one of the reasons people often
            call us the{" "}
            <strong className="tims-distance-highlight">
              best distance education centre in Kerala
            </strong>
            .
          </p>

          <p className="tims-distance-text">
            We focus on simple admission procedures, clear support, and courses that
            genuinely help in building a career. We try to make the process as easy as
            possible for people who want to finish a degree they dropped years ago or get a
            better job by getting a higher level of education.
          </p>

          <ul className="tims-distance-highlight-list">
            {highlights.map((item) => (
              <li key={item} className="tims-distance-highlight-chip">
                <span className="tims-distance-highlight-icon">
                  <CheckIcon />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Link href="#" className="tims-distance-cta">
            <span>Explore Programs</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
