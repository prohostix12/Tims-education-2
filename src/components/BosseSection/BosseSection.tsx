import "../JamiaUrduSection/tims-jamia-urdu-section.css";

function EmblemIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 15v-3c0-2.2 1.8-4 4-4s4 1.8 4 4v3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M8 15h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function BosseSection() {
  return (
    <section className="tims-jamia-urdu-section">
      <div className="tims-jamia-urdu-inner">
        <div className="tims-jamia-urdu-header">
          <span className="tims-jamia-urdu-label">University Partner</span>
          <h1 className="tims-jamia-urdu-heading">Board of Open Schooling and Skill Education</h1>
        </div>

        <div className="tims-jamia-urdu-card">
          <div className="tims-jamia-urdu-content">
            <div>
              <h2 className="tims-jamia-urdu-heading" style={{ fontSize: "1.375rem", marginBottom: "1rem" }}>
                Board of Open Schooling and Skill Education: Nurturing Skills, Unlocking
                Opportunities
              </h2>

              <p className="tims-jamia-urdu-text">
                Welcome to the Board of Open Schooling and Skill Education (BOSSE), an
                institution committed to promoting skill development and providing accessible
                education. Established with a vision to empower individuals with both
                traditional education and essential life skills, BOSSE has become a catalyst
                for change and progress. At TIMS Education, we acknowledge and celebrate the
                transformative impact of skill education through BOSSE.
              </p>
            </div>

            <div className="tims-jamia-urdu-media">
              <div className="tims-jamia-urdu-media-placeholder">
                <EmblemIcon />
                <span className="tims-jamia-urdu-media-hint">BOSSE logo coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
