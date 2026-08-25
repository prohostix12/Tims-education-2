import "../MizoramSection/tims-mizoram-section.css";

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

export default function SgvuSection() {
  return (
    <section className="tims-mizoram-section">
      <div className="tims-mizoram-inner">
        <div>
          <p className="tims-mizoram-text">
            Suresh Gyan Vihar University (SGVU) is a not-for-profit autonomous private
            university located in Jaipur, Rajasthan, India. In 2017, the university became
            the first private university in Rajasthan to be awarded an &lsquo;A&rsquo; grade
            by National Assessment and Accreditation Council, out of the 22 NAAC accredited
            universities in Rajasthan. The University was established through the Suresh
            Gyan Vihar University, Jaipur Act (Act no. 16 of 2008) of the Government of
            Rajasthan. Its predecessor institution, Gyan Vihar College, Jaipur, had been in
            existence since 1999. Its parent institution Sahitya Sadawart Samiti was founded
            in 1938.
          </p>

          <h2 className="tims-mizoram-subheading">University Achievements</h2>
          <p className="tims-mizoram-text" style={{ marginBottom: 0 }}>
            In 2017, the university was awarded an &lsquo;A&rsquo; grade by National
            Assessment and Accreditation Council (NAAC). It was the first private university
            in Jaipur to receive accreditation from National Board of Accreditation (NBA).
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
