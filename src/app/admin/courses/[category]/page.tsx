"use client";

import { use } from "react";
import Link from "next/link";
import { useState } from "react";

type CategoryMeta = {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  courses: {
    id: string;
    code: string;
    title: string;
    duration: string;
    mode: string;
    status: "Active" | "Draft" | "Archived";
    studentsEnrolled: number;
  }[];
};

const categoryMap: Record<string, CategoryMeta> = {
  "sslc-plus-two": {
    title: "SSLC / Plus Two Management",
    subtitle: "Secondary & Higher Secondary Open Schooling (NIOS)",
    description: "Manage stream details, TOC credit transfer subjects, examination batches, and NIOS board registration guidelines.",
    badge: "Open Schooling",
    courses: [
      { id: "1", code: "SSLC-10", title: "Secondary School Certificate (SSLC 10th)", duration: "1 Year", mode: "Distance / Online", status: "Active", studentsEnrolled: 420 },
      { id: "2", code: "PLUS2-HUM", title: "Plus Two - Humanities Stream", duration: "1-2 Years", mode: "Distance / Online", status: "Active", studentsEnrolled: 310 },
      { id: "3", code: "PLUS2-COM", title: "Plus Two - Commerce Stream", duration: "1-2 Years", mode: "Distance / Online", status: "Active", studentsEnrolled: 285 },
      { id: "4", code: "PLUS2-SCI", title: "Plus Two - Science Stream", duration: "1-2 Years", mode: "Distance / Online", status: "Active", studentsEnrolled: 195 },
    ],
  },
  "online-degree": {
    title: "Online Degree Management",
    subtitle: "UGC Approved Online Undergraduate Programs",
    description: "Manage online bachelor degree programs, affiliated universities, semester fees, and course specifications.",
    badge: "UG Degrees",
    courses: [
      { id: "1", code: "BCOM-OL", title: "Bachelor of Commerce (B.Com Online)", duration: "3 Years", mode: "Online", status: "Active", studentsEnrolled: 540 },
      { id: "2", code: "BBA-OL", title: "Bachelor of Business Administration (BBA)", duration: "3 Years", mode: "Online", status: "Active", studentsEnrolled: 410 },
      { id: "3", code: "BCA-OL", title: "Bachelor of Computer Applications (BCA)", duration: "3 Years", mode: "Online", status: "Active", studentsEnrolled: 380 },
      { id: "4", code: "BA-ENG", title: "BA English Literature", duration: "3 Years", mode: "Online", status: "Active", studentsEnrolled: 210 },
    ],
  },
  "post-graduation": {
    title: "Post Graduation Management",
    subtitle: "Master & Postgraduate Professional Degrees",
    description: "Manage master's degree programs, eligibility requirements, project submissions, and specialization tracks.",
    badge: "PG Masters",
    courses: [
      { id: "1", code: "MBA-GEN", title: "Master of Business Administration (MBA)", duration: "2 Years", mode: "Online / Hybrid", status: "Active", studentsEnrolled: 620 },
      { id: "2", code: "MCA-SYS", title: "Master of Computer Applications (MCA)", duration: "2 Years", mode: "Online", status: "Active", studentsEnrolled: 340 },
      { id: "3", code: "MCOM-OL", title: "Master of Commerce (M.Com)", duration: "2 Years", mode: "Online", status: "Active", studentsEnrolled: 190 },
      { id: "4", code: "MA-SOC", title: "MA Sociology / Psychology", duration: "2 Years", mode: "Distance", status: "Active", studentsEnrolled: 155 },
    ],
  },
  "btech-mtech": {
    title: "B-Tech / M-Tech Management",
    subtitle: "Engineering & Technical Higher Education",
    description: "Manage engineering programs, lateral entry options, credit transfers for working professionals, and university affiliations.",
    badge: "Engineering",
    courses: [
      { id: "1", code: "BTECH-MECH", title: "B.Tech Mechanical Engineering (Working Exec)", duration: "3-4 Years", mode: "Work-Integrated", status: "Active", studentsEnrolled: 180 },
      { id: "2", code: "BTECH-CIV", title: "B.Tech Civil Engineering", duration: "3-4 Years", mode: "Work-Integrated", status: "Active", studentsEnrolled: 140 },
      { id: "3", code: "BTECH-EEE", title: "B.Tech Electrical & Electronics", duration: "3-4 Years", mode: "Work-Integrated", status: "Active", studentsEnrolled: 110 },
      { id: "4", code: "MTECH-CS", title: "M.Tech Computer Science", duration: "2 Years", mode: "Hybrid", status: "Active", studentsEnrolled: 85 },
    ],
  },
  diploma: {
    title: "Diploma Management",
    subtitle: "Technical, Vocational & Professional Diplomas",
    description: "Manage diploma streams, certification modules, skill evaluations, and industry accreditation info.",
    badge: "Certifications",
    courses: [
      { id: "1", code: "DIP-SAFETY", title: "Diploma in Industrial Safety & Fire Management", duration: "1 Year", mode: "Distance", status: "Active", studentsEnrolled: 290 },
      { id: "2", code: "DIP-LOG", title: "Diploma in Logistics & Supply Chain", duration: "1 Year", mode: "Online", status: "Active", studentsEnrolled: 230 },
      { id: "3", code: "DIP-AUTO", title: "Diploma in Automobile Engineering", duration: "2 Years", mode: "Hybrid", status: "Active", studentsEnrolled: 175 },
    ],
  },
  apprenticeship: {
    title: "Apprenticeship Management",
    subtitle: "Practical Skill & Industry Training Programs",
    description: "Manage industry partnership slots, apprenticeship stipends, skill certifications, and candidate placements.",
    badge: "Industry Training",
    courses: [
      { id: "1", code: "APP-IND", title: "Industrial Apprentice Training Program", duration: "6-12 Months", mode: "On-site / Practical", status: "Active", studentsEnrolled: 310 },
      { id: "2", code: "APP-TECH", title: "IT & Software Development Trainee", duration: "6 Months", mode: "Hybrid", status: "Active", studentsEnrolled: 245 },
      { id: "3", code: "APP-ELEC", title: "Electrical Technician Apprentice", duration: "1 Year", mode: "On-site", status: "Active", studentsEnrolled: 190 },
    ],
  },
};

