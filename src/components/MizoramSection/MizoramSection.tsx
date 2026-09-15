import "./tims-mizoram-section.css";

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

        <div className="tims-mizoram-media" style={{ background: "#ffffff" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://mzu.edu.in/wp-content/uploads/2022/04/mzu-e1677230460556.jpg"
            alt="Mizoram University Campus"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}
