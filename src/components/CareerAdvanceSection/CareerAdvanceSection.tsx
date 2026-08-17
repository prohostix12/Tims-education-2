import type { ReactNode } from "react";
import "./tims-career-advance.css";

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

export default function CareerAdvanceSection() {
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
          <span className="tims-career-eyebrow">Distance Degree Programs</span>
          <h2 className="tims-career-title">
            Advance Your Career with Distance Degree Courses in Kerala
          </h2>

          <p className="tims-career-text">
            A lot of students and working people find a way to continue their studies without
            leaving their jobs or family duties. That&rsquo;s why{" "}
            <Highlight>distance degree courses in Kerala</Highlight> are such a good option.
            They help students study at their own pace while still making progress in their
            jobs. At TIMS Education, we try to make things as clear and supportive as possible,
            especially for those returning to studies after a long gap.
          </p>

          <p className="tims-career-text">
            Most people who join <Highlight>distance degree courses in Kerala</Highlight> aim
            for a qualification that genuinely helps them grow. We guide students through the
            admission process, help them choose the right program, and stay with them until
            they complete their course. With flexible study materials and steady support,{" "}
            <Highlight>distance degree courses in Kerala</Highlight> become much easier to
            manage.
          </p>

          <p className="tims-career-text">
            If you&rsquo;re planning the next step in your education, our{" "}
            <Highlight>distance degree courses in Kerala</Highlight> can help you reach your
            goals.
          </p>
        </div>
      </div>
    </section>
  );
}
