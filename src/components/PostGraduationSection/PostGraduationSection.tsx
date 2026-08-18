"use client";

import { useState } from "react";
import "../OnlineDegreeSection/tims-online-degree.css";

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
      { name: "Master of Commerce (M.Com)", eligibility: "Graduation" },
      { name: "M.A (Human Rights)", eligibility: "Graduation" },
      { name: "M.A (Hindi)", eligibility: "Graduation" },
      { name: "M.A (Sanskrit)", eligibility: "Graduation" },
      { name: "M.A (English)", eligibility: "Graduation" },
      { name: "M.A (Political Science)", eligibility: "Graduation" },
      { name: "M.A (History)", eligibility: "Graduation" },
      { name: "M.A (Philosophy)", eligibility: "Graduation" },
      { name: "M.A (Sociology)", eligibility: "Graduation" },
      { name: "M.A (Mathematics)", eligibility: "Graduation" },
      { name: "M.A (Economics)", eligibility: "Graduation" },
      { name: "M.A (Education)", eligibility: "Graduation" },
      { name: "M.A (Psychology)", eligibility: "Graduation" },
      { name: "M.A (Geography)", eligibility: "Graduation" },
      { name: "M.A (Physical Education)", eligibility: "Graduation" },
      { name: "M.A (Public Administration)", eligibility: "Graduation" },
      { name: "Master of Social Work (M.S.W)", eligibility: "Graduation" },
      { name: "Master of Library Information Science (M.L.I.S)", eligibility: "B.L.I.S" },
    ],
  },
  {
    id: "cs-it",
    label: "Department of CS/IT",
    courses: [
      { name: "MCA", eligibility: "Graduation" },
      { name: "M.Sc Computer Science", eligibility: "Graduation" },
      { name: "M.Sc Information Technology (IT)", eligibility: "Graduation" },
      { name: "Post Graduate Diploma in Computer Application (PGDCA)", eligibility: "Graduation" },
      { name: "Post Graduate Diploma in Information Technology (PGDIT)", eligibility: "Graduation" },
      { name: "Post Graduate Diploma in Computer Science (PGDCS)", eligibility: "Graduation" },
    ],
  },
  {
    id: "science",
    label: "Department of Science",
    courses: [
      { name: "MCA", eligibility: "B.Sc With Relevant Subject" },
      { name: "M.sc (Mathematics)", eligibility: "B.Sc With Relevant Subject" },
      { name: "M.Sc (Chemistry)", eligibility: "B.Sc With Relevant Subject" },
      { name: "M.Sc (Physics)", eligibility: "B.Sc With Relevant Subject" },
      { name: "M.Sc (Environment Science)", eligibility: "B.Sc With PCM/PCB" },
    ],
  },
  {
    id: "paramedical",
    label: "Paramedical Stream",
    courses: [
      { name: "M.A in Yoga and Health Education", eligibility: "Graduation" },
      { name: "M.Sc in Yoga and Health Education", eligibility: "Graduation" },
      { name: "Post Graduate Diploma in Yoga and Health Education", eligibility: "Graduation" },
    ],
  },
  {
    id: "hospitality-tourism",
    label: "Department of Hospitality & Tourism",
    courses: [
      { name: "M.A (Tourism Management)", eligibility: "Graduation" },
      { name: "Post Graduate Diploma in Hotel Administration & Hospitality", eligibility: "Graduation" },
      { name: "PG Diploma in Hospitality & Tourism", eligibility: "Graduation" },
    ],
  },
  {
    id: "media-communication",
    label: "Department of Media & Communication",
    courses: [
      { name: "M.A (Advertising & Mass Communication)", eligibility: "Graduation" },
      { name: "M.A (Journalism & Mass Communication)", eligibility: "Graduation" },
      {
        name: "PG Diploma in Media Management/ PR & Marketing Communication/ Print Journal / Broadcast/ Advtg. & Event Planning/ Corp Com/Brand Management",
        eligibility: "Graduation",
      },
    ],
  },
  {
    id: "fashion-textile",
    label: "Department of Fashion & Textile Design",
    courses: [
      { name: "M.Sc in Fashion Designing", eligibility: "B.Sc in Fashion Designing" },
      { name: "Post Graduate Diploma IN Fashion Designing", eligibility: "B.Sc in Fashion Designing" },
      { name: "Post Graduate Diploma Graphics & Multimedia", eligibility: "B.Sc Graphics & Multimedia" },
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

export default function PostGraduationSection() {
  const [activeId, setActiveId] = useState(categories[0].id);
  const activeCategory = categories.find((category) => category.id === activeId) ?? categories[0];

  return (
    <section className="tims-online-degree-section">
      <div className="tims-online-degree-inner">
        <div className="tims-online-degree-header">
          <span className="tims-online-degree-eyebrow">Post Graduation Programs</span>
          <h1 className="tims-online-degree-heading">Explore Courses by Department</h1>
          <p className="tims-online-degree-subtitle">
            Select a department to view its available postgraduate courses and the eligibility
            required to apply.
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
