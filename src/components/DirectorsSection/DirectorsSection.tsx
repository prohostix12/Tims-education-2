import "./tims-directors-section.css";

type Director = {
  name: string;
  role: string;
};

const directors: Director[] = [
  { name: "Adv ShoukathAli Pootheri", role: "Founder & Director, TIMS Education" },
  { name: "Nabeel CM", role: "Managing Director, TIMS Education" },
  { name: "Mohamed Shameem", role: "CEO & Director, TIMS Education" },
];

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.5 20c1.2-3.8 4.3-5.8 7.5-5.8s6.3 2 7.5 5.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DirectorsSection() {
  return (
    <section className="tims-directors-section">
      <span className="tims-directors-blob" aria-hidden="true" />

      <div className="tims-directors-inner">
        <div className="tims-directors-heading-wrap">
          <span className="tims-directors-label">Leadership</span>
          <h2 className="tims-directors-heading">Meet the Directors of TIMS Education</h2>
          <p className="tims-directors-subtitle">
            Guided by experienced leadership committed to helping every student find the
            right path forward.
          </p>
        </div>

        <div className="tims-directors-grid">
          {directors.map((director) => (
            <div className="tims-director-card" key={director.name}>
              <div className="tims-director-photo">
                <PersonIcon />
                <span className="tims-director-photo-hint">Photo coming soon</span>
              </div>
              <h3 className="tims-director-name">{director.name}</h3>
              <span className="tims-director-role">{director.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
