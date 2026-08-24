import type { ReactNode } from "react";
import "./tims-attestation-section.css";

const countries = ["Bahrain", "Kuwait", "Oman", "Qatar", "United Arab Emirates (UAE)"];

const certificates = [
  "10th Certificate Attestation",
  "AMIE Certificate Attestation",
  "Apprentice ship Certificate Attestation",
  "B.Com Certificate Attestation",
  "B.Ed Certificate Attestation",
  "B.Sc Nursing Certificate Attestation",
  "B.Tech Certificate Attestation",
  "BA Certificate Attestation",
  "BBA Certificate Attestation",
  "BCA Certificate Attestation",
  "BDS Certificate Attestation",
  "BE Certificate Attestation",
  "Birth Certificate Attestation",
  "Bonafied Certificate Attestation",
  "B.Sc Certificate Attestation",
  "CA Certificate Attestation",
  "CBSE Certificate Attestation",
  "Computer Diploma Certificate Attestation",
  "Course and Conduct Certificate Attestation",
  "Course Completion Certificate Attestation",
  "Death Certificate Attestation",
  "Divorce Certificate Attestation",
  "Engineering Diploma Certificate Attestation",
  "Foreign Certificate Attestation",
  "Heirship Certificate Attestation",
  "High School Certificate Attestation",
  "House Surgeon Certificate Attestation",
  "HSE Certificate Attestation",
  "Intermediate Certificate Attestation",
  "Internship Certificate Attestation",
  "ITI Certificate Attestation",
  "M.Tech Certificate Attestation",
  "M.Com Certificate Attestation",
  "M.Ed Certificate Attestation",
  "M.Sc Certificate Attestation",
  "M.Sc Nursing Certificate Attestation",
  "MA Certificate Attestation",
  "Marriage Certificate Attestation",
  "MBA Certificate Attestation",
  "MBBS Certificate Attestation",
  "MCA Certificate Attestation",
  "ME Certificate Attestation",
  "Medical Certificate Attestation",
  "Metric Certificate Attestation",
  "Migration Certificate Attestation",
  "MS Certificate Attestation",
  "NTC Certificate Attestation",
  "Nursing Diploma Certificate Attestation",
  "PCC Certificate Attestation",
  "PDC Certificate Attestation",
  "Plus Two Certificate Attestation",
  "Power of Attorney Certificate Attestation",
  "Private Diploma Certificate Attestation",
  "PUC Certificate Attestation",
  "SSC Certificate Attestation",
  "SSLC Certificate Attestation",
  "Technicians Certificate Attestation",
  "Training Certificate Attestation",
  "Transfer Certificate Attestation",
  "Translated Certificate Attestation",
  "TTC Certificate Attestation",
  "VHSE Certificate Attestation",
];

export default function AttestationSection() {
  return (
    <section className="tims-attestation-section">
      <div className="tims-attestation-inner">
        <div className="tims-attestation-header">
          <span className="tims-attestation-rule" aria-hidden="true" />
          <span className="tims-attestation-label">Our Services</span>
          <h1 className="tims-attestation-heading">Certificate Attestation Services</h1>
        </div>

        <div className="tims-attestation-card">
          <p className="tims-attestation-text">
            If you are planning to go abroad for higher education, employment, business or
            migration, we can take care of your <Highlight>certificate attestation</Highlight>{" "}
            formalities.
          </p>

          <div className="tims-attestation-countries">
            {countries.map((country) => (
              <span className="tims-attestation-country" key={country}>
                <span className="tims-attestation-country-dot" aria-hidden="true" />
                {country}
              </span>
            ))}
          </div>

          <p className="tims-attestation-text">
            We provide certificate attestation services for the countries above from various
            departments like Notary, GAD, State Home Ministry, SDM, Human Resource Development
            Department (HRD), Ministry of External Affairs (MEA), Embassy and Consulate for all
            kinds of certificate attestation requirements &mdash; business visit visa,
            employment visa, family visit visa, family resident visa, Driving License, and
            more.
          </p>

          <p className="tims-attestation-text">
            HRD, MEA, Embassy, Consulate, GAD, RAC, Notary, Home Ministry, SDM, Foreign
            Ministry, Secretariat, Mantralaya, External Affairs, MOFA, Indian Embassy,
            Education Ministry, Health Ministry, Ministry of Justice, Chamber of Commerce,
            University / College / School / Institute Attestation from India, HRD/MEA from
            Abroad, Notary/Home Ministry/Education Ministry/Health Ministry from Abroad,
            Embassy/Consulate from Abroad, Chamber of Commerce/Ministry of Justice/Foreign
            Ministry/MOFA from Abroad, University/School/College/Institute Attestation from
            Abroad, Magistrate&rsquo;s/Commissioner&rsquo;s/Resident Commissioner&rsquo;s
            Attestation from India, State Notary/Local Notary Attestation from India, Education
            Officer&rsquo;s/Assistant Education Officer&rsquo;s Attestation from India,
            Board/Technical Board/Council/CBSE Board Attestation from India, Head
            Master&rsquo;s/Head Mistress&rsquo;s/Principal&rsquo;s Attestation from India, Home
            Department/General Administration Department/Human Resource Development
            Department/Higher Education Department/District Education Department/Office of the
            Commissioner &ndash; Higher Education/Education Administrator&rsquo;s Office&rsquo;s
            Attestation, Government of GOA/Directorate of Technical Education/Education
            Department of SACHIVALAYA/Government of Gujarat&rsquo;s/Higher Education
            Commissioner&rsquo;s Office&rsquo;s Attestation, Director Higher Education
            Office/Director of Public Instruction&rsquo;s/Board of School Education/State Board
            of School Education&rsquo;s Attestation, Passport and Foreigners
            Department&rsquo;s Attestation, VIDHANA SOUDHA/Regional Authentication
            office/Government of MEGHALAYA/Government of MIZORAM Attestation, Higher &amp;
            Technical Education Department/Secretary Assistant to Special Secretary&rsquo;s
            Attestation, Government of ORISSA/Government of Puducherry Attestation, Department
            of Non-Resident Indian Affair&rsquo;s Attestation, Government of Punjab&rsquo;s
            Attestation, Mini Secretariat &ndash; CHANDIGARH Punjab&rsquo;s Attestation,
            Government Secretariat&rsquo;s Attestation, Joint Directors (Examination)
            offices/Deputy Directors (Examination) Offices Attestation, Government Public
            (Foreigners) Department&rsquo;s Attestation, Government of TAMILNADU Attestation,
            Government of Uttar Pradesh&rsquo;s Attestation, Home (Foreigner &amp; NRI)
            Attestation, Immunization Certificate/Vaccination Certificate/Health Certificate
            Attestation for pet animals, etc.
          </p>
        </div>

        <div className="tims-attestation-card">
          <h2 className="tims-attestation-card-title">Certificate Attestation</h2>
          <ul className="tims-attestation-list">
            {certificates.map((certificate) => (
              <li className="tims-attestation-list-item" key={certificate}>
                <span className="tims-attestation-list-dot" aria-hidden="true" />
                {certificate}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return <strong className="tims-attestation-highlight">{children}</strong>;
}
