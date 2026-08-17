"use client";

import { useState } from "react";
import "./tims-online-degree.css";

type Course = {
  name: string;
  eligibility: string;
};

type Category = {
  id: string;
  label: string;
  courses: Course[];
};

const categories: Category[] = [
  {
    id: "traditional-stream",
    label: "Traditional Stream",
    courses: [
      { name: "B.A (General)", eligibility: "10+2 or Its Equivalent" },
      { name: "B.A (Hindi)", eligibility: "10+2 or Its Equivalent" },
      { name: "B.A (English)", eligibility: "10+2 or Its Equivalent" },
      { name: "B.A (Sanskrit)", eligibility: "10+2 or Its Equivalent" },
      { name: "B.A (Urdu)", eligibility: "10+2 or Its Equivalent" },
      { name: "B.A (Political Science)", eligibility: "10+2 or Its Equivalent" },
      { name: "B.A (History)", eligibility: "10+2 or Its Equivalent" },
      { name: "B.A (Sociology)", eligibility: "10+2 or Its Equivalent" },
      { name: "B.A (Economics)", eligibility: "10+2 or Its Equivalent" },
      { name: "B.A (Mathematics)", eligibility: "10+2 or Its Equivalent" },
      { name: "B.A (Education)", eligibility: "10+2 or Its Equivalent" },
      { name: "B.A (Social Work)", eligibility: "10+2 or Its Equivalent" },
      { name: "Bachelor of Library Information Science (B.L.I.S)", eligibility: "10+2 or Its Equivalent" },
      { name: "Bachelor of Commerce (B.Com)", eligibility: "10+2 or Its Equivalent" },
    ],
  },
  {
    id: "management",
    label: "Department of Management",
    courses: [
      { name: "BBA", eligibility: "10 + 2" },
      { name: "Bachelor Insurance & Risk Management", eligibility: "10 + 2" },
      { name: "Diploma in Business Management", eligibility: "10 + 2" },
      { name: "Diploma in International Business", eligibility: "10 + 2" },
      { name: "Diploma in Hospital Management", eligibility: "10 + 2" },
      { name: "Diploma in Retail Management", eligibility: "10 + 2" },
      { name: "Diploma in Food Supply Chain Management", eligibility: "10 + 2" },
      { name: "Diploma in Marketing", eligibility: "10 + 2" },
      { name: "Diploma in Advertising", eligibility: "10 + 2" },
      { name: "Diploma in Insurance & Risk Management", eligibility: "10 + 2" },
      { name: "Certificate in all streams", eligibility: "10 + 2" },
    ],
  },
  {
    id: "cs-it",
    label: "Department of CS/IT",
    courses: [
      { name: "BCA", eligibility: "10 + 2" },
      { name: "B.Sc Information Technology (IT)", eligibility: "10 + 2" },
      { name: "Diploma in Computer Applications (DCA)", eligibility: "10 + 2" },
      { name: "Diploma in Software Engineering (DSE)", eligibility: "10 + 2" },
      { name: "Diploma in Information Technology (DIT)", eligibility: "10 + 2" },
      { name: "Diploma in Computer Science (DCS)", eligibility: "10 + 2" },
      { name: "Advance Diploma in Hardware and Networking", eligibility: "10+2 in any stream or equivalent." },
      { name: "Certificate in Computer Application (CCA)", eligibility: "10 + 2" },
      { name: "Certificate in Computing (CIC)", eligibility: "10 + 2" },
    ],
  },
  {
    id: "science",
    label: "Department of Science",
    courses: [
      { name: "B.Sc (General)", eligibility: "10+ 2 With Science" },
      { name: "B.Sc (With Biology)", eligibility: "10+ 2 With Science" },
      { name: "B.Sc (Mathematics)", eligibility: "10+ 2 With Science" },
      { name: "B.Sc (Statistics)", eligibility: "10+ 2 With Science" },
      { name: "B.Sc (Physics)", eligibility: "10+ 2 With Science" },
      { name: "B.Sc (Botany)", eligibility: "10+ 2 With Science" },
      { name: "B.Sc (Zoology)", eligibility: "10+ 2 With Science" },
      { name: "M.A (Political Science)", eligibility: "10+ 2 With Science" },
      { name: "B.Sc (Chemistry)", eligibility: "10+ 2 With Science" },
      { name: "B.Sc (Microbiology)", eligibility: "10+ 2 With Science" },
      { name: "B.Sc (Bio-Chemistry)", eligibility: "10+ 2 With Science" },
      { name: "B.Sc (Applied Chemistry)", eligibility: "10+ 2 With Science" },
      { name: "Diploma In (Fire-safety and Hazard Management)", eligibility: "10+2 or Its Equivalent" },
      { name: "B.Sc In (Fire-safety and Hazard Management)", eligibility: "10+2 or Its Equivalent" },
    ],
  },
  {
    id: "biotechnology",
    label: "Department of Biotechnology",
    courses: [
      { name: "B.Sc (Biotechnology)", eligibility: "10 + 2" },
      { name: "B.Sc (Bioinformatics)", eligibility: "10 + 2" },
      { name: "Certificate Course in Advanced Bio-informatics", eligibility: "10 + 2" },
      { name: "Certificate Course in Industrial Biotechnology", eligibility: "10 + 2" },
      { name: "Certificate Course in IPR & Patents Law", eligibility: "10 + 2" },
    ],
  },
  {
    id: "paramedical",
    label: "Paramedical Stream",
    courses: [
      { name: "B.Sc in Yoga and Naturopathy", eligibility: "10+2 With PCB" },
      { name: "Diploma in Yoga and Health Education", eligibility: "10+2" },
    ],
  },
  {
    id: "hospitality-tourism",
    label: "Department of Hospitality & Tourism",
    courses: [
      { name: "B.A (Hospitality & Tourism)", eligibility: "10 + 2" },
      { name: "B.A (Hospitality & Hotel Administration)", eligibility: "10 + 2" },
      { name: "B.Sc (Hotel Administration & Hospitality)", eligibility: "10 + 2" },
      { name: "B.Sc (Hotel Administration & Hospitality) (Lateral)", eligibility: "10 + 2 AND ADHAH" },
      { name: "Diploma in Hotel Management", eligibility: "10 + 2" },
      { name: "Diploma in Hospitality Management", eligibility: "10 + 2" },
      { name: "Diploma in Hotel Administration & Hospitality Management", eligibility: "10 + 2" },
      { name: "Advance Diploma in Hotel Administration & Hospitality", eligibility: "10 + 2 AND DHM" },
      { name: "Advance Diploma in Hotel Administration & Hospitality in Sem III", eligibility: "10 + 2" },
      { name: "Certificate in Front Office Management", eligibility: "10 + 2" },
      { name: "Certificate in Tourism Management", eligibility: "10 + 2" },
    ],
  },
  {
    id: "media-communication",
    label: "Department of Media & Communication",
    courses: [
      { name: "B.A (Advertising & Mass Communication)", eligibility: "10 + 2" },
      { name: "B.A (Journalism & Mass Communication)", eligibility: "10 + 2" },
      { name: "Diploma in Web Journalism", eligibility: "10 + 2" },
      { name: "Diploma in Brand Management", eligibility: "10 + 2" },
      { name: "Certificate in Event Management", eligibility: "10 + 2" },
      { name: "Certificate in Mass Communication", eligibility: "10 + 2" },
    ],
  },
  {
    id: "fashion-textile",
    label: "Department of Fashion & Textile Design",
    courses: [
      { name: "B.A in Fashion Marketing & Promotion", eligibility: "10 + 2" },
      { name: "B.A in Fashion Technology", eligibility: "10 + 2" },
      { name: "B.Sc Interior Design", eligibility: "10 + 2" },
      { name: "B.Sc Graphics & Multimedia", eligibility: "10 + 2" },
      { name: "B.Sc in Fashion Designing", eligibility: "10 + 2" },
      { name: "Diploma in Art and Craft", eligibility: "10 + 2" },
      { name: "Diploma Fashion Design", eligibility: "10 + 2" },
      { name: "Diploma Fashion Marketing", eligibility: "10 + 2" },
      { name: "Diploma in Fashion Merchandising", eligibility: "10 + 2" },
      { name: "Diploma Interior Design", eligibility: "10th" },
      { name: "Diploma Graphics & Multimedia", eligibility: "10th" },
    ],
  },
  {
    id: "lateral-entry",
    label: "Lateral Entry & Respective Eligibility",
    courses: [
      { name: "BBA", eligibility: "2nd Year" },
      { name: "BCA", eligibility: "2nd Year" },
      { name: "B.SC IT", eligibility: "2nd Year" },
      { name: "B.SC CS", eligibility: "2nd Year" },
      { name: "B.Sc in Fashion Design", eligibility: "2nd Year" },
      { name: "B.Sc in Interior Design", eligibility: "2nd Year" },
      { name: "Advance Diploma in Fire Safety", eligibility: "2nd Year" },
      { name: "MCA", eligibility: "3rd & 5th Semester" },
      { name: "M.Sc IT", eligibility: "2nd Year" },
      { name: "M.Sc CS", eligibility: "2nd Year" },
    ],
  },
];

