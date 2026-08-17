import "./tims-facility-section.css";

const facilities = [
  {
    title: "Transfer of Credit (TOC)",
    text: "Students who have failed either the SSLC or Plus Two standard need not appear for all subjects again. NIOS board offers Transfer of Credit (TOC) for a maximum of two subjects passed in a previous board exam. The marks in those passed subjects are carried over to the NIOS certificate, so the student only needs to appear for the failed subjects.",
  },
  {
    title: "Change of Subject / Additional Subject",
    text: "During the five-year admission period, a learner can change one or more subjects, provided the total number of subjects does not exceed seven. Such a change is permissible within four years of registration, so the student can still appear in Public Examinations within the validity period. No change or addition is allowed for the first examination, and subjects already passed cannot be changed.",
  },
];

const documents = ["Admission", "SSLC", "Plus Two"];

function CreditIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M4 8h13M4 8l3.5-3.5M4 8l3.5 3.5M20 16H7M20 16l-3.5-3.5M20 16l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SubjectIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M5 19.5V5.5a1 1 0 0 1 1-1h9.5L19 8v11.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14.5 4.5V8H19" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.5 13h6M8.5 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const icons = [CreditIcon, SubjectIcon];

export default function AdditionalFacilitySection() {
  return (
    <section className="tims-facility-section">
      <div className="tims-facility-inner">
        <span className="tims-facility-eyebrow">Student Support</span>
        <h2 className="tims-facility-heading">Additional Facility</h2>
        <p className="tims-facility-subtitle">
          Flexibility built into the NIOS system so a setback in one exam session doesn&rsquo;t
          cost a student more time than necessary.
        </p>

        <div className="tims-facility-grid">
          {facilities.map((facility, index) => {
            const Icon = icons[index];
            return (
              <div className="tims-facility-card" key={facility.title}>
                <div className="tims-facility-card-head">
                  <span className="tims-facility-card-icon">
                    <Icon />
                  </span>
                  <h3 className="tims-facility-card-title">{facility.title}</h3>
                </div>
                <p className="tims-facility-card-text">{facility.text}</p>
              </div>
            );
          })}
        </div>

        <div className="tims-facility-docs">
          <h3 className="tims-facility-docs-title">
            Documents Required for SSLC &amp; Plus Two Admission in NIOS
          </h3>
          <ul className="tims-facility-docs-list">
            {documents.map((doc) => (
              <li className="tims-facility-docs-item" key={doc}>
                <span className="tims-facility-docs-check">
                  <CheckIcon />
                </span>
                {doc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
