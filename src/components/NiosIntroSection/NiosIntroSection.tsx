import "./tims-nios-intro.css";

function EmblemIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
      <path
        d="M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M4.5 12h15" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function NiosIntroSection() {
  return (
    <section className="tims-nios-intro-section">
      <div className="tims-nios-intro-inner">
        <p className="tims-nios-intro-text">
          The National Institute of Open Schooling (NIOS) is the board of education under the
          Union Government of India. It was established by the Ministry of Human Resource
          Development of the Government of India in 1989 to provide education to all segments
          of society under the motive to increase literacy and aimed forward for flexible
          learning. The NIOS is a national board that administers examinations for Secondary
          and Senior Secondary examinations similar to the CBSE and the CISCE. It also offers
          vocational courses after the high school.
        </p>

        <div className="tims-nios-intro-media">
          <div className="tims-nios-intro-media-placeholder">
            <EmblemIcon />
            <span className="tims-nios-intro-media-hint">NIOS logo coming soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}
