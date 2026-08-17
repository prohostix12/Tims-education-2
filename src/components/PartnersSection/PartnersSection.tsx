import "./tims-partners-section.css";

type Partner = {
  name: string;
  logo: string;
};

const partners: Partner[] = [
  { name: "Jamia Urdu Aligarh", logo: "/images/jua-logo.webp" },
  { name: "Board of Open Schooling & Skill Education", logo: "/images/bosse-logo.webp" },
  { name: "Swami Vivekanand Subharti University", logo: "/images/swami-logo.webp" },
  { name: "Andhra University", logo: "/images/andra-logo.webp" },
];

export default function PartnersSection() {
  const loopedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="tims-partners-section">
      <div className="tims-partners-inner">
        <div className="tims-partners-header">
          <span className="tims-partners-label">OUR AFFILIATIONS</span>
          <h2 className="tims-partners-title">Recognized Universities &amp; Boards</h2>
        </div>
      </div>

      <div className="tims-partners-marquee-wrap">
        <div className="tims-partners-marquee-track">
          {loopedPartners.map((partner, index) => (
            <div className="tims-partner-card" key={`${partner.name}-${index}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={partner.logo} alt={partner.name} className="tims-partner-logo" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
