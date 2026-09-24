import "../MizoramSection/tims-mizoram-section.css";

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

        <div className="tims-mizoram-media" style={{ background: "#ffffff", width: "100%", minHeight: "380px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.gyanvihar.org/media-library/uploads/158331894266081.jpg"
            alt="Suresh Gyan Vihar University Campus"
            style={{ width: "100%", height: "100%", minHeight: "380px", maxHeight: "500px", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}
