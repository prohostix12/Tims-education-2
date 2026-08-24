import "../BtechMtechSection/tims-btech-section.css";
import "../AmuSection/tims-amu-section.css";

export default function AmuStickyNotesSection() {
  return (
    <section className="tims-amu-section">
      <div className="tims-amu-inner">
        <div className="tims-btech-row">
          <div className="tims-btech-sticky tims-btech-sticky--yellow">
            <span className="tims-btech-sticky-pin" aria-hidden="true" />
            <h2 className="tims-btech-card-title">Affiliations</h2>
            <p className="tims-btech-text">UGC, NAAC, AIU, NIRF Listed.</p>
          </div>

          <div className="tims-btech-sticky tims-btech-sticky--cyan">
            <span className="tims-btech-sticky-pin" aria-hidden="true" />
            <h2 className="tims-btech-card-title">University Achievements</h2>
            <p className="tims-btech-text">
              NCTE and BCI. UGC and NAAC peer teams were also inspected in June 2017.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
