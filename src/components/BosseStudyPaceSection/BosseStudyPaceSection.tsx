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

export default function BosseStudyPaceSection() {
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
          <span className="tims-sslc-distance-eyebrow">Skill &amp; Open Schooling</span>
          <h2 className="tims-sslc-distance-title">
            Study at Your Pace &ndash; TIMS Education &amp; BOSSE Empower Every Learner
          </h2>

          <p className="tims-sslc-distance-text">
            At TIMS Education we believe learning should flex with your life, not hold you
            back. That&rsquo;s why we work closely with BOSSE (Board of Open Schooling &amp;
            Skill Education) to bring you real options through{" "}
            <Highlight>Open schooling and skill education</Highlight>. Whether you&rsquo;ve
            dropped out, are working full-time, or simply missed the classroom routine,{" "}
            <Highlight>Open schooling and skill education</Highlight> give you a second chance
            to complete your studies and build new skills.
          </p>

          <p className="tims-sslc-distance-text">
            With <Highlight>Open schooling and skill education</Highlight>, you get the freedom
            to study at your own pace, choose your subjects, and map out a path that suits you.
            We help students enrol, stay on track, and find confidence again through courses
            that combine academic levels with hands-on vocational learning. This approach
            makes education meaningful and relevant, especially through{" "}
            <Highlight>Open schooling and skill education</Highlight> designed for life today.
          </p>

          <p className="tims-sslc-distance-text">
            If you&rsquo;re ready to take control of your next step, this flexible and
            supportive route is waiting for you.
          </p>
        </div>
      </div>
    </section>
  );
}
