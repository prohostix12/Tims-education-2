import Link from "next/link";
import "./tims-new-courses-section.css";

type CourseLink = {
  label: string;
  href: string;
  icon: "transfer" | "graduation" | "certificate" | "monitor" | "layers" | "book";
  accent: "navy" | "red";
};

const courseLinks: CourseLink[] = [
  { label: "Credit Transfer", href: "https://www.edumentora.com/b-tech-credit-transfer", icon: "transfer", accent: "navy" },
  { label: "Post Graduation", href: "/courses/post-graduation", icon: "graduation", accent: "red" },
  { label: "Diploma", href: "/courses/diploma", icon: "certificate", accent: "red" },
  { label: "Online Degree", href: "/courses/online-degree", icon: "monitor", accent: "navy" },
  { label: "Btech / Mtech", href: "/courses/btech-mtech", icon: "layers", accent: "navy" },
  { label: "SSLC / PLUS TWO", href: "/courses/sslc-plus-two", icon: "book", accent: "red" },
];

function TransferIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M4 8h13l-3-3M20 16H7l3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 4 2 8.5 12 13l10-4.5L12 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M6 10.5V15c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M21 9v5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CertificateIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <rect x="3.5" y="4" width="17" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="17.5" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M10.2 19.6 9.4 22l2.6-1.3 2.6 1.3-.8-2.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6.5 8h11M6.5 11h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="12" rx="1.8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 20.5h7M12 16.5v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 3.5 3 8l9 4.5 9-4.5-9-4.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m3 12 9 4.5 9-4.5M3 16l9 4.5 9-4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M4 5.5c2.2-1 5-1.2 8 0 3-1.2 5.8-1 8 0v13c-2.2-1-5-1.2-8 0-3-1.2-5.8-1-8 0v-13Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 5.5v13" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="tims-new-course-arrow"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const iconComponents = {
  transfer: TransferIcon,
  graduation: GraduationIcon,
  certificate: CertificateIcon,
  monitor: MonitorIcon,
  layers: LayersIcon,
  book: BookIcon,
};

export default function CoursesSection() {
  return (
    <section className="tims-new-courses-section">
      <div className="tims-new-courses-inner">
        <div className="tims-new-courses-content">
          <div className="tims-new-courses-label-row">
            <span className="tims-new-courses-label">GET TO KNOW US</span>
            <span className="tims-new-courses-label-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </div>
          <span className="tims-new-courses-label-underline" aria-hidden="true" />

          <h2 className="tims-new-courses-title">
            Learning Anytime,
            <br />
            Anywhere for
            <br />
            <span className="tims-new-courses-title-accent">Success</span>
          </h2>

          <span className="tims-new-courses-divider" aria-hidden="true" />

          <p className="tims-new-courses-description">
            Providing accessible, high-quality education and guidance, Tirur Institute of
            Management Studies fosters academic excellence, professional growth, and societal
            impact for every learner.
          </p>
        </div>

        <div className="tims-new-courses-links">
          <div className="tims-new-courses-links-heading-row">
            <span className="tims-new-courses-links-heading-line" aria-hidden="true" />
            <h3 className="tims-new-courses-links-heading">Explore Courses and Services</h3>
            <span className="tims-new-courses-links-heading-line" aria-hidden="true" />
          </div>

          <div className="tims-new-courses-grid">
            {courseLinks.map((course) => {
              const Icon = iconComponents[course.icon];
              const isExternal = course.href.startsWith("http");

              if (isExternal) {
                return (
                  <a
                    key={course.label}
                    href={course.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`tims-new-course-card tims-new-course-card--${course.accent}`}
                  >
                    <span className="tims-new-course-icon">
                      <Icon />
                    </span>
                    <span className="tims-new-course-name">{course.label}</span>
                    <ArrowIcon />
                  </a>
                );
              }

              return (
                <Link
                  key={course.label}
                  href={course.href}
                  className={`tims-new-course-card tims-new-course-card--${course.accent}`}
                >
                  <span className="tims-new-course-icon">
                    <Icon />
                  </span>
                  <span className="tims-new-course-name">{course.label}</span>
                  <ArrowIcon />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
