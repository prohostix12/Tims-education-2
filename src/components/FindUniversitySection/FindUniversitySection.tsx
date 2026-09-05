import type { ReactNode } from "react";
import "./tims-find-university.css";

const stats = [
  { value: "50,000+", label: "Learners" },
  { value: "20,000+", label: "Happy Alumni" },
  { value: "100+", label: "Expert Mentors" },
  { value: "18+ Years", label: "Experience" },
];

const services = [
  "Course Finding & Matching",
  "University Recommendations",
  "Admission Guidance & Processing",
  "Study Materials & Exam Prep",
  "Career Counseling",
  "Credit Transfer Programs",
  "Attestation Services",
  "International University Partnerships",
  "NIOS Pathway Guidance",
];

const undergraduate = ["BA", "B.Com", "BBA", "BCA", "B.Sc", "B.Tech"];
const postgraduate = ["MBA", "MCA", "M.Com", "M.Sc", "M.Tech", "MA", "LLB", "PGDM"];
const otherPrograms = ["Online / Distance Programs", "Skill Integrated Diploma Programs (SIDP)", "Diploma Programs"];

const universities = [
  "Amity University",
  "Manipal University",
  "LPU",
  "Jain University",
  "Chandigarh University",
  "IGNOU",
];

const locations = ["Delhi", "UAE", "Kochi", "Malappuram", "Calicut"];

function Highlight({ children }: { children: ReactNode }) {
  return <strong className="tims-fu-highlight">{children}</strong>;
}

function ChipList({ items }: { items: string[] }) {
  return (
    <ul className="tims-fu-chip-list">
      {items.map((item) => (
        <li className="tims-fu-chip" key={item}>
          <span className="tims-fu-chip-dot" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function FindUniversitySection() {
  return (
    <section className="tims-fu-section">
      <div className="tims-fu-inner">
        <div className="tims-fu-header">
          <span className="tims-fu-label">Partner Platform</span>
          <h1 className="tims-fu-heading">Find Your Best University</h1>
          <p className="tims-fu-subtitle">
            India&rsquo;s No.1 course-finding platform, offering{" "}
            <Highlight>end-to-end support</Highlight> &mdash; from choosing the right
            university to completing your admission successfully.
          </p>
          <p className="tims-fu-source">
            Key information sourced from{" "}
            <a
              href="https://findyouruniversity.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="tims-fu-link-highlight"
            >
              Find Your University
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "4px" }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </p>
        </div>

        <div className="tims-fu-stats">
          {stats.map((stat) => (
            <div className="tims-fu-stat" key={stat.label}>
              <span className="tims-fu-stat-value">{stat.value}</span>
              <span className="tims-fu-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="tims-fu-card">
          <h2 className="tims-fu-card-title">Services Offered</h2>
          <ChipList items={services} />
        </div>

        <div className="tims-fu-card">
          <h2 className="tims-fu-card-title">Courses &amp; Programs Available</h2>

          <div className="tims-fu-group">
            <h3 className="tims-fu-group-title">Undergraduate</h3>
            <ChipList items={undergraduate} />
          </div>

          <div className="tims-fu-group">
            <h3 className="tims-fu-group-title">Postgraduate</h3>
            <ChipList items={postgraduate} />
          </div>

          <div className="tims-fu-group">
            <h3 className="tims-fu-group-title">Other Programs</h3>
            <ChipList items={otherPrograms} />
          </div>
        </div>

        <div className="tims-fu-card">
          <h2 className="tims-fu-card-title">Partner Universities (90+)</h2>
          <p className="tims-fu-text" style={{ marginBottom: "1rem" }}>
            Including &mdash; among 90+ partner institutions:
          </p>
          <ChipList items={universities} />
        </div>

        <div className="tims-fu-card">
          <h2 className="tims-fu-card-title">Contact Information</h2>
          <div className="tims-fu-contact-grid">
            <div className="tims-fu-contact-item">
              <span className="tims-fu-contact-label">Phone</span>
              <span className="tims-fu-contact-value">
                <a href="tel:+918943555592">+91 8943 555 592</a>
              </span>
            </div>
            <div className="tims-fu-contact-item">
              <span className="tims-fu-contact-label">Email</span>
              <span className="tims-fu-contact-value">
                <a href="mailto:info@findyouruniversity.com">info@findyouruniversity.com</a>
              </span>
            </div>
            <div className="tims-fu-contact-item">
              <span className="tims-fu-contact-label">Locations</span>
              <span className="tims-fu-contact-value">{locations.join(", ")}</span>
            </div>
            <div className="tims-fu-contact-item">
              <span className="tims-fu-contact-label">Social</span>
              <span className="tims-fu-contact-value">
                <a
                  href="https://www.instagram.com/find_youruniversity"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @find_youruniversity
                </a>
              </span>
            </div>
          </div>

          <div className="tims-fu-cta-row">
            <a
              href="https://findyouruniversity.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="tims-fu-cta"
            >
              Register Now
            </a>
            <a
              href="https://findyouruniversity.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="tims-fu-cta tims-fu-cta--outline"
            >
              Get Free Guidance
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
