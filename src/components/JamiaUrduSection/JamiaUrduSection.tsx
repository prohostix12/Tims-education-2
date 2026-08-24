import "./tims-jamia-urdu-section.css";

function EmblemIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true">
      <path
        d="M12 3.5 5.5 8v6c0 4 2.8 6.6 6.5 8 3.7-1.4 6.5-4 6.5-8V8L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.5" r="2.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M6.5 3.5h7l4 4v12.5a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-15.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M13.5 3.5V8h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

const documents = [
  { title: "Download Prospects", file: "jamia-urdu-aligarh-prospects.pdf" },
  { title: "University Recognition Letters", file: "jamia-urdu-aligarh-recognition-letters.pdf" },
];

export default function JamiaUrduSection() {
  return (
    <section className="tims-jamia-urdu-section">
      <div className="tims-jamia-urdu-inner">
        <div className="tims-jamia-urdu-header">
          <span className="tims-jamia-urdu-label">University Partner</span>
          <h1 className="tims-jamia-urdu-heading">
            Jamia Urdu Aligarh: Pioneering Urdu Education and Culture
          </h1>
        </div>

        <div className="tims-jamia-urdu-card">
          <div className="tims-jamia-urdu-content">
            <div>
              <span className="tims-jamia-urdu-badge">
                <span className="tims-jamia-urdu-badge-dot" aria-hidden="true" />
                Affiliations: COBSE Approved
              </span>

              <p className="tims-jamia-urdu-text">
                Welcome to the world of Jamia Urdu Aligarh, an institution deeply rooted in the
                rich tapestry of Urdu language, literature, and culture. Established to promote
                and preserve the essence of Urdu, Jamia Urdu Aligarh has been a beacon of
                education, heritage, and linguistic excellence. At TIMS Education, we proudly
                acknowledge and promote the significance of Urdu language and education through
                Jamia Urdu Aligarh.
              </p>

              <p className="tims-jamia-urdu-text">
                Jamia Urdu Aligarh is a pioneer educational institution of India recognised by
                the National Commission for Minority Education Institution (NCMEI), imparting
                education amongst all since the year 1939 to the most deprived sections of
                society, particularly Urdu speaking, through around 800 information centers
                around the world.
              </p>

              <p className="tims-jamia-urdu-text">
                Jamia Urdu Aligarh is imparting education to the sections of Indian citizenry
                which cannot afford costly education and is working hard to empower them so
                that they can come into the mainstream and also become a part of the
                development of the nation.
              </p>

              <p className="tims-jamia-urdu-text">
                Jamia Urdu Aligarh has the most updated and modern curriculum presently and
                moreover has a perfect examination system with transparent monitoring. The
                courses offered by Jamia Urdu Aligarh follow the guidelines of the Government
                of India.
              </p>

              <p className="tims-jamia-urdu-text">
                Several Government bodies, Boards, Universities, and Institutions have
                recognised the courses of Jamia Urdu Aligarh and consider them equivalent to
                certificates of their respective state boards.
              </p>
            </div>

            <div className="tims-jamia-urdu-media">
              <div className="tims-jamia-urdu-media-placeholder">
                <EmblemIcon />
                <span className="tims-jamia-urdu-media-hint">Jamia Urdu Aligarh emblem coming soon</span>
              </div>
            </div>
          </div>
        </div>

        <p className="tims-jamia-urdu-note">
          The courses of Jamia Urdu Aligarh are recognised by the Government of India, by the
          office Memorandum No. 14021/2/78-Estt. (D) dated 28 June 1978 of the Ministry of Home
          Affairs / Home Ministry (Department of Personnel and Administrative Reforms).
        </p>

        <div className="tims-jamia-urdu-docs">
          {documents.map((doc) => (
            <a
              key={doc.file}
              href={`/documents/${doc.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tims-jamia-urdu-doc"
            >
              <span className="tims-jamia-urdu-doc-icon">
                <DocumentIcon />
              </span>
              <span className="tims-jamia-urdu-doc-title">{doc.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
