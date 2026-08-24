import "./tims-amu-programs.css";

type Program = {
  sl: number;
  course: string;
  specialization: string | string[];
  eligibility: string;
};

const programs: Program[] = [
  {
    sl: 1,
    course: "Bachelor of Arts",
    specialization: ["English", "Economics", "Hindi", "History", "Political Science", "Urdu"],
    eligibility:
      "Senior Secondary School Certificate (SSC, 10+2), in any stream from any examination board recognized by Aligarh Muslim University, Aligarh.",
  },
  {
    sl: 2,
    course: "Bachelor of Commerce",
    specialization: "General",
    eligibility:
      "Senior Secondary School Certificate (SSC, 10+2), in any stream from any examination board recognized by Aligarh Muslim University, Aligarh.",
  },
  {
    sl: 3,
    course: "Master of Commerce",
    specialization: "General",
    eligibility:
      "Any Candidate who has passed B.Com from any University or institute recognized by Aligarh Muslim University, Aligarh.",
  },
  {
    sl: 4,
    course: "Master of Arts",
    specialization: "English",
    eligibility:
      "B.A/ B.Sc/ B.Com from any University or institute recognized by Aligarh Muslim University, Aligarh. Applicants who have not studied English as a subject in qualifying examination will not be eligible.",
  },
  {
    sl: 5,
    course: "Master of Arts",
    specialization: "Economics",
    eligibility:
      "B.A from any University or institute recognized by Aligarh Muslim University, Aligarh. Applicants who have not studied Economics as a subject qualifying examination will not be eligible.",
  },
  {
    sl: 6,
    course: "Master of Arts",
    specialization: "Hindi",
    eligibility:
      "B.A./B.Sc./B.Com./B.Th. or equivalent examination from any University or institute recognized by Aligarh Muslim University, Aligarh.",
  },
  {
    sl: 7,
    course: "Master of Arts",
    specialization: "History",
    eligibility:
      "B.A./B.Sc./B.Com. or any equivalent Degree from any University or institute recognized by Aligarh Muslim University, Aligarh.",
  },
  {
    sl: 8,
    course: "Master of Arts",
    specialization: "Political Science",
    eligibility:
      "Graduate in any discipline from any University or institute recognized by Aligarh Muslim University, Aligarh.",
  },
  {
    sl: 9,
    course: "Master of Arts",
    specialization: "Urdu",
    eligibility:
      "B.A. /B.Sc. /B.Com. /B.Th. or an equivalent examination from any University or institute recognized by Aligarh Muslim University, Aligarh.",
  },
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

export default function AmuOnlineProgramsSection() {
  return (
    <section className="tims-amu-programs-section">
      <div className="tims-amu-programs-inner">
        <h2 className="tims-amu-programs-heading">Online Programs</h2>

        <div className="tims-amu-programs-panel">
          <div className="tims-amu-programs-table-wrap">
            <table className="tims-amu-programs-table">
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Courses</th>
                  <th>Specialization</th>
                  <th>Eligibility</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={`${program.course}-${program.sl}`}>
                    <td className="tims-amu-programs-sl">{program.sl}</td>
                    <td className="tims-amu-programs-course">{program.course}</td>
                    <td>
                      {Array.isArray(program.specialization) ? (
                        <ul className="tims-amu-programs-spec-list">
                          {program.specialization.map((spec) => (
                            <li key={spec}>{spec}</li>
                          ))}
                        </ul>
                      ) : (
                        program.specialization
                      )}
                    </td>
                    <td>{program.eligibility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <a
          href="/documents/amu-online-programs-brochure.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="tims-amu-programs-download"
        >
          <DownloadIcon />
          Download Brochure
        </a>
      </div>
    </section>
  );
}
