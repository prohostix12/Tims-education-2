import "./tims-guru-kashi-section.css";

function UniversityIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path d="M12 4 2 8.5 12 13l10-4.5L12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 10.5v4.5c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function GradeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 3.5 5 7v6c0 4 2.9 6.5 7 8 4.1-1.5 7-4 7-8V7l-7-3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M2.5 12.5 6 9l3 2 2.5-2.5L14 11l-3 3-2-1.5-2 2M21.5 12.5 18 9l-3 2-2.5-2.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TimsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const logos = [
  { label: "Guru Kashi University", icon: UniversityIcon },
  { label: "NAAC A+ Grade", icon: GradeIcon },
  { label: "Affiliation", icon: HandshakeIcon },
  { label: "TIMS Education", icon: TimsIcon },
];

export default function GuruKashiSection() {
  return (
    <section className="tims-guru-kashi-section">
      <div className="tims-guru-kashi-inner">
        <div className="tims-guru-kashi-card">
          <div className="tims-guru-kashi-logos">
            {logos.map((logo) => (
              <div className="tims-guru-kashi-logo-placeholder" key={logo.label}>
                <span className="tims-guru-kashi-logo-icon" aria-hidden="true">
                  <logo.icon />
                </span>
                <span className="tims-guru-kashi-logo-label">{logo.label}</span>
              </div>
            ))}
          </div>

          <h1 className="tims-guru-kashi-heading">
            Proudly Affiliated
            <br />
            with Gurukashi University
          </h1>

          <div className="tims-guru-kashi-media">
            <span className="tims-guru-kashi-media-hint">Affiliation ceremony photo coming soon</span>
          </div>

          <div className="tims-guru-kashi-ribbon">Pride in Excellence</div>

          <div className="tims-guru-kashi-footer">
            <span className="tims-guru-kashi-director">
              <span className="tims-guru-kashi-director-name">Dr. Vikas Gupta</span>
              Director - Online Education
              <br />
              Guru Kashi University
            </span>

            <span className="tims-guru-kashi-ampersand" aria-hidden="true">
              &amp;
            </span>

            <span className="tims-guru-kashi-director">
              <span className="tims-guru-kashi-director-name">Ajinder Bansal</span>
              Director - Admission Cell
              <br />
              Guru Kashi University
            </span>
          </div>
        </div>

        <a
          href="https://gkuonline.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="tims-guru-kashi-cta"
        >
          <UniversityIcon />
          View Website
        </a>
      </div>
    </section>
  );
}
