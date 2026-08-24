import "../MizoramSection/tims-mizoram-section.css";

function EmblemIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 8.5h6v3a3 3 0 0 1-3 3 3 3 0 0 1-3-3v-3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M12 14.5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export default function SvsuAboutSection() {
  return (
    <section className="tims-mizoram-section">
      <div className="tims-mizoram-inner">
        <div>
          <h2 className="tims-mizoram-subheading" style={{ fontSize: "1.375rem" }}>
            Swami Vivekanand Subharti University (SVSU): Nurturing Excellence, Fostering
            Growth
          </h2>
          <p className="tims-mizoram-text">
            Welcome to Swami Vivekanand Subharti University (SVSU), a renowned institution
            committed to providing quality education, research, and holistic development.
            Established in 2008, SVSU is dedicated to empowering students with the knowledge
            and skills needed to excel in a competitive world.
          </p>
          <p className="tims-mizoram-text" style={{ marginBottom: 0 }}>
            Swami Vivekanand Subharti University, situated in Meerut, Uttar Pradesh, India, is
            a private university known for its commitment to providing education across
            diverse disciplines. The university&rsquo;s foundation is built on the principles
            of academic integrity, social responsibility, and inclusivity.
          </p>
        </div>

        <div className="tims-mizoram-media">
          <div className="tims-mizoram-media-placeholder">
            <span className="tims-mizoram-media-icon">
              <EmblemIcon />
            </span>
            <span className="tims-mizoram-media-hint">SVSU emblem coming soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}
