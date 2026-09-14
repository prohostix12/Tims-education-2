"use client";

import { useState, useEffect } from "react";
import "../OnlineDegreeSection/tims-online-degree.css";

type Course = {
  name: string;
  eligibility: string;
  status?: string;
  order?: number;
};

type Category = {
  id: string;
  label: string;
  status?: string;
  order?: number;
  courses: Course[];
};

const initialCategories: Category[] = [
  {
    id: "diploma",
    label: "Diploma",
    courses: [
      { name: "Mechanic – (Refrigeration & Air Conditioning)", eligibility: "10th Pass" },
      { name: "Draughtsman", eligibility: "10th Pass" },
      { name: "Mechanical", eligibility: "10th Pass" },
      { name: "Civil", eligibility: "10th Pass" },
      { name: "Electrician", eligibility: "10th Pass" },
      { name: "Fitter", eligibility: "10th Pass" },
      { name: "Turner", eligibility: "10th Pass" },
      { name: "Machinist", eligibility: "10th Pass" },
      { name: "Mechanic (Diesel / Tractor)", eligibility: "10th Pass" },
      { name: "Plumber", eligibility: "10th Pass" },
      { name: "Welder (Gas & Electric)", eligibility: "10th Pass" },
      { name: "Painter", eligibility: "10th Pass" },
      { name: "Carpenter", eligibility: "10th Pass" },
      { name: "Mason (Raj Mistri)", eligibility: "10th Pass" },
    ],
  },
  {
    id: "diploma-engineering",
    label: "Diploma in Engineering",
    courses: [
      { name: "Automobile", eligibility: "10+2 or Its Equivalent" },
      { name: "Civil", eligibility: "10+2 or Its Equivalent" },
      { name: "Computer Science", eligibility: "10+2 or Its Equivalent" },
      { name: "Electronics & Communication", eligibility: "10+2 or Its Equivalent" },
      { name: "Electrical", eligibility: "10+2 or Its Equivalent" },
      { name: "Mechanical", eligibility: "10+2 or Its Equivalent" },
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

export default function DiplomaSection() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeId, setActiveId] = useState<string>(initialCategories[0].id);

  useEffect(() => {
    // 1. Try local storage cache
    try {
      const cached = localStorage.getItem("tims_diploma_streams");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const published = parsed
            .filter((s: any) => s.status === "Published")
            .map((s: any) => ({
              id: s.streamId || s.id,
              label: s.label,
              courses: (s.courses || [])
                .filter((c: any) => c.status === "Published")
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
            }));
          if (published.length > 0) {
            setCategories(published);
            setActiveId(published[0].id);
          }
        }
      }
    } catch {}

    // 2. Fetch fresh data from API
    fetch("/api/diploma-streams")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.streams) && data.streams.length > 0) {
          const published = data.streams
            .filter((s: any) => s.status === "Published")
            .map((s: any) => ({
              id: s.streamId || s.id,
              label: s.label,
              courses: (s.courses || [])
                .filter((c: any) => c.status === "Published")
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
            }));

          if (published.length > 0) {
            setCategories(published);
            setActiveId((prev) => (published.some((c: Category) => c.id === prev) ? prev : published[0].id));
          }

          try {
            localStorage.setItem("tims_diploma_streams", JSON.stringify(data.streams));
          } catch {}
        }
      })
      .catch((err) => console.error("Failed to fetch diploma streams:", err));
  }, []);

  const activeCategory = categories.find((category) => category.id === activeId) ?? categories[0];

  return (
    <section className="tims-online-degree-section">
      <div className="tims-online-degree-inner">
        <div className="tims-online-degree-header">
          <span className="tims-online-degree-eyebrow">Diploma Programs</span>
          <h1 className="tims-online-degree-heading">Explore Diploma Courses</h1>
          <p className="tims-online-degree-subtitle">
            Select a category to view its available courses and the eligibility required to
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
            <h2 className="tims-online-degree-panel-title">{activeCategory?.label || "Category"}</h2>

            {activeCategory?.courses && activeCategory.courses.length > 0 ? (
              <div className="tims-online-degree-table-wrap">
                <table className="tims-online-degree-table">
                  <thead>
                    <tr>
                      <th>Courses</th>
                      <th>Eligibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCategory.courses.map((course, idx) => (
                      <tr key={`${course.name}-${idx}`}>
                        <td className="tims-online-degree-course-name">{course.name}</td>
                        <td className="tims-online-degree-eligibility">{course.eligibility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="tims-online-degree-empty">
                Course list for this category is coming soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
