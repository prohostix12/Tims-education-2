"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import styles from "./skill-courses.module.css";
import type { SkillCourseItem } from "@/lib/skillCoursesDb";

export default function AdminSkillCoursesPage() {
  const [courses, setCourses] = useState<SkillCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<SkillCourseItem | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Software & IT");
  const [formDuration, setFormDuration] = useState("3 - 6 Months");
  const [formEligibility, setFormEligibility] = useState("10th / Plus Two / Any Graduate");
  const [formDescription, setFormDescription] = useState("");
  const [formTopicsText, setFormTopicsText] = useState("");
  const [formOrder, setFormOrder] = useState(1);

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState<SkillCourseItem | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load courses from API on mount
  useEffect(() => {
    fetch("/api/skill-courses")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.courses)) {
          setCourses(data.courses);
        }
      })
      .catch((err) => console.error("Failed to load skill courses:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filtered & sorted courses
  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return courses
      .filter((c) => {
        if (!q) return true;
        return (
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.eligibility.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [courses, searchQuery]);

  // Open modal handlers
  const handleOpenAddModal = () => {
    setEditingCourse(null);
    setFormTitle("");
    setFormCategory("Software & IT");
    setFormDuration("3 - 6 Months");
    setFormEligibility("10th / Plus Two / Any Graduate");
    setFormDescription("");
    setFormTopicsText("");
    setFormOrder(courses.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: SkillCourseItem) => {
    setEditingCourse(course);
    setFormTitle(course.title || "");
    setFormCategory(course.category || "Software & IT");
    setFormDuration(course.duration || "3 - 6 Months");
    setFormEligibility(course.eligibility || "");
    setFormDescription(course.description || "");
    setFormTopicsText(Array.isArray(course.topics) ? course.topics.join("\n") : "");
    setFormOrder(course.order || 1);
    setIsModalOpen(true);
  };

  // Save Course Handler
  const handleSaveCourse = async () => {
    if (!formTitle.trim()) {
      alert("Please enter a course title.");
      return;
    }

    const topicsArray = formTopicsText
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formTitle.trim(),
      category: formCategory.trim(),
      duration: formDuration.trim(),
      eligibility: formEligibility.trim(),
      description: formDescription.trim(),
      topics: topicsArray,
      order: Number(formOrder),
    };

    if (editingCourse) {
      // Optimistic update
      setCourses((prev) =>
        prev.map((c) => (c.id === editingCourse.id ? { ...c, ...payload } : c))
      );

      try {
        const res = await fetch(`/api/skill-courses/${editingCourse.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.course) {
          setCourses((prev) =>
            prev.map((c) => (c.id === editingCourse.id ? data.course : c))
          );
        }
        showToast(`Updated skill course "${payload.title}"`);
      } catch (err) {
        console.error("Failed to update skill course:", err);
      }
    } else {
      try {
        const res = await fetch("/api/skill-courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.course) {
          setCourses((prev) => [...prev, data.course]);
        }
        showToast(`Created skill course "${payload.title}"`);
      } catch (err) {
        console.error("Failed to create skill course:", err);
      }
    }

    setIsModalOpen(false);
  };

  // Move Order Handler
  const handleMoveOrder = async (courseId: string, direction: "up" | "down") => {
    const sorted = [...courses].sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = sorted.findIndex((c) => c.id === courseId);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === sorted.length - 1) return;

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const tempOrder = sorted[idx].order;
    sorted[idx].order = sorted[targetIdx].order;
    sorted[targetIdx].order = tempOrder;

    setCourses(sorted);

    try {
      await fetch(`/api/skill-courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "reorder",
          courses: sorted.map((c) => ({ id: c.id, order: c.order })),
        }),
      });
      showToast("Updated course display order");
    } catch (err) {
      console.error("Failed to reorder courses:", err);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    const { id, title } = deleteCandidate;

    setCourses((prev) => prev.filter((c) => c.id !== id));

    try {
      await fetch(`/api/skill-courses/${id}`, { method: "DELETE" });
      showToast(`Deleted skill course "${title}"`);
    } catch (err) {
      console.error("Failed to delete skill course:", err);
    }

    setDeleteCandidate(null);
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: "#1e293b",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            zIndex: 9999,
            fontWeight: 600,
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/admin" className={styles.breadcrumbLink}>
          Admin Panel
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href="/admin/courses" className={styles.breadcrumbLink}>
          Courses
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbActive}>Skill Courses</span>
      </nav>

      {/* Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.headerMain}>
          <h1 className={styles.heading}>Skill Courses Management</h1>
          <p className={styles.subtitle}>
            Add, edit, and manage job-oriented professional skill development courses displayed on the TIMS website.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleOpenAddModal} className={styles.primaryBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Skill Course
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(37, 99, 235, 0.1)", color: "#2563eb" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{courses.length}</span>
            <span className={styles.statLabel}>Total Skill Courses</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {new Set(courses.map((c) => c.category)).size}
            </span>
            <span className={styles.statLabel}>Categories Covered</span>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className={styles.tableSection}>
        {/* Search Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.filterControls}>
            <div className={styles.searchBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search skill courses, categories, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: "70px", textAlign: "center" }}>Order</th>
                <th>Course Title &amp; Category</th>
                <th style={{ width: "160px" }}>Duration</th>
                <th style={{ width: "220px" }}>Eligibility</th>
                <th>Topics Covered</th>
                <th style={{ width: "140px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                    Loading skill courses...
                  </td>
                </tr>
              ) : filteredCourses.length > 0 ? (
                filteredCourses.map((course, idx) => (
                  <tr key={course.id}>
                    <td style={{ textAlign: "center", fontWeight: "600", color: "#64748b" }}>
                      {course.order || idx + 1}
                    </td>
                    <td>
                      <span className={styles.courseTitle}>{course.title}</span>
                      <span className={styles.courseCategory}>{course.category}</span>
                      {course.description && (
                        <p className={styles.courseDesc}>{course.description}</p>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, color: "#334155" }}>{course.duration}</td>
                    <td style={{ color: "#475569" }}>{course.eligibility}</td>
                    <td>
                      <div>
                        {Array.isArray(course.topics) && course.topics.length > 0 ? (
                          course.topics.slice(0, 3).map((topic, tIdx) => (
                            <span key={tIdx} className={styles.topicTag}>
                              • {topic}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>No topics specified</span>
                        )}
                        {course.topics && course.topics.length > 3 && (
                          <span className={styles.topicTag} style={{ background: "#e2e8f0" }}>
                            +{course.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveOrder(course.id, "up")}
                          className={styles.iconBtn}
                          title="Move Up"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        </button>
                        <button
                          disabled={idx === filteredCourses.length - 1}
                          onClick={() => handleMoveOrder(course.id, "down")}
                          className={styles.iconBtn}
                          title="Move Down"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(course)}
                          className={styles.iconBtn}
                          title="Edit Course"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(course)}
                          className={`${styles.iconBtn} ${styles.deleteIconBtn}`}
                          title="Delete Course"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.emptyCell}>
                    <div className={styles.emptyState}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4M12 16h.01" />
                      </svg>
                      <p>No skill courses found. Add your first course to show it on the site!</p>
                      <button onClick={handleOpenAddModal} className={styles.primaryBtn} style={{ marginTop: "0.5rem" }}>
                        Add Skill Course
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingCourse ? "Edit Skill Course" : "Add New Skill Course"}
              </h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Course Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Digital Marketing & Social Media"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label className={styles.formLabel}>Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Marketing & Growth, Software & IT, Finance"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label className={styles.formLabel}>Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 - 6 Months"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Eligibility Criteria</label>
                <input
                  type="text"
                  placeholder="e.g. 10th / Plus Two / Any Graduate"
                  value={formEligibility}
                  onChange={(e) => setFormEligibility(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Course Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of the course skills and outcomes..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className={styles.formTextarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Key Topics / Modules Covered (Enter 1 per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="SEO & Keyword Strategy&#10;Google Ads & PPC Campaigns&#10;Meta & Instagram Marketing"
                  value={formTopicsText}
                  onChange={(e) => setFormTopicsText(e.target.value)}
                  className={styles.formTextarea}
                />
              </div>

              <div className={styles.formGroup} style={{ width: "160px" }}>
                <label className={styles.formLabel}>Display Order</label>
                <input
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(parseInt(e.target.value) || 1)}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.secondaryBtn} onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className={styles.primaryBtn} onClick={handleSaveCourse}>
                {editingCourse ? "Save Changes" : "Create Skill Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className={styles.modalOverlay} onClick={() => setDeleteCandidate(null)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h3 className={styles.confirmTitle}>Delete Skill Course?</h3>
            <p className={styles.confirmMessage}>
              Are you sure you want to delete <strong>&quot;{deleteCandidate.title}&quot;</strong>? This action will remove it from the admin panel and the live website.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", width: "100%", marginTop: "0.5rem" }}>
              <button
                className={styles.secondaryBtn}
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => setDeleteCandidate(null)}
              >
                Cancel
              </button>
              <button
                className={styles.dangerBtn}
                style={{ flex: 1, justifyContent: "center", padding: "0.75rem" }}
                onClick={handleConfirmDelete}
              >
                Yes, Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
