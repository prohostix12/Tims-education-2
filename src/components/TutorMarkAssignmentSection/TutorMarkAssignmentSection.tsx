import "./tims-tma.css";

const assignments = [
  "Assignment of all the subject sr.secondory (1240KB)",
  "Assignment of the Malayalam language subject",
];

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path
        d="M6.5 3h7l4 4v12.5a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3Z"
        stroke="#ED1C24"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M13.5 3v3.5A1 1 0 0 0 14.5 7.5H17.5" stroke="#ED1C24" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.5 12.5h7M8.5 15.5h7M8.5 18h4" stroke="#ED1C24" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function TutorMarkAssignmentSection() {
  return (
    <section className="tims-tma-section">
      <div className="tims-tma-inner">
        <h1 className="tims-tma-heading">TMA</h1>

        <div className="tims-tma-grid">
          {assignments.map((assignment) => (
            <a href="#" key={assignment} className="tims-tma-card">
              <span className="tims-tma-icon" aria-hidden="true">
                <FileIcon />
              </span>
              {assignment}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
