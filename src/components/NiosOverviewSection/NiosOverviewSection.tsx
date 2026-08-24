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

export default function NiosOverviewSection() {
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
          <span className="tims-sslc-distance-eyebrow">Open Schooling</span>
          <h2 className="tims-sslc-distance-title">
            National Institute of Open Schooling (NIOS): A Flexible Pathway to Quality
            Education
          </h2>

          <p className="tims-sslc-distance-text">
            The <Highlight>National Institute of Open Schooling</Highlight> (NIOS) is the
            board of education under the Union Government of India. This was created to give
            students a flexible and accessible way to complete their education, especially
            those who cannot follow the traditional school system. Formed by the Government of
            India in 1989, the <Highlight>National Institute of Open Schooling</Highlight>{" "}
            supports learners from different backgrounds by offering a second chance to finish
            their Secondary or Senior Secondary studies. Many students choose this board
            because it allows them to study at their own pace, which is a huge advantage for
            working individuals, young parents, or those who had to pause their education for
            personal reasons.
          </p>

          <p className="tims-sslc-distance-text">
            Along with school-level programs, the{" "}
            <Highlight>National Institute of Open Schooling</Highlight> also provides a variety
            of vocational courses that help students build practical skills after high school.
            Over the years, the <Highlight>National Institute of Open Schooling</Highlight> has
            become a trusted option for learners who want a recognised qualification.
          </p>
        </div>
      </div>
    </section>
  );
}
