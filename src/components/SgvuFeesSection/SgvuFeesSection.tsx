import "../AmuOnlineProgramsSection/tims-amu-programs.css";

type Row = {
  sl: number;
  course: string;
  specialization: string | string[];
  fees: string;
};

const rows: Row[] = [
  {
    sl: 1,
    course: "BA General",
    specialization: [
      "Economics, History, English Literature, Psychology, Political Science, Public Administration, Geography",
    ],
    fees: "10+2 or its equivalent",
  },
  { sl: 2, course: "BJMC", specialization: "", fees: "10+2 or its equivalent" },
  { sl: 3, course: "BBA", specialization: "", fees: "10+2 or its equivalent" },
  { sl: 4, course: "B COM", specialization: "", fees: "10+2 or its equivalent" },
  {
    sl: 5,
    course: "MBA",
    specialization: [
      "1. Human Resource Management",
      "2. Financial Planning & Analysis",
      "3. Marketing",
      "4. Finance",
      "5. Operation & Production Management",
    ],
    fees: "Graduation with a 50% score, from a recognized university.",
  },
  {
    sl: 6,
    course: "MBA",
    specialization: [
      "1. International Marketing",
      "2. Hospital Management",
      "3. Information Technology",
      "4. Business Analytics & Intelligence.",
      "5. Branding & Advertising",
      "6. Project Leadership Management",
      "7. Banking Management",
      "8. E-commerce Marketing & Management",
      "9. Mass Communication",
      "10. Digital Marketing",
      "11. Risk Management",
      "12. Business Leadership",
      "13. Strategic Management",
      "14. Entrepreneurship",
      "15. Media & Entertainment Management",
      "16. Foreign Trade & Global Business management",
      "17. Investment Banking & Wealth Management",
      "18. Supply Chain Management",
    ],
    fees: "Graduation with a 50% score, from a recognized university.",
  },
  {
    sl: 7,
    course: "MA",
    specialization: ["English, Hindi, Political Science, Sociology, History, Economics"],
    fees: "Any Degree from Recognized University",
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

export default function SgvuFeesSection() {
  return (
    <section className="tims-amu-programs-section">
      <div className="tims-amu-programs-inner">
        <h2 className="tims-amu-programs-heading">Course Fees</h2>

        <div className="tims-amu-programs-panel">
          <div className="tims-amu-programs-table-wrap">
            <table className="tims-amu-programs-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Courses</th>
                  <th>Specialization</th>
                  <th>Fees Yearly</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`${row.course}-${row.sl}`}>
                    <td className="tims-amu-programs-sl">{row.sl}</td>
                    <td className="tims-amu-programs-course">{row.course}</td>
                    <td>
                      {Array.isArray(row.specialization) && row.specialization.length > 0 ? (
                        <ul className="tims-amu-programs-spec-list">
                          {row.specialization.map((spec) => (
                            <li key={spec}>{spec}</li>
                          ))}
                        </ul>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>{row.fees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <a
          href="/documents/sgvu-brochure.pdf"
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
