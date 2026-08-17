import "./tims-support-section.css";

const documents = [
  { title: "Gazette For NOS", file: "gazette-for-nos.pdf" },
  { title: "NCTE Recognition Order", file: "ncte-recognition-order.pdf" },
  { title: "NIOS Equivalence Letter", file: "nios-equivalence-letter.pdf" },
  { title: "NIOS in Gazette of India", file: "nios-in-gazette-of-india.pdf" },
  { title: "NIOS Recognition Certificate", file: "nios-recognition-certificate.pdf" },
  { title: "UGC Equivalence Order", file: "ugc-equivalence-order.pdf" },
  { title: "AICTE Approval Letter", file: "aicte-approval-letter.pdf" },
  { title: "State Govt Recognition Order", file: "state-government-recognition-order.pdf" },
];

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path
        d="M6.5 3.5h7l4 4v12.5a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-15.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M13.5 3.5V8h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.5 13h6M8.5 16h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function DownloadArrowIcon() {
  return (
    <svg
      className="tims-support-doc-arrow"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 4.5v11M7.5 11.5 12 16l4.5-4.5M5.5 19.5h13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TimsSupportSection() {
  return (
    <section className="tims-support-section">
      <div className="tims-support-inner">
        <span className="tims-support-eyebrow">Student Support</span>
        <h2 className="tims-support-heading">How You Are Helped by TIMS</h2>

        <div className="tims-support-intro">
          <p className="tims-support-text">
            Both SSLC and Plus Two can be done as correspondence courses &mdash; as a part-time
            course as well as a distance education course. Those who cannot attend regular
            classes can do home study. After course registration, expert educationalists
            design study materials for the five subjects you selected, which reach you through
            courier or can be collected directly from the respective centers. Our expert
            faculties offer coaching at our centers, and every Plus Two NIOS board student in
            all batches is provided with 24 contact classes on respective Sundays &mdash; the
            date of each contact class is informed in advance. TIMS provides sample papers
            designed by expert qualified teachers, and finally completes the course with
            practice of previous year question papers and test series for all subjects,
            helping students understand the usual questions asked in each subject. Those doing
            SSLC and Plus Two correspondence are also assisted by TIMS in preparing required
            assignments, records, and practical works.
          </p>
        </div>

        <h3 className="tims-support-docs-title">Verified Documents &amp; Recognitions</h3>
        <div className="tims-support-docs-grid">
          {documents.map((doc) => (
            <a
              key={doc.file}
              href={`/documents/${doc.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tims-support-doc"
            >
              <span className="tims-support-doc-icon">
                <DocumentIcon />
              </span>
              <span className="tims-support-doc-body">
                <span className="tims-support-doc-title">{doc.title}</span>
                <span className="tims-support-doc-meta">PDF Document</span>
              </span>
              <span className="tims-support-doc-action">
                <span>View PDF</span>
                <DownloadArrowIcon />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
