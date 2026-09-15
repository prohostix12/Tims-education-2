import "../JamiaUrduSection/tims-jamia-urdu-section.css";

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
              <div
                style={{
                  width: "100%",
                  maxWidth: "280px",
                  aspectRatio: "4 / 3",
                  borderRadius: "16px",
                  border: "1px solid #e5e7eb",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.75rem",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/bosse-logo.webp"
                  alt="Board of Open Schooling & Skill Education (BOSSE) Logo"
                  style={{
                    maxWidth: "90%",
                    maxHeight: "90%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
