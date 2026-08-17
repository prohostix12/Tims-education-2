import type { ReactNode } from "react";
import "./tims-admission-streams.css";

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
      <path
        d="M4 5.5c2.2-1 4.7-1.2 8 0v13c-3.3-1.2-5.8-1-8 0v-13Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M20 5.5c-2.2-1-4.7-1.2-8 0v13c3.3-1.2 5.8-1 8 0v-13Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GraduationCapIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
      <path d="M12 4 2 8.5 12 13l10-4.5L12 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 10.5v4.5c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20.5 9v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

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
  return <strong className="tims-admission-highlight">{children}</strong>;
}

type CourseLevel = {
  badge: ReactNode;
  title: string;
  text: ReactNode;
};

const levels: CourseLevel[] = [
  {
    badge: <BookIcon />,
    title: "SSLC (Secondary Course)",
    text: (
      <>
        Those who have completed <Highlight>14 years of age</Highlight> can apply &mdash;
        there is no upper age limit for this course. There are 13 subjects including multiple
        languages, of which every student selects 5: 2 compulsory languages and 3 free-choice
        subjects. Exams can be written either in <Highlight>English or Malayalam</Highlight>.
        Students who complete this course successfully are eligible to apply for both state
        and central government jobs.
      </>
    ),
  },
  {
    badge: <GraduationCapIcon />,
    title: "Plus Two (Senior Secondary Course)",
    text: (
      <>
        Designed for those who have passed SSLC and completed{" "}
        <Highlight>17 years of age</Highlight>. There are 17 subjects for the Plus Two
        examination, of which students choose 2 languages; apart from science subjects, the
        main exam can be written in Malayalam or English. Successful students become eligible
        for <Highlight>Engineering, Medical, IT and other professional courses</Highlight>,
        accepted by universities across the nation, and can apply for state and central
        government jobs including PSC and UPSC.
      </>
    ),
  },
];

export default function CourseLevelsSection() {
  return (
    <section className="tims-admission-section">
      <span className="tims-admission-blob" aria-hidden="true" />

      <div className="tims-admission-inner">
        <div className="tims-admission-header">
          <span className="tims-admission-label">Course Structure</span>
          <h2 className="tims-admission-heading">SSLC &amp; Plus Two at a Glance</h2>
          <p className="tims-admission-subtitle">
            Eligibility, subjects, and outcomes for both levels of the open schooling
            programme.
          </p>
        </div>

        <div className="tims-admission-grid">
          {levels.map((level) => (
            <article className="tims-admission-card" key={level.title}>
              <div className="tims-admission-card-media">
                <span className="tims-admission-card-number">{level.badge}</span>
                <span className="tims-admission-card-media-icon">
                  <ImageIcon />
                </span>
                <span className="tims-admission-card-media-hint">Image coming soon</span>
              </div>

              <div className="tims-admission-card-body">
                <h3 className="tims-admission-card-title">{level.title}</h3>
                <p className="tims-admission-card-text">{level.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
