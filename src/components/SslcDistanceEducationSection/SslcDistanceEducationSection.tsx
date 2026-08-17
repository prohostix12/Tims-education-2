import type { ReactNode } from "react";
import "./tims-sslc-distance.css";

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

export default function SslcDistanceEducationSection() {
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
          <span className="tims-sslc-distance-eyebrow">Second Chance Learning</span>
          <h2 className="tims-sslc-distance-title">
            SSLC Distance Education &ndash; A Second Chance to Complete Your Studies
          </h2>

          <p className="tims-sslc-distance-text">
            For many people, completing SSLC or Plus Two is something they wanted to do
            earlier but couldn&rsquo;t. That&rsquo;s why we offer a flexible option through{" "}
            <Highlight>SSLC distance education</Highlight>, so students can continue their
            studies without leaving their work or daily routine behind. This method works well
            for people who just need the right help and direction to move forward.
          </p>

          <p className="tims-sslc-distance-text">
            Students who choose <Highlight>SSLC distance education</Highlight> often do it to
            improve their career chances or to qualify for higher studies. We try to keep the
            entire process simple, from admission to exam preparation, so no one feels lost
            along the way. With regular guidance and easy-to-follow study materials,{" "}
            <Highlight>SSLC distance education</Highlight> becomes a comfortable choice even
            for those who wish to study after years.
          </p>

          <p className="tims-sslc-distance-text">
            If you&rsquo;re planning to complete this stage of your education, our{" "}
            <Highlight>SSLC distance education</Highlight> program gives you a steady and
            supportive path to reach your goal.
          </p>
        </div>
      </div>
    </section>
  );
}
