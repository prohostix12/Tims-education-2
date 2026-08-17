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

function CertificateIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m8.5 12.5-1.2 6 4.7-2.3 4.7 2.3-1.2-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return <strong className="tims-admission-highlight">{children}</strong>;
}

type Item = {
  badge: ReactNode;
  title: string;
  text: ReactNode;
};

const items: Item[] = [
  {
    badge: "03",
    title: "Admission Stream 3 & 4 (NIOS On Demand Exam)",
    text: (
      <p className="tims-admission-card-text">
        This stream is only for students who failed in board exams of class 10th and 12th
        from CBSE board or any other recognized state board in India. If you have failed in a
        board exam, according to the rules you can appear again the next year from the same
        board &mdash; but every student&rsquo;s one precious year is lost, as they have to
        re-appear the next year for the same exam in all subjects, even if they passed 2 or
        more subjects. NIOS On Demand Exam is the way to{" "}
        <Highlight>save that precious year</Highlight>: a student who failed from any
        recognized board can appear in board exams of class 10th or 12th within the same year,
        only in the failed subjects. Under the{" "}
        <Highlight>credit transfer scheme of NIOS</Highlight>, subjects already passed are
        transferred to the NIOS board (maximum 2 subjects), so the student only needs to
        appear for the failed subjects within the same year.
      </p>
    ),
  },
  {
    badge: <CertificateIcon />,
    title: "Value of NIOS Board SSLC & Plus Two Certificates",
    text: (
      <div className="tims-admission-card-text">
        <p>
          NIOS is an <Highlight>autonomous board under the HR Ministry</Highlight>, Government
          of India. So the certificates issued for NIOS 10th standard or 12th standard exams
          are merited equal to Central Board of Secondary Education. All the states of India
          have recognized these certificates issued to Academia Study Center students.
        </p>
        <p>
          Those passing 10th class can join any school in India for 11th class. 12th class
          passed students can join any college or university in India or abroad for further
          studies in engineering, medical, computer science and other faculty courses opened
          up by Academia Study Center. They can also{" "}
          <Highlight>get employment in State and Central Government vacancies</Highlight>{" "}
          (PSC, UPSC), equal to other candidates of formal schooling.
        </p>
      </div>
    ),
  },
];

export default function CertificateValueSection() {
  return (
    <section className="tims-admission-section tims-admission-section--alt">
      <span className="tims-admission-blob" aria-hidden="true" />

      <div className="tims-admission-inner">
        <div className="tims-admission-header">
          <span className="tims-admission-label">On Demand Exam &amp; Certification</span>
          <h2 className="tims-admission-heading">More Admission Options, Recognized Value</h2>
          <p className="tims-admission-subtitle">
            A closer look at the On Demand Exam stream and how NIOS certificates are valued
            for further study and employment.
          </p>
        </div>

        <div className="tims-admission-grid">
          {items.map((item) => (
            <article className="tims-admission-card" key={item.title}>
              <div className="tims-admission-card-media">
                <span className="tims-admission-card-number">{item.badge}</span>
                <span className="tims-admission-card-media-icon">
                  <ImageIcon />
                </span>
                <span className="tims-admission-card-media-hint">Image coming soon</span>
              </div>

              <div className="tims-admission-card-body">
                <h3 className="tims-admission-card-title">{item.title}</h3>
                {item.text}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