export default function AdminCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const rawCategory = resolvedParams.category;
  const categoryKey = rawCategory === "apprenticeship-program" ? "apprenticeship" : rawCategory;
  const meta = categoryMap[categoryKey] || {
    title: `${rawCategory.replace(/-/g, " ").toUpperCase()} Management`,
    subtitle: "Course category management",
    description: "Manage courses, programs, and specifications for this category.",
    badge: "Category",
    courses: [],
  };

  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState(meta.courses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newDuration, setNewDuration] = useState("1 Year");

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCourse = {
      id: String(Date.now()),
      code: newCode.trim() || `CRS-${courses.length + 1}`,
      title: newTitle.trim(),
      duration: newDuration,
      mode: "Online / Distance",
      status: "Active" as const,
      studentsEnrolled: 0,
    };

    setCourses([newCourse, ...courses]);
    setNewTitle("");
    setNewCode("");
    setShowAddModal(false);
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <Link href="/admin/courses" style={{ color: "var(--aa-red)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}>
          &larr; Back to All Courses
        </Link>
      </div>

      <div className="tims-admin-page-header">
        <span className="tims-admin-eyebrow">{meta.badge}</span>
        <h1 className="tims-admin-heading">{meta.title}</h1>
        <p className="tims-admin-subtitle">{meta.description}</p>
      </div>

      <div className="tims-admin-stats">
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">Listed Programs</span>
          <div className="tims-admin-stat-value">{courses.length}</div>
        </div>
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">Total Enrolled</span>
          <div className="tims-admin-stat-value">
            {courses.reduce((sum, c) => sum + c.studentsEnrolled, 0)}
          </div>
        </div>
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">Category Status</span>
          <div className="tims-admin-stat-value" style={{ color: "#16a34a" }}>Published</div>
        </div>
      </div>

      <div className="tims-admin-card">
        <div className="tims-admin-card-header" style={{ flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 className="tims-admin-card-title" style={{ margin: 0 }}>
              Course Offerings
            </h2>
            <span style={{ fontSize: "0.8125rem", color: "var(--aa-muted)" }}>
              {filteredCourses.length} items found
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search course title or code..."
              className="tims-admin-input"
              style={{ width: "240px", padding: "0.5rem 0.75rem", fontSize: "0.875rem" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="button"
              className="tims-admin-save-button"
              onClick={() => setShowAddModal(true)}
              style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", whiteSpace: "nowrap" }}
            >
              + Add Program
            </button>
          </div>
        </div>

        <div className="tims-admin-table-wrap">
          <table className="tims-admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Title</th>
                <th>Duration</th>
                <th>Mode</th>
                <th>Enrolled</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700, color: "var(--aa-navy)" }}>{item.code}</td>
                    <td style={{ fontWeight: 600 }}>{item.title}</td>
                    <td>{item.duration}</td>
                    <td>{item.mode}</td>
                    <td>{item.studentsEnrolled} students</td>
                    <td>
                      <span
                        className="tims-admin-badge"
                        style={
                          item.status === "Active"
                            ? { background: "#ecfdf5", color: "#065f46" }
                            : { background: "#f3f4f6", color: "#4b5563" }
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="tims-admin-secondary-button"
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                        onClick={() => {
                          setCourses(
                            courses.map((c) =>
                              c.id === item.id
                                ? { ...c, status: c.status === "Active" ? "Draft" : "Active" }
                                : c
                            )
                          );
                        }}
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--aa-muted)" }}>
                    No course offerings found matching &quot;{search}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="tims-admin-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="tims-admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tims-admin-card-header">
              <h2 className="tims-admin-card-title" style={{ margin: 0 }}>
                Add New Program ({meta.badge})
              </h2>
              <button
                type="button"
                className="tims-admin-secondary-button"
                style={{ padding: "0.25rem 0.6rem" }}
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddCourse}>
              <div className="tims-admin-field">
                <label className="tims-admin-label">Program Code</label>
                <input
                  type="text"
                  className="tims-admin-input"
                  placeholder="e.g. BCOM-101"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                />
              </div>
              <div className="tims-admin-field">
                <label className="tims-admin-label">Course Title *</label>
                <input
                  type="text"
                  className="tims-admin-input"
                  placeholder="e.g. Bachelor of Commerce in Finance"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div className="tims-admin-field">
                <label className="tims-admin-label">Duration</label>
                <input
                  type="text"
                  className="tims-admin-input"
                  placeholder="e.g. 3 Years"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  className="tims-admin-secondary-button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="tims-admin-save-button">
                  Save Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
