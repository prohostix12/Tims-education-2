import type { ReactNode } from "react";
import "../CareerAdvanceSection/tims-career-advance.css";

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
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

function Highlight({ children }: { children: ReactNode }) {
  return <strong className="tims-career-highlight">{children}</strong>;
}

export default function PgTrustedPathwaySection() {
  return (
    <section className="tims-career-section">
      <div className="tims-career-card">
        <div className="tims-career-media">
          <div className="tims-career-media-placeholder">
            <span className="tims-career-media-icon">
              <ImageIcon />
            </span>
            <span className="tims-career-media-hint">Image coming soon</span>
          </div>
          <span className="tims-career-media-badge">Guided, Flexible Learning</span>
        </div>

        <div>
          <span className="tims-career-eyebrow">Postgraduate Programs</span>
          <h2 className="tims-career-title">
            Your Trusted Pathway to Distance PG Courses in Kerala
          </h2>

          <p className="tims-career-text">
            A lot of students get to a point where they want to learn more or move up in
            their jobs, but they can&rsquo;t do it full-time. That&rsquo;s where{" "}
            <Highlight>distance PG courses</Highlight> become a practical option. They allow
            students to continue higher studies without stepping away from work or personal
            responsibilities. We see many people choose this path because they want growth,
            not pressure.
          </p>

          <p className="tims-career-text">
            At TIMS Education, we meet graduates who return years later, wanting to complete
            their master&rsquo;s degree but unsure of where to begin. For them,{" "}
            <Highlight>distance PG courses</Highlight> offer a comfortable and manageable way
            to study again. We guide them through admissions, help them choose the right
            program, and support them until the last exam.
          </p>

          <p className="tims-career-text">
            With flexible timetables and clear guidance, <Highlight>distance PG courses</Highlight>{" "}
            make postgraduate education accessible to anyone with the will to continue
            learning. If you&rsquo;re considering the next step in your academic journey, our{" "}
            <Highlight>distance PG courses</Highlight> provide a steady and supportive path
            forward.
          </p>
        </div>
      </div>
    </section>
  );
}
