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

export default function DistanceEducationSection() {
  return (
    <section className="tims-distance-section">
      <div className="tims-distance-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/distance-education-student.jpg"
          alt="TIMS Education student"
          className="tims-distance-image"
        />
      </div>

      <div className="tims-distance-panel">
        <div className="tims-distance-panel-inner">
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
            better job by getting a higher level of education. Many who studied with us say
            they chose TIMS because it felt like the{" "}
            <strong className="tims-distance-highlight">
              best distance education centre in Kerala
            </strong>{" "}
            for their needs.
          </p>

          <p className="tims-distance-text">
            With experienced mentors and reliable university tie-ups, we continue to be the{" "}
            <strong className="tims-distance-highlight">
              best distance education centre in Kerala
            </strong>{" "}
            for learners who want steady progress. If you&rsquo;re planning your next step,
            you&rsquo;ll understand why so many consider us the{" "}
            <strong className="tims-distance-highlight">
              best distance education centre in Kerala
            </strong>
            .
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
        </div>
      </div>
    </section>
  );
}
