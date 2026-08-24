import "./tims-amu-section.css";

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true">
      <path
        d="M6 20.5V9.5l6-4.5 6 4.5v11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M3.5 20.5h17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.5 20.5v-6h5v6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="12" cy="10.5" r="1.4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function RankIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M12 3.5c.6 3.3 2.4 5.1 5.7 5.7-3.3.6-5.1 2.4-5.7 5.7-.6-3.3-2.4-5.1-5.7-5.7 3.3-.6 5.1-2.4 5.7-5.7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AccreditIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M12 3.5 5 7v6c0 4 2.9 6.5 7 8 4.1-1.5 7-4 7-8V7l-7-3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CdoeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="12" rx="1.8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 20.5h7M12 16.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AmuSection() {
  return (
    <section className="tims-amu-section">
      <div className="tims-amu-inner">
        <h1 className="tims-amu-heading">Aligarh Muslim University (AMU): Shaping Futures, Empowering Minds</h1>

        <div className="tims-amu-card">
          <div className="tims-amu-content">
            <div>
              <p className="tims-amu-text">
                Aligarh Muslim University (AMU) occupies a unique position amongst
                universities and institutions of higher learning in the country. It was
                established in 1920 and evolved out of the Mohammedan Anglo-Oriental (MAO)
                which was set up on 7 January 1877 by the great visionary and social reformer,
                Sir Syed Ahmad Khan. From its very inception, it has kept its door open to the
                members of all communities and from all corners of the country and the world.
                The Aligarh Muslim University realized a vision that was broad, far-reaching,
                and realistic.
              </p>

              <p className="tims-amu-text">
                Spread over 467.6 hectares in the city of Aligarh, Uttar Pradesh, Aligarh
                Muslim University offers more than 300 courses in the traditional and modern
                branches of education. It draws students from all states in India and from
                different countries, especially Africa, West Asia, and Southeast Asia. In some
                courses, seats are reserved for students from SAARC and Commonwealth
                Countries. The University is open to all irrespective of caste, creed,
                religion or gender. It ranks 8th among the top 20 research universities in
                India.
              </p>
            </div>

            <div className="tims-amu-media">
              <div className="tims-amu-media-placeholder">
                <BuildingIcon />
                <span className="tims-amu-media-hint">AMU campus image coming soon</span>
              </div>

              <div className="tims-amu-badges">
                <span className="tims-amu-badge" aria-hidden="true">
                  <RankIcon />
                </span>
                <div className="tims-amu-badge-text">
                  <span className="tims-amu-badge-title">10th Rank</span>
                  <span className="tims-amu-badge-subtitle">NIRF 2021</span>
                </div>

                <span className="tims-amu-badge" aria-hidden="true">
                  <AccreditIcon />
                </span>
                <div className="tims-amu-badge-text">
                  <span className="tims-amu-badge-title">NAAC</span>
                  <span className="tims-amu-badge-subtitle">A+ Grade</span>
                </div>

                <span className="tims-amu-badge" aria-hidden="true">
                  <CdoeIcon />
                </span>
                <div className="tims-amu-badge-text">
                  <span className="tims-amu-badge-title">Centre for Distance and Online Education</span>
                  <span className="tims-amu-badge-subtitle">Aligarh Muslim University</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