function ArrowIcon() {
  return (
    <svg
      className="tims-online-degree-nav-arrow"
      viewBox="0 0 24 24"
      width="14"
      height="14"
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

export default function OnlineDegreeSection() {
  const [activeId, setActiveId] = useState(categories[0].id);
  const activeCategory = categories.find((category) => category.id === activeId) ?? categories[0];

  return (
    <section className="tims-online-degree-section">
      <div className="tims-online-degree-inner">
        <div className="tims-online-degree-header">
          <span className="tims-online-degree-eyebrow">Online Degree Programs</span>
          <h1 className="tims-online-degree-heading">Explore Courses by Department</h1>
          <p className="tims-online-degree-subtitle">
            Select a department to view its available courses and the eligibility required to
            apply.
          </p>
        </div>

        <div className="tims-online-degree-layout">
          <nav className="tims-online-degree-nav" aria-label="Course categories">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`tims-online-degree-nav-btn ${
                  category.id === activeId ? "tims-online-degree-nav-btn--active" : ""
                }`}
                onClick={() => setActiveId(category.id)}
                aria-pressed={category.id === activeId}
              >
                <span>{category.label}</span>
                <ArrowIcon />
              </button>
            ))}
          </nav>

          <div className="tims-online-degree-panel">
            <h2 className="tims-online-degree-panel-title">{activeCategory.label}</h2>

            {activeCategory.courses.length > 0 ? (
              <div className="tims-online-degree-table-wrap">
                <table className="tims-online-degree-table">
                  <thead>
                    <tr>
                      <th>Courses</th>
                      <th>Eligibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCategory.courses.map((course) => (
                      <tr key={course.name}>
                        <td className="tims-online-degree-course-name">{course.name}</td>
                        <td className="tims-online-degree-eligibility">{course.eligibility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="tims-online-degree-empty">
                Course list for this department is coming soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
