import "../MizoramSection/tims-mizoram-section.css";

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
          <div
            style={{
              aspectRatio: "4 / 3",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              border: "1px solid #e5e7eb",
              borderRadius: "18px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/swami-logo.webp"
              alt="Swami Vivekanand Subharti University (SVSU) Emblem Logo"
              style={{
                maxWidth: "85%",
                maxHeight: "85%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
