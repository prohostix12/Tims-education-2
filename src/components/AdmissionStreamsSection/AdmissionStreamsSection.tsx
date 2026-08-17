import type { ReactNode } from "react";
import "./tims-admission-streams.css";

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

type Stream = {
  number: string;
  title: string;
  text: ReactNode;
};

const streams: Stream[] = [
  {
    number: "01",
    title: "Admission Stream 1: For SSLC & Plus Two",
    text: (
      <>
        If you were a regular school student failed in class 9th then you take direct
        admission from class 10th from NIOS board and if you are a student failed in class
        11th then you have an option for <Highlight>direct admission in class 12th</Highlight>.
        This stream is also for the students who have passed 10th. If you want to take
        admission, contact us immediately &mdash; our counsellors will help you in your
        admission procedure and classes for board exam preparation.
      </>
    ),
  },
  {
    number: "02",
    title: "Admission Stream 2: For SSLC & Plus Two",
    text: (
      <>
        This stream is only for students who failed in board exams of class 10th and 12th
        from CBSE board or any other recognized state board in India. Normally, a failed
        student loses one full year re-appearing for every subject. NIOS Admission Stream 2
        is the way to <Highlight>save that precious year</Highlight>: a student can appear in
        board exams of class 10th or 12th within the same year, only in the failed subjects.
        Under the <Highlight>credit transfer scheme of NIOS</Highlight>, subjects already
        passed are transferred (maximum 2 subjects), so the student only re-appears for the
        failed ones.
      </>
    ),
  },
];

export default function AdmissionStreamsSection() {
  return (
    <section className="tims-admission-section">
      <span className="tims-admission-blob" aria-hidden="true" />

      <div className="tims-admission-inner">
        <div className="tims-admission-header">
          <span className="tims-admission-label">Admissions</span>
          <h2 className="tims-admission-heading">Two Ways to Get Admitted</h2>
          <p className="tims-admission-subtitle">
            Choose the admission stream that matches your situation &mdash; whether
            you&rsquo;re starting fresh or need to save a year lost to a failed board exam.
          </p>
        </div>

        <div className="tims-admission-grid">
          {streams.map((stream) => (
            <article className="tims-admission-card" key={stream.number}>
              <div className="tims-admission-card-media">
                <span className="tims-admission-card-number">{stream.number}</span>
                <span className="tims-admission-card-media-icon">
                  <ImageIcon />
                </span>
                <span className="tims-admission-card-media-hint">Image coming soon</span>
              </div>

              <div className="tims-admission-card-body">
                <h3 className="tims-admission-card-title">{stream.title}</h3>
                <p className="tims-admission-card-text">{stream.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
