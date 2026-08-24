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

export default function BtechDistanceSection() {
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
          <span className="tims-career-eyebrow">Engineering Programs</span>
          <h2 className="tims-career-title">A Second Chance to Complete Your Engineering Degree</h2>

          <p className="tims-career-text">
            Many students and working professionals look for a way to complete their
            technical studies without stepping away from their jobs, and that&rsquo;s where{" "}
            <Highlight>distance B Tech in Kerala</Highlight> has become a useful option. It
            gives people the freedom to study engineering at their own pace, which is often
            the only practical way forward when life is already busy.
          </p>

          <p className="tims-career-text">
            At TIMS Education, we meet many learners who started their technical studies
            earlier but couldn&rsquo;t finish due to work or personal reasons. For them,{" "}
            <Highlight>distance B Tech in Kerala</Highlight> offers a second chance to
            continue their studies. We help them choose the right program, sort out the
            paperwork, and give a complete idea of the process to keep them stress-free.
          </p>

          <p className="tims-career-text">
            With the right support and easy study methods,{" "}
            <Highlight>distance B Tech in Kerala</Highlight> becomes manageable even for those
            returning to education after years. If you&rsquo;re thinking about upgrading your
            technical qualification, our guidance for{" "}
            <Highlight>distance B Tech in Kerala</Highlight> can give you a steady way to move
            forward.
          </p>
        </div>
      </div>
    </section>
  );
}
