import "./tims-svsu-hero.css";

export default function SvsuHeroSection() {
  return (
    <section className="tims-svsu-hero-section">
      <div className="tims-svsu-hero-inner">
        <div className="tims-svsu-hero-media">
          <img
            src="https://timseducation.com/wp-content/uploads/2024/11/9b27f4_4ccca71a72c64fcab86cd2078ee0fb01mv2.jpg"
            alt="Swami Vivekanand Subharti University Campus"
            className="tims-svsu-hero-img"
          />
        </div>

        <div className="tims-svsu-hero-caption">
          <h1 className="tims-svsu-hero-heading">Swami Vivekanand Subharti University</h1>
          <p className="tims-svsu-hero-affiliations">
            Affiliations: NCTE, DCI, AICTE, PCI, INC, MCI, IAP, BCI, UGC, AIU
          </p>
        </div>
      </div>
    </section>
  );
}
