"use client";

// Admin Post Graduation Programs Management
import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import styles from "./post-graduation.module.css";

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

function PostGraduationAdminPage() {
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
      const cached = localStorage.getItem("tims_post_graduation_streams");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStreams(parsed);
          setActiveStreamId(parsed[0].streamId || parsed[0].id);
        }
      }
    } catch {}

    fetch("/api/post-graduation-streams")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.streams) && data.streams.length > 0) {
          setStreams(data.streams);
          setActiveStreamId((current) => {
            if (current && data.streams.some((s: any) => s.streamId === current || s.id === current)) {
              return current;
            }
            return data.streams[0].streamId || data.streams[0].id;
          });
          try {
            localStorage.setItem("tims_post_graduation_streams", JSON.stringify(data.streams));
          } catch {}
        }
      })
      .catch((err) => console.error("Failed to load post graduation streams:", err));
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (streams.length > 0) {
      try {
        localStorage.setItem("tims_post_graduation_streams", JSON.stringify(streams));
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
    setFormStreamLabel(stream.label || "");
    setFormStreamStatus(stream.status || "Published");
    setFormStreamOrder(stream.order || 1);
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
        const res = await fetch(`/api/post-graduation-streams/${editingStreamId}`, {
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
        const res = await fetch("/api/post-graduation-streams", {
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
      alert("Please create or select a department stream first.");
      return;
    }
    setEditingCourseId(null);
    setFormCourseName("");
    setFormEligibility("");
    setFormCourseStatus("Published");
    setFormCourseOrder((activeStream.courses?.length || 0) + 1);
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourseModal = (course: CourseItem) => {
    setEditingCourseId(course.id);
    setFormCourseName(course.name || "");
    setFormEligibility(course.eligibility || "");
    setFormCourseStatus(course.status || "Published");
    setFormCourseOrder(course.order || 1);
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async () => {
    if (!formCourseName.trim()) {
      alert("Please enter a course name.");
      return;
    }

    if (!activeStream) return;
    const sId = activeStream.id || activeStream.streamId;

    const payload = {
      type: "course",
      streamId: sId,
      courseId: editingCourseId || undefined,
      name: formCourseName.trim(),
      eligibility: formEligibility.trim(),
      status: formCourseStatus,
      order: Number(formCourseOrder),
    };

    if (editingCourseId) {
      setStreams((prev) =>
        prev.map((s) => {
          if (s.id === sId || s.streamId === sId) {
            return {
              ...s,
              courses: s.courses.map((c) =>
                c.id === editingCourseId
                  ? {
                      ...c,
                      name: payload.name,
                      eligibility: payload.eligibility,
                      status: payload.status,
                      order: payload.order,
                    }
                  : c
              ),
            };
          }
          return s;
        })
      );

      try {
        const res = await fetch(`/api/post-graduation-streams/${sId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.stream) {
          setStreams((prev) =>
            prev.map((s) => (s.id === sId || s.streamId === sId ? data.stream : s))
          );
        }
        showToast(`Updated course "${formCourseName.trim()}"`);
      } catch (err) {
        console.error("Failed to update course:", err);
      }
    } else {
      try {
        const res = await fetch("/api/post-graduation-streams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.stream) {
          setStreams((prev) =>
            prev.map((s) => (s.id === sId || s.streamId === sId ? data.stream : s))
          );
        }
        showToast(`Added course "${formCourseName.trim()}"`);
      } catch (err) {
        console.error("Failed to add course:", err);
      }
    }

    setIsCourseModalOpen(false);
  };

  // Move course order
  const handleMoveCourseOrder = async (courseId: string, direction: "up" | "down") => {
    if (!activeStream || !activeStream.courses) return;
    const coursesCopy = [...activeStream.courses].sort((a, b) => a.order - b.order);
    const index = coursesCopy.findIndex((c) => c.id === courseId);
    if (index === -1) return;

    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === coursesCopy.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const tempOrder = coursesCopy[index].order;
    coursesCopy[index].order = coursesCopy[targetIndex].order;
    coursesCopy[targetIndex].order = tempOrder;

    const sId = activeStream.id || activeStream.streamId;

    setStreams((prev) =>
      prev.map((s) => {
        if (s.id === sId || s.streamId === sId) {
          return { ...s, courses: coursesCopy };
        }
        return s;
      })
    );

    try {
      await fetch(`/api/post-graduation-streams/${sId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "reorder_courses",
          courses: coursesCopy.map((c) => ({ id: c.id, order: c.order })),
        }),
      });
      showToast("Updated course order");
    } catch (err) {
      console.error("Failed to reorder courses:", err);
    }
  };

  // Confirm Delete Handler
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;

    if (deleteCandidate.type === "stream") {
      const sId = deleteCandidate.id;
      setStreams((prev) => prev.filter((s) => s.id !== sId && s.streamId !== sId));
      if (activeStreamId === sId) {
        const remaining = streams.filter((s) => s.id !== sId && s.streamId !== sId);
        setActiveStreamId(remaining.length > 0 ? remaining[0].streamId || remaining[0].id : "");
      }

      try {
        await fetch(`/api/post-graduation-streams/${sId}`, {
          method: "DELETE",
        });
        showToast(`Deleted Department "${deleteCandidate.name}"`);
      } catch (err) {
        console.error("Failed to delete stream:", err);
      }
    } else if (deleteCandidate.type === "course") {
      const sId = deleteCandidate.streamId || (activeStream ? activeStream.id || activeStream.streamId : "");
      const cId = deleteCandidate.id;

      setStreams((prev) =>
        prev.map((s) => {
          if (s.id === sId || s.streamId === sId) {
            return {
              ...s,
              courses: s.courses.filter((c) => c.id !== cId),
            };
          }
          return s;
        })
      );

      try {
        await fetch(`/api/post-graduation-streams/${sId}?courseId=${cId}`, {
          method: "DELETE",
        });
        showToast(`Deleted course "${deleteCandidate.name}"`);
      } catch (err) {
        console.error("Failed to delete course:", err);
      }
    }

    setDeleteCandidate(null);
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
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
          gap: "8px"
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
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
        <span className={styles.breadcrumbLink}>Courses</span>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbActive}>Post Graduation Programs</span>
      </nav>

      {/* Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.headerMain}>
          <h1 className={styles.heading}>Post Graduation Programs</h1>
          <p className={styles.subtitle}>
            Manage Post Graduation departments, streams, and course eligibility tables shown in the user panel.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={handleOpenAddStreamModal}
            className={styles.secondaryBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Department Stream
          </button>
          <button
            onClick={handleOpenAddCourseModal}
            className={styles.primaryBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Course
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(233, 29, 36, 0.1)", color: "#E91D24" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{streams.length}</span>
            <span className={styles.statLabel}>Total Departments</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(37, 99, 235, 0.1)", color: "#2563eb" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalCoursesCount}</span>
            <span className={styles.statLabel}>Total PG Courses</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{publishedStreamsCount}</span>
            <span className={styles.statLabel}>Published Streams</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{draftStreamsCount}</span>
            <span className={styles.statLabel}>Draft Streams</span>
          </div>
        </div>
      </div>

      {/* Stream Tabs Bar */}
      <div className={styles.streamsSection}>
        <div className={styles.streamTabsHeader}>
          <h3 className={styles.streamTabsTitle}>Select Department Stream</h3>
          <span className={styles.streamCountBadge}>{streams.length} Streams</span>
        </div>
        <div className={styles.streamTabs}>
          {streams.map((stream) => {
            const sId = stream.streamId || stream.id;
            const isActive = activeStreamId === sId;

            return (
              <div
                key={sId}
                className={`${styles.streamTab} ${isActive ? styles.activeTab : ""}`}
                onClick={() => setActiveStreamId(sId)}
              >
                <span className={styles.streamTabLabel}>{stream.label}</span>
                <span className={styles.streamTabBadge}>{stream.courses?.length || 0}</span>
                <span
                  className={`${styles.statusDot} ${
                    stream.status === "Published" ? styles.publishedDot : styles.draftDot
                  }`}
                  title={`Status: ${stream.status}`}
                />
                <button
                  className={styles.tabActionBtn}
                  title="Edit Department Stream"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditStreamModal(stream);
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </button>
                <button
                  className={`${styles.tabActionBtn} ${styles.dangerHover}`}
                  title="Delete Department Stream"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteCandidate({
                      type: "stream",
                      id: stream.id,
                      name: stream.label,
                    });
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Active Stream Courses */}
      <div className={styles.tableSection}>
        {/* Controls Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.activeStreamHeaderInfo}>
            <h2 className={styles.activeStreamTitle}>{activeStream?.label || "No Stream Selected"}</h2>
            <span
              className={`${styles.badge} ${
                activeStream?.status === "Published" ? styles.publishedBadge : styles.draftBadge
              }`}
            >
              {activeStream?.status || "Draft"}
            </span>
          </div>

          <div className={styles.filterControls}>
            <div className={styles.searchBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search courses or eligibility..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={styles.selectFilter}
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published Only</option>
                <option value="Draft">Draft Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: "70px", textAlign: "center" }}>Order</th>
                <th>Course Name</th>
                <th>Eligibility Criteria</th>
                <th style={{ width: "120px" }}>Status</th>
                <th style={{ width: "160px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, idx) => (
                  <tr key={course.id}>
                    <td style={{ textAlign: "center", fontWeight: "600", color: "#64748b" }}>
                      {course.order}
                    </td>
                    <td>
                      <span className={styles.courseName}>{course.name}</span>
                    </td>
                    <td>
                      <span className={styles.eligibilityText}>{course.eligibility}</span>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          course.status === "Published"
                            ? styles.publishedBadge
                            : styles.draftBadge
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveCourseOrder(course.id, "up")}
                          className={styles.iconBtn}
                          title="Move Up"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="18 15 12 9 6 15"></polyline>
                          </svg>
                        </button>
                        <button
                          disabled={idx === filteredCourses.length - 1}
                          onClick={() => handleMoveCourseOrder(course.id, "down")}
                          className={styles.iconBtn}
                          title="Move Down"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleOpenEditCourseModal(course)}
                          className={styles.iconBtn}
                          title="Edit Course"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            setDeleteCandidate({
                              type: "course",
                              id: course.id,
                              name: course.name,
                              streamId: activeStream?.id || activeStream?.streamId,
                            })
                          }
                          className={`${styles.iconBtn} ${styles.deleteIconBtn}`}
                          title="Delete Course"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={styles.emptyCell}>
                    <div className={styles.emptyState}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 8v4M12 16h.01"></path>
                      </svg>
                      <p>No PG courses found for this department stream.</p>
                      <button
                        onClick={handleOpenAddCourseModal}
                        className={styles.secondaryBtn}
                        style={{ marginTop: "0.5rem" }}
                      >
                        Add First PG Course
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stream Modal */}
      {isStreamModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsStreamModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingStreamId ? "Edit Department Stream" : "Add New Department Stream"}
              </h3>
              <button className={styles.closeBtn} onClick={() => setIsStreamModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Department / Stream Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Traditional Stream or Department of Science"
                  value={formStreamLabel || ""}
                  onChange={(e) => setFormStreamLabel(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label className={styles.formLabel}>Status</label>
                  <select
                    value={formStreamStatus || "Published"}
                    onChange={(e) => setFormStreamStatus(e.target.value as any)}
                    className={styles.formSelect}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label className={styles.formLabel}>Display Order</label>
                  <input
                    type="number"
                    value={formStreamOrder ?? 1}
                    onChange={(e) => setFormStreamOrder(parseInt(e.target.value) || 1)}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.secondaryBtn} onClick={() => setIsStreamModalOpen(false)}>
                Cancel
              </button>
              <button className={styles.primaryBtn} onClick={handleSaveStream}>
                {editingStreamId ? "Save Changes" : "Create Department"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Modal Drawer with Live Preview */}
      {isCourseModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsCourseModalOpen(false)}>
          <div
            className={`${styles.modalCard} ${styles.drawerModal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingCourseId ? "Edit Post Graduation Course" : "Add New Post Graduation Course"}
              </h3>
              <button className={styles.closeBtn} onClick={() => setIsCourseModalOpen(false)}>
                &times;
              </button>
            </div>

            <div className={styles.drawerGrid}>
              {/* Left Column: Form Controls */}
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Department Stream</label>
                  <input
                    type="text"
                    disabled
                    value={activeStream?.label || ""}
                    className={`${styles.formInput} ${styles.disabledInput}`}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Course Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. M.Com (Master of Commerce)"
                    value={formCourseName || ""}
                    onChange={(e) => setFormCourseName(e.target.value)}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Eligibility Criteria *</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Any Recognized Graduation with min 50% aggregate"
                    value={formEligibility || ""}
                    onChange={(e) => setFormEligibility(e.target.value)}
                    className={styles.formTextarea}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.formLabel}>Publication Status</label>
                    <select
                      value={formCourseStatus || "Published"}
                      onChange={(e) => setFormCourseStatus(e.target.value as any)}
                      className={styles.formSelect}
                    >
                      <option value="Published">Published (Visible to users)</option>
                      <option value="Draft">Draft (Admin hidden)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.formLabel}>Sorting Order</label>
                    <input
                      type="number"
                      value={formCourseOrder ?? 1}
                      onChange={(e) => setFormCourseOrder(parseInt(e.target.value) || 1)}
                      className={styles.formInput}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: User-Side Live Table Row Preview */}
              <div className={styles.previewContainer}>
                <div className={styles.previewHeader}>
                  <span className={styles.previewTitle}>Live User Panel Table Preview</span>
                  <span className={styles.previewSub}>
                    Exact rendering in Post Graduation course list table
                  </span>
                </div>

                <div className={styles.previewCard}>
                  <div className={styles.previewTableWrapper}>
                    <table className={styles.previewTable}>
                      <thead>
                        <tr>
                          <th style={{ width: "35%" }}>Course</th>
                          <th>Eligibility</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className={styles.previewCourseCell}>
                            {formCourseName || "Course Name Preview"}
                          </td>
                          <td className={styles.previewEligibilityCell}>
                            {formEligibility || "Eligibility requirements will be displayed here..."}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.secondaryBtn} onClick={() => setIsCourseModalOpen(false)}>
                Cancel
              </button>
              <button className={styles.primaryBtn} onClick={handleSaveCourse}>
                {editingCourseId ? "Update Course" : "Add Course"}
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E91D24" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3 className={styles.confirmTitle}>
              Delete {deleteCandidate.type === "stream" ? "Department Stream" : "Course"}?
            </h3>
            <p className={styles.confirmMessage}>
              Are you sure you want to delete <strong>"{deleteCandidate.name}"</strong>?{" "}
              {deleteCandidate.type === "stream" &&
                "Deleting a department stream will also remove all associated courses in it."}
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.secondaryBtn} onClick={() => setDeleteCandidate(null)}>
                Cancel
              </button>
              <button className={styles.deleteConfirmBtn} onClick={handleConfirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PostGraduationAdminPageWrapper() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "#64748b" }}>Loading Post Graduation Management...</div>}>
      <PostGraduationAdminPage />
    </Suspense>
  );
}
