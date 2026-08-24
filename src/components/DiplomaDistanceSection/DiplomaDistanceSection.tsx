import type { ReactNode } from "react";
import "../SslcDistanceEducationSection/tims-sslc-distance.css";

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
  return <strong className="tims-sslc-distance-highlight">{children}</strong>;
}

export default function DiplomaDistanceSection() {
  return (
    <section className="tims-sslc-distance-section">
      <div className="tims-sslc-distance-inner">
        <div className="tims-sslc-distance-media">
          <div className="tims-sslc-distance-media-placeholder">
            <span className="tims-sslc-distance-media-icon">
              <ImageIcon />
            </span>
            <span className="tims-sslc-distance-media-hint">Image coming soon</span>
          </div>
        </div>

        <div>
          <span className="tims-sslc-distance-eyebrow">Skill Development</span>
          <h2 className="tims-sslc-distance-title">
            Advance Your Skills with Distance Diploma Courses in Kerala
          </h2>

          <p className="tims-sslc-distance-text">
            Many students and working individuals look for short, practical qualifications
            that can help them build skills quickly. This makes{" "}
            <Highlight>distance diploma courses in Kerala</Highlight> have become a popular
            choice. The course allows them to continue their studies without disrupting their
            job or family routine.
          </p>

          <p className="tims-sslc-distance-text">
            At TIMS Education, we often meet people who want to improve their career prospects
            but don&rsquo;t have the time for regular classroom programs. For them,{" "}
            <Highlight>distance diploma courses in Kerala</Highlight> are a convenient way to
            learn quickly and easily while still working toward a qualification that is
            recognized. We guide students through the admission steps, help them choose the
            right field, and stay with them until they complete the course.
          </p>

          <p className="tims-sslc-distance-text">
            With simple study materials and steady assistance,{" "}
            <Highlight>distance diploma courses in Kerala</Highlight> become much easier to
            manage, even for those returning to studies after a long break. If you&rsquo;re
            planning for doing <Highlight>distance diploma courses in Kerala</Highlight>, we
            will give you a clear and supportive path forward.
          </p>
        </div>
      </div>
    </section>
  );
}
