"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import styles from "./online-degree.module.css";

export interface CourseItem {
  id: string;
  name: string;
  eligibility: string;
  status: "Published" | "Draft";
  order: number;
}

export interface StreamItem {
  id: string;
  streamId: string;
  label: string;
  status: "Published" | "Draft";
  order: number;
  courses: CourseItem[];
}

function OnlineDegreeAdminPage() {
  const [streams, setStreams] = useState<StreamItem[]>([]);
  const [activeStreamId, setActiveStreamId] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft">("All");

  // Course Editor Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [formCourseName, setFormCourseName] = useState("");
  const [formEligibility, setFormEligibility] = useState("");
  const [formCourseStatus, setFormCourseStatus] = useState<"Published" | "Draft">("Published");
  const [formCourseOrder, setFormCourseOrder] = useState(1);

  // Stream Editor Modal State
  const [isStreamModalOpen, setIsStreamModalOpen] = useState(false);
  const [editingStreamId, setEditingStreamId] = useState<string | null>(null);
  const [formStreamLabel, setFormStreamLabel] = useState("");
  const [formStreamStatus, setFormStreamStatus] = useState<"Published" | "Draft">("Published");
  const [formStreamOrder, setFormStreamOrder] = useState(1);

  // Delete candidate state
  const [deleteCandidate, setDeleteCandidate] = useState<{
    type: "stream" | "course";
    id: string;
    name: string;
    streamId?: string;
  } | null>(null);

  // Toast Notice State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load streams from API on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem("tims_online_degree_streams");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStreams(parsed);
          setActiveStreamId(parsed[0].streamId || parsed[0].id);
        }
      }
    } catch {}

    fetch("/api/online-degree-streams")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.streams) && data.streams.length > 0) {
          setStreams(data.streams);
          if (!activeStreamId) {
            setActiveStreamId(data.streams[0].streamId || data.streams[0].id);
          }
          try {
            localStorage.setItem("tims_online_degree_streams", JSON.stringify(data.streams));
          } catch {}
        }
      })
      .catch((err) => console.error("Failed to load online degree streams:", err));
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (streams.length > 0) {
      try {
        localStorage.setItem("tims_online_degree_streams", JSON.stringify(streams));
      } catch {}
    }
  }, [streams]);

  // Active Stream object
  const activeStream = useMemo(() => {
    return (
      streams.find((s) => s.streamId === activeStreamId || s.id === activeStreamId) ||
      streams[0]
    );
  }, [streams, activeStreamId]);

  // Filtered courses for active stream
  const filteredCourses = useMemo(() => {
    if (!activeStream || !Array.isArray(activeStream.courses)) return [];

    return activeStream.courses
      .filter((c) => {
        if (!c) return false;
        const nameStr = (c.name || "").toLowerCase();
        const eligStr = (c.eligibility || "").toLowerCase();
        const queryStr = (searchQuery || "").toLowerCase();

        const matchesSearch = nameStr.includes(queryStr) || eligStr.includes(queryStr);
        const matchesStatus = statusFilter === "All" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [activeStream, searchQuery, statusFilter]);

  // Stats calculation
  const totalCoursesCount = useMemo(() => {
    return streams.reduce((acc, s) => acc + (s.courses?.length || 0), 0);
  }, [streams]);

  const publishedStreamsCount = streams.filter((s) => s.status === "Published").length;
  const draftStreamsCount = streams.filter((s) => s.status === "Draft").length;

  // Stream Modal Handlers
  const handleOpenAddStreamModal = () => {
    setEditingStreamId(null);
    setFormStreamLabel("");
    setFormStreamStatus("Published");
    setFormStreamOrder(streams.length + 1);
    setIsStreamModalOpen(true);
  };

  const handleOpenEditStreamModal = (stream: StreamItem) => {
    setEditingStreamId(stream.id || stream.streamId);
    setFormStreamLabel(stream.label);
    setFormStreamStatus(stream.status);
    setFormStreamOrder(stream.order);
    setIsStreamModalOpen(true);
  };

  const handleSaveStream = async () => {
    if (!formStreamLabel.trim()) {
      alert("Please enter a department stream label.");
      return;
    }

    const payload = {
      type: "stream",
      label: formStreamLabel.trim(),
      status: formStreamStatus,
      order: Number(formStreamOrder),
    };

    if (editingStreamId) {
      setStreams((prev) =>
        prev.map((s) =>
          s.id === editingStreamId || s.streamId === editingStreamId
            ? { ...s, label: payload.label, status: payload.status, order: payload.order }
            : s
        )
      );

      try {
        const res = await fetch(`/api/online-degree-streams/${editingStreamId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.stream) {
          setStreams((prev) =>
            prev.map((s) =>
              s.id === editingStreamId || s.streamId === editingStreamId ? data.stream : s
            )
          );
        }
        showToast(`Updated Department "${formStreamLabel.trim()}"`);
      } catch (err) {
        console.error("Failed to update stream:", err);
      }
    } else {
      try {
        const res = await fetch("/api/online-degree-streams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.stream) {
          setStreams((prev) => [...prev, data.stream]);
          setActiveStreamId(data.stream.streamId || data.stream.id);
        }
        showToast(`Created Department "${formStreamLabel.trim()}"`);
      } catch (err) {
        console.error("Failed to create stream:", err);
      }
    }

    setIsStreamModalOpen(false);
  };

  // Course Modal Handlers
  const handleOpenAddCourseModal = () => {
    if (!activeStream) {
      alert("Please select or create a stream department first.");
      return;
    }
    setEditingCourseId(null);
    setFormCourseName("");
    setFormEligibility("10+2 or Its Equivalent");
    setFormCourseStatus("Published");
    setFormCourseOrder((activeStream.courses?.length || 0) + 1);
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourseModal = (course: CourseItem) => {
    setEditingCourseId(course.id);
    setFormCourseName(course.name);
    setFormEligibility(course.eligibility);
    setFormCourseStatus(course.status);
    setFormCourseOrder(course.order);
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (statusOverride?: "Published" | "Draft") => {
    if (!activeStream) return;
    if (!formCourseName.trim()) {
      alert("Please enter a course name.");
      return;
    }

    const finalStatus = statusOverride || formCourseStatus;
    const coursePayload: CourseItem = {
      id: editingCourseId || `course-${Date.now()}`,
      name: formCourseName.trim(),
      eligibility: formEligibility.trim() || "10+2 or Its Equivalent",
      status: finalStatus,
      order: Number(formCourseOrder),
    };

    let updatedCourses: CourseItem[];
    if (editingCourseId) {
      updatedCourses = activeStream.courses.map((c) =>
        c.id === editingCourseId ? coursePayload : c
      );
    } else {
      updatedCourses = [...activeStream.courses, coursePayload];
    }

    // Optimistic update
    setStreams((prev) =>
      prev.map((s) =>
        s.id === activeStream.id || s.streamId === activeStream.streamId
          ? { ...s, courses: updatedCourses }
          : s
      )
    );

    try {
      const res = await fetch(`/api/online-degree-streams/${activeStream.id || activeStream.streamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses: updatedCourses }),
      });
      const data = await res.json();
      if (data.stream) {
        setStreams((prev) =>
          prev.map((s) =>
            s.id === activeStream.id || s.streamId === activeStream.streamId ? data.stream : s
          )
        );
      }
      showToast(
        editingCourseId
          ? `Updated "${formCourseName.trim()}"`
          : `Added course "${formCourseName.trim()}" to ${activeStream.label}`
      );
    } catch (err) {
      console.error("Failed to save course:", err);
    }

    setIsCourseModalOpen(false);
  };

  // Move Course Order Up / Down
  const handleMoveCourseOrder = async (courseId: string, direction: "up" | "down") => {
    if (!activeStream) return;
    const index = activeStream.courses.findIndex((c) => c.id === courseId);
    if (index < 0) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeStream.courses.length) return;

    const updated = [...activeStream.courses];
    const tempOrder = updated[index].order;
    updated[index].order = updated[targetIndex].order;
    updated[targetIndex].order = tempOrder;

    const tempCourse = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = tempCourse;

    setStreams((prev) =>
      prev.map((s) =>
        s.id === activeStream.id || s.streamId === activeStream.streamId
          ? { ...s, courses: updated }
          : s
      )
    );
    showToast("Reordered course");

    try {
      await fetch(`/api/online-degree-streams/${activeStream.id || activeStream.streamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses: updated }),
      });
    } catch (err) {
      console.error("Failed to persist course order:", err);
    }
  };

  // Toggle Course Status
  const handleToggleCourseStatus = async (course: CourseItem) => {
    if (!activeStream) return;
    const newStatus = course.status === "Published" ? "Draft" : "Published";
    const updated = activeStream.courses.map((c) =>
      c.id === course.id ? { ...c, status: newStatus as any } : c
    );

    setStreams((prev) =>
      prev.map((s) =>
        s.id === activeStream.id || s.streamId === activeStream.streamId
          ? { ...s, courses: updated }
          : s
      )
    );

    try {
      await fetch(`/api/online-degree-streams/${activeStream.id || activeStream.streamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses: updated }),
      });
      showToast(`Course is now ${newStatus}`);
    } catch (err) {
      console.error("Failed to toggle course status:", err);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;

    if (deleteCandidate.type === "stream") {
      const targetId = deleteCandidate.id;
      setStreams((prev) => prev.filter((s) => s.id !== targetId && s.streamId !== targetId));
      if (activeStreamId === targetId) {
        const remaining = streams.filter((s) => s.id !== targetId && s.streamId !== targetId);
        if (remaining.length > 0) setActiveStreamId(remaining[0].streamId || remaining[0].id);
      }
      setDeleteCandidate(null);

      try {
        await fetch(`/api/online-degree-streams/${targetId}`, { method: "DELETE" });
        showToast(`Deleted Department "${deleteCandidate.name}"`);
      } catch (err) {
        console.error("Failed to delete stream:", err);
      }
    } else if (deleteCandidate.type === "course" && deleteCandidate.streamId) {
      const streamId = deleteCandidate.streamId;
      const courseId = deleteCandidate.id;

      setStreams((prev) =>
        prev.map((s) =>
          s.id === streamId || s.streamId === streamId
            ? { ...s, courses: s.courses.filter((c) => c.id !== courseId) }
            : s
        )
      );
      setDeleteCandidate(null);

      try {
        await fetch(`/api/online-degree-streams/${streamId}?courseId=${courseId}`, {
          method: "DELETE",
        });
        showToast(`Deleted Course "${deleteCandidate.name}"`);
      } catch (err) {
        console.error("Failed to delete course:", err);
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/admin" className={styles.breadcrumbLink}>
          Dashboard
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href="/admin/courses" className={styles.breadcrumbLink}>
          Courses
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbActive}>Online Degree Programs</span>
      </nav>

      {/* Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.headerMain}>
          <h1 className={styles.heading}>Online Degree Programs &amp; Streams</h1>
          <p className={styles.subtitle}>
            Manage department streams and course eligibility specifications displayed on the frontend under <strong>&quot;Explore Courses by Department&quot;</strong>.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.secondaryBtn} onClick={handleOpenAddStreamModal}>
            + Add Department Stream
          </button>
          <button type="button" className={styles.primaryBtn} onClick={handleOpenAddCourseModal}>
            <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>+</span> Add Course to Stream
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Departments / Streams</span>
          <span className={styles.statValue}>{streams.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Courses</span>
          <span className={styles.statValue} style={{ color: "#E91D24" }}>
            {totalCoursesCount}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Published Streams</span>
          <span className={styles.statValue} style={{ color: "#16a34a" }}>
            {publishedStreamsCount}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Draft Streams</span>
          <span className={styles.statValue} style={{ color: "#d97706" }}>
            {draftStreamsCount}
          </span>
        </div>
      </div>

      {/* Stream Tabs Bar (Department Selector) */}
      <div className={styles.streamTabsContainer}>
        <div className={styles.streamTabsHeader}>
          <span className={styles.streamTabsTitle}>
            🏛️ Department Streams ({streams.length})
          </span>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handleOpenAddStreamModal}
            style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
          >
            + Add New Department
          </button>
        </div>

        <div className={styles.streamTabsList}>
          {streams.map((s) => {
            const isActive = s.streamId === activeStreamId || s.id === activeStreamId;
            return (
              <button
                key={s.id || s.streamId}
                type="button"
                className={`${styles.streamTabBtn} ${isActive ? styles.streamTabActive : ""}`}
                onClick={() => setActiveStreamId(s.streamId || s.id)}
              >
                <span>{s.label}</span>
                <span className={styles.streamBadge}>{s.courses?.length || 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Active Stream Details & Actions */}
      {activeStream && (
        <div className={styles.tableContainer}>
          <div className={styles.activeStreamBar}>
            <div>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#E91D24", textTransform: "uppercase" }}>
                Active Stream View
              </span>
              <h2 className={styles.activeStreamTitle}>{activeStream.label}</h2>
            </div>

            <div className={styles.activeStreamActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => handleOpenEditStreamModal(activeStream)}
                style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
              >
                ✏️ Edit Department Label
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() =>
                  setDeleteCandidate({
                    type: "stream",
                    id: activeStream.id || activeStream.streamId,
                    name: activeStream.label,
                  })
                }
                style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
              >
                🗑️ Delete Stream
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleOpenAddCourseModal}
                style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
              >
                + Add Course
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.searchGroup}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7686" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search courses or eligibility requirement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <select
                className={styles.selectControl}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "All" | "Published" | "Draft")}
                aria-label="Filter by Status"
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>

              {(searchQuery || statusFilter !== "All") && (
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("All");
                  }}
                  style={{ padding: "0.45rem 0.75rem", fontSize: "0.8rem" }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Courses Table */}
          {filteredCourses.length > 0 ? (
            <table className={styles.courseTable}>
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>Order</th>
                  <th>Course Name</th>
                  <th>Eligibility Requirement</th>
                  <th style={{ width: "120px" }}>Status</th>
                  <th style={{ width: "160px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course, idx) => (
                  <tr key={course.id}>
                    <td>
                      <div className={styles.dragHandle}>
                        <button
                          type="button"
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          onClick={() => handleMoveCourseOrder(course.id, "up")}
                          disabled={idx === 0}
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700 }}>{course.order}</span>
                        <button
                          type="button"
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          onClick={() => handleMoveCourseOrder(course.id, "down")}
                          disabled={idx === filteredCourses.length - 1}
                          title="Move Down"
                        >
                          ▼
                        </button>
                      </div>
                    </td>

                    <td>
                      <span className={styles.courseNameText}>{course.name}</span>
                    </td>

                    <td>
                      <span className={styles.eligibilityText}>{course.eligibility}</span>
                    </td>

                    <td>
                      <span
                        className={`${styles.badge} ${
                          course.status === "Published" ? styles.badgePublished : styles.badgeDraft
                        }`}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: course.status === "Published" ? "#16a34a" : "#d97706",
                          }}
                        />
                        {course.status}
                      </span>
                    </td>

                    <td>
                      <div className={styles.actionsGroup}>
                        <button
                          type="button"
                          className={styles.secondaryBtn}
                          style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                          onClick={() => handleOpenEditCourseModal(course)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => handleToggleCourseStatus(course)}
                          title={course.status === "Published" ? "Unpublish to draft" : "Publish course"}
                        >
                          {course.status === "Published" ? "👁️" : "🚀"}
                        </button>

                        <button
                          type="button"
                          className={styles.dangerBtn}
                          onClick={() =>
                            setDeleteCandidate({
                              type: "course",
                              id: course.id,
                              name: course.name,
                              streamId: activeStream.id || activeStream.streamId,
                            })
                          }
                          title="Delete course"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎓</div>
              <h3 className={styles.emptyTitle}>No courses found</h3>
              <p className={styles.emptyText}>
                No courses match your filter under <strong>{activeStream.label}</strong>. Add your first course to this department stream.
              </p>
              <button type="button" className={styles.primaryBtn} onClick={handleOpenAddCourseModal}>
                + Add Course
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stream / Department Drawer Modal */}
      {isStreamModalOpen && (
        <div className={styles.editorOverlay} onClick={() => setIsStreamModalOpen(false)}>
          <div className={styles.editorDrawer} style={{ maxWidth: "540px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.editorHeader}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E91D24", textTransform: "uppercase" }}>
                  Department Stream Editor
                </span>
                <h2 className={styles.editorTitle}>
                  {editingStreamId ? "Edit Department Stream" : "Add New Department Stream"}
                </h2>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsStreamModalOpen(false)}
                aria-label="Close Editor"
              >
                &times;
              </button>
            </div>

            <div className={styles.editorBody} style={{ gridTemplateColumns: "1fr" }}>
              <div className={styles.formCard}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Department Stream Label *</label>
                  <input
                    type="text"
                    className={styles.inputControl}
                    placeholder="e.g. Department of Management"
                    value={formStreamLabel}
                    onChange={(e) => setFormStreamLabel(e.target.value)}
                  />
                  <span className={styles.fieldHelper}>Department title displayed on tab button on user side.</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Status</label>
                    <select
                      className={styles.inputControl}
                      value={formStreamStatus}
                      onChange={(e) => setFormStreamStatus(e.target.value as "Published" | "Draft")}
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Tab Display Order</label>
                    <input
                      type="number"
                      className={styles.inputControl}
                      min="1"
                      value={formStreamOrder}
                      onChange={(e) => setFormStreamOrder(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.editorFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setIsStreamModalOpen(false)}
              >
                Cancel
              </button>
              <button type="button" className={styles.primaryBtn} onClick={handleSaveStream}>
                {editingStreamId ? "Save Stream Changes" : "Create Department Stream"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Drawer Modal */}
      {isCourseModalOpen && (
        <div className={styles.editorOverlay} onClick={() => setIsCourseModalOpen(false)}>
          <div className={styles.editorDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.editorHeader}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E91D24", textTransform: "uppercase" }}>
                  Course Specification Editor
                </span>
                <h2 className={styles.editorTitle}>
                  {editingCourseId ? `Edit Course: ${formCourseName || "Untitled"}` : `Add Course to ${activeStream?.label}`}
                </h2>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsCourseModalOpen(false)}
                aria-label="Close Editor"
              >
                &times;
              </button>
            </div>

            <div className={styles.editorBody}>
              {/* Form Column */}
              <div className={styles.formCol}>
                <div className={styles.formCard}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Course Name *</label>
                    <input
                      type="text"
                      className={styles.inputControl}
                      placeholder="e.g. BBA / BCA / Bachelor of Commerce (B.Com)"
                      value={formCourseName}
                      onChange={(e) => setFormCourseName(e.target.value)}
                    />
                    <span className={styles.fieldHelper}>Course title listed in table under active department.</span>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Eligibility Requirement *</label>
                    <input
                      type="text"
                      className={styles.inputControl}
                      placeholder="e.g. 10 + 2 / 10+2 With Science"
                      value={formEligibility}
                      onChange={(e) => setFormEligibility(e.target.value)}
                    />
                    <span className={styles.fieldHelper}>Qualification requirement to enroll in this course.</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Status</label>
                      <select
                        className={styles.inputControl}
                        value={formCourseStatus}
                        onChange={(e) => setFormCourseStatus(e.target.value as "Published" | "Draft")}
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Display Order</label>
                      <input
                        type="number"
                        className={styles.inputControl}
                        min="1"
                        value={formCourseOrder}
                        onChange={(e) => setFormCourseOrder(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* User Side Table Live Preview */}
              <div className={styles.previewCol}>
                <div className={styles.previewHeader}>
                  <span>LIVE FRONTEND TABLE PREVIEW</span>
                </div>

                <div className={styles.previewTableFrame}>
                  <div className={styles.previewTableTitle}>
                    {activeStream?.label || "Department Name"}
                  </div>
                  <table className={styles.courseTable}>
                    <thead>
                      <tr>
                        <th>Courses</th>
                        <th>Eligibility</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className={styles.courseNameText}>
                          {formCourseName.trim() || "Course Name Placeholder"}
                        </td>
                        <td className={styles.eligibilityText}>
                          {formEligibility.trim() || "Eligibility Placeholder"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "12px", border: "1px solid #e3e6ee" }}>
                  <span style={{ fontSize: "0.78rem", color: "#6b7686", display: "block" }}>
                    ℹ️ Changes saved here render instantly under the <strong>&quot;Explore Courses by Department&quot;</strong> section on the user side.
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.editorFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setIsCourseModalOpen(false)}
              >
                Cancel
              </button>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => handleSaveCourse("Draft")}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => handleSaveCourse(editingCourseId ? formCourseStatus : "Published")}
                >
                  {editingCourseId ? "Save Course Changes" : "Publish Course"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteCandidate && (
        <div className={styles.modalOverlay} onClick={() => setDeleteCandidate(null)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.confirmTitle}>
              Delete {deleteCandidate.type === "stream" ? "Department Stream" : "Course"}?
            </h3>
            <p className={styles.confirmText}>
              Are you sure you want to delete &quot;<strong>{deleteCandidate.name}</strong>&quot;?
              {deleteCandidate.type === "stream" && " This will also delete all courses under this stream department."} This action cannot be undone.
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setDeleteCandidate(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                style={{ background: "#dc2626" }}
                onClick={handleConfirmDelete}
              >
                Delete {deleteCandidate.type === "stream" ? "Stream" : "Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <span>✓</span> {toastMessage}
        </div>
      )}
    </div>
  );
}

export default function OnlineDegreeAdminPageWrapper() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "#6b7686" }}>Loading Online Degree Streams &amp; Courses...</div>}>
      <OnlineDegreeAdminPage />
    </Suspense>
  );
}
