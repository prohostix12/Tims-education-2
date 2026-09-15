import "./tims-nios-intro.css";

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
          <div
            style={{
              width: "100%",
              maxWidth: "260px",
              aspectRatio: "4 / 3",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/NIOS.png"
              alt="National Institute of Open Schooling (NIOS) Logo"
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
