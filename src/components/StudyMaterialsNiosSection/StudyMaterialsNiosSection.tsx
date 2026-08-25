import "./tims-study-materials-nios.css";

const resources = ["Secondary Books", "Senior Secondary Question Papers", "Senior Secondary Books"];

function DriveIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="18" fill="currentColor" aria-hidden="true">
      <path d="M8.5 3h7l6 10.5-3.5 6h-12l-3.5-6L8.5 3Z" opacity="0.35" />
      <path d="M8.5 3h7l3 5.25h-13L8.5 3Z" />
      <path d="M2 13.5 8.5 3l3 5.25L5 19.5 2 13.5Z" />
      <path d="M22 13.5 15.5 3l-3 5.25L19 19.5l3-6Z" />
    </svg>
  );
}

export default function StudyMaterialsNiosSection() {
  return (
    <section className="tims-nios-materials-section">
      <div className="tims-nios-materials-inner">
        <h1 className="tims-nios-materials-heading">National Institute of Open Schooling</h1>

        <div className="tims-nios-materials-grid">
          {resources.map((resource) => (
            <a href="#" key={resource} className="tims-nios-materials-link">
              <span className="tims-nios-materials-icon" aria-hidden="true">
                <DriveIcon />
              </span>
              {resource}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
