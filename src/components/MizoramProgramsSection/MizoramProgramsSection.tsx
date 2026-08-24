import "./tims-mizoram-programs.css";

type Program = {
  sl: number;
  course: string;
  eligibility: string;
};

const gradOrDiploma = "Graduation Degree (in any stream) or a Diploma with Two Years Work Experience";
const executiveDiplomaMaths =
  "Any graduate or equivalent through (10 +2 + 3) with Mathematics as a subject in Higher Secondary from a recognised University/Board. A candidate with a Post Graduate Diploma in Computer Science or Statistics, will not require Mathematics as compulsory.";

const programs: Program[] = [
  { sl: 1, course: "B Com E-Commerce", eligibility: "10 +2 pass or equivalent from a recognized board" },
  { sl: 2, course: "E Accounting B Com", eligibility: "10 +2 pass or equivalent from a recognized board" },
  { sl: 3, course: "BBA (E-Business)", eligibility: "10 +2 pass or equivalent from a recognized board" },
  {
    sl: 4,
    course: "MBA – Marketing",
    eligibility: "Any Graduation or equivalent through (10 +2 + 3) from a recognized Board / University.",
  },
  {
    sl: 5,
    course: "MBA – Financial Management",
    eligibility:
      "Any passed Graduate or equivalent through (10 +2 + 3) and Mathematics in Higher Secondary of recognized University/ Board. Additionally, in case of a Post Graduate Diploma qualified in Computer Science or Statistics, Mathematics is not mandatory.",
  },
  {
    sl: 6,
    course: "MBA – Entrepreneurship",
    eligibility: "Any Graduation or equivalent through (10 +2 + 3) from a recognized Board / University.",
  },
  { sl: 7, course: "Executive Diploma in Application Development", eligibility: executiveDiplomaMaths },
  { sl: 8, course: "Executive Diploma in Internet of Things", eligibility: executiveDiplomaMaths },
  { sl: 9, course: "Executive Diploma In Artificial Intelligence", eligibility: executiveDiplomaMaths },
  { sl: 10, course: "Executive Diploma In Cyber Security", eligibility: executiveDiplomaMaths },
  { sl: 11, course: "Diploma In Computer Applications", eligibility: "12th Pass" },
  { sl: 12, course: "Executive Program In General Management", eligibility: "Anyone with class 8 pass & min 18 years of age." },
  { sl: 13, course: "Executive Program In Human Resource Management", eligibility: gradOrDiploma },
  { sl: 14, course: "Executive Program In Marketing Management", eligibility: gradOrDiploma },
  { sl: 15, course: "Executive Program In Finance Management", eligibility: gradOrDiploma },
  { sl: 16, course: "Executive Program In Retail Management", eligibility: gradOrDiploma },
  { sl: 17, course: "Executive Program In Operations Management", eligibility: gradOrDiploma },
  { sl: 18, course: "Executive Program in Banking & Finance Management", eligibility: gradOrDiploma },
  { sl: 19, course: "Executive Program In Information Technology", eligibility: gradOrDiploma },
  { sl: 20, course: "Executive Program In Human Resource Management Advance", eligibility: gradOrDiploma },
  { sl: 21, course: "Executive Program in Marketing Management – Advance", eligibility: gradOrDiploma },
  { sl: 22, course: "Executive Program in Finance Management – Advance", eligibility: gradOrDiploma },
  { sl: 23, course: "Executive Program in Retail Management – Advance", eligibility: gradOrDiploma },
  { sl: 24, course: "Executive Program In Operations Management – Advance", eligibility: gradOrDiploma },
  { sl: 25, course: "Executive Program In Banking & Finance Management – Advance", eligibility: gradOrDiploma },
  { sl: 26, course: "Executive Program In Information Technology – Advance", eligibility: gradOrDiploma },
  { sl: 27, course: "Certificate Course In Computerized Accounting", eligibility: "10+2 / Equivalent" },
  { sl: 28, course: "Certificate Course In Advanced Digital Marketing", eligibility: "10+2 / Equivalent" },
  { sl: 29, course: "Certificate Course in Android App Development", eligibility: "10+2 / Equivalent with knowledge of JAVA and XML" },
  { sl: 30, course: "Certificate Course In GST", eligibility: "10+2 / Equivalent" },
];

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M12 4.5v11M7.5 11.5 12 16l4.5-4.5M5.5 19.5h13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MizoramProgramsSection() {
  return (
    <section className="tims-mizoram-programs-section">
      <div className="tims-mizoram-programs-inner">
        <h2 className="tims-mizoram-programs-heading">Online Programs</h2>

        <div className="tims-mizoram-programs-panel">
          <div className="tims-mizoram-programs-table-wrap">
            <table className="tims-mizoram-programs-table">
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Courses</th>
                  <th>Eligibility</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.sl}>
                    <td className="tims-mizoram-programs-sl">{program.sl}</td>
                    <td className="tims-mizoram-programs-course">{program.course}</td>
                    <td>{program.eligibility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <a
          href="/documents/mizoram-university-brochure.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="tims-mizoram-programs-download"
        >
          <DownloadIcon />
          Download Brochure
        </a>
      </div>
    </section>
  );
}
