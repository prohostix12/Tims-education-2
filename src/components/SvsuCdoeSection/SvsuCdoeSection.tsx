import "./tims-svsu-cdoe.css";

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
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

export default function SvsuCdoeSection() {
  return (
    <section className="tims-svsu-cdoe-section">
      <div className="tims-svsu-cdoe-inner">
        <div className="tims-svsu-cdoe-card">
          <h2 className="tims-svsu-cdoe-title">The Center for Distance and Online Education (CDOE)</h2>

          <p className="tims-svsu-cdoe-text">
            In exercise of the powers vested under section 7 (b) of the Act, Swami Vivekanand
            Subharti University has established the Directorate of Distance Education to help
            those who want to pursue higher studies, but are unable to do so through regular
            mode of education due to job constraints, family commitments or remoteness of
            location. The Distance Education Council of Government of India has accorded
            recognition to the University for offering programmes through distance education
            mode also vide letter no. DEC/Recog/2009/3174 dated 09.09.2009, on the
            recommendation of the Joint Committee of the University Grants Commission.
          </p>

          <div className="tims-svsu-cdoe-gallery">
            {[1, 2, 3].map((item) => (
              <div className="tims-svsu-cdoe-gallery-item" key={item}>
                <span className="tims-svsu-cdoe-gallery-hint">Image coming soon</span>
              </div>
            ))}
          </div>

          <a
            href="/documents/svsu-brochure.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="tims-svsu-cdoe-download"
          >
            <DownloadIcon />
            Download Brochure
          </a>
        </div>
      </div>
    </section>
  );
}
