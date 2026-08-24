import "./tims-mizoram-section.css";

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m4.5 17 4.8-5 3.4 3.6 2.4-2.6 4.4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MizoramSection() {
  return (
    <section className="tims-mizoram-section">
      <div className="tims-mizoram-inner">
        <div>
          <p className="tims-mizoram-text">
            Mizoram University is a central university under the University Grants
            Commission, Government of India, and was established on 2 July 2001, by the
            Mizoram University Act (2000) of the Parliament of India. The President of India
            is the official Visitor, and the Governor of Mizoram acts as the Chief Rector as
            per Mizoram University (Amendment) Bill, 2007.
          </p>

          <h2 className="tims-mizoram-subheading">University Achievements</h2>
          <p className="tims-mizoram-text" style={{ marginBottom: 0 }}>
            The university was ranked 67th among universities in India by the National
            Institutional Ranking Framework (NIRF) in 2020 and in the 100th overall.
            According to Outlook-ICARE rankings 2019 of top Central universities, Mizoram
            University ranked 12th overall.
          </p>
        </div>

        <div className="tims-mizoram-media">
          <div className="tims-mizoram-media-placeholder">
            <span className="tims-mizoram-media-icon">
              <ImageIcon />
            </span>
            <span className="tims-mizoram-media-hint">Image coming soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}
