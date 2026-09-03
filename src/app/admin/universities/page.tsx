"use client";

import { useEffect, useState, useMemo, ChangeEvent, FormEvent } from "react";

type University = {
  id: string;
  name: string;
  slug: string;
  href: string;
  category: "degree-pg" | "10th-plus-two";
  categoryLabel: string;
  logo: string;
  image: string;
  description: string;
  about: string;
  brochure: string;
  accreditations: string[];
  courses: string[];
  status: "published" | "draft";
  createdAt?: string;
  updatedAt?: string;
};

type FormState = {
  id?: string;
  name: string;
  slug: string;
  href: string;
  category: "degree-pg" | "10th-plus-two";
  categoryLabel: string;
  logo: string;
  image: string;
  description: string;
  about: string;
  brochure: string;
  accreditationsInput: string;
  coursesInput: string;
  status: "published" | "draft";
};

const initialForm: FormState = {
  name: "",
  slug: "",
  href: "",
  category: "degree-pg",
  categoryLabel: "Degree & PG",
  logo: "",
  image: "",
  description: "",
  about: "",
  brochure: "",
  accreditationsInput: "",
  coursesInput: "",
  status: "published",
};

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all universities from API
  const fetchUniversities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/universities");
      const data = await res.json();
      if (res.ok && data.universities) {
        setUniversities(data.universities);
      } else {
        setError(data.error || "Failed to load universities.");
      }
    } catch {
      setError("Network error while loading universities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  // Filtered universities list
  const filteredUniversities = useMemo(() => {
    return universities.filter((uni) => {
      const matchesSearch =
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.courses.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = categoryFilter === "all" || uni.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || uni.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [universities, searchQuery, categoryFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = universities.length;
    const published = universities.filter((u) => u.status === "published").length;
    const degreePg = universities.filter((u) => u.category === "degree-pg").length;
    const boards = universities.filter((u) => u.category === "10th-plus-two").length;
    return { total, published, degreePg, boards };
  }, [universities]);

  // Handle open modal for create
  const handleOpenCreate = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Handle open modal for edit
  const handleOpenEdit = (uni: University) => {
    setFormData({
      id: uni.id,
      name: uni.name,
      slug: uni.slug,
      href: uni.href,
      category: uni.category,
      categoryLabel: uni.categoryLabel,
      logo: uni.logo,
      image: uni.image,
      description: uni.description,
      about: uni.about,
      brochure: uni.brochure,
      accreditationsInput: uni.accreditations.join(", "),
      coursesInput: uni.courses.join(", "),
      status: uni.status,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "name" && !isEditing) {
        const generatedSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        updated.slug = generatedSlug;
        updated.href =
          prev.category === "10th-plus-two"
            ? `/universities/10th-plus-two/${generatedSlug}`
            : `/universities/degree-pg/${generatedSlug}`;
      }
      if (name === "category") {
        updated.categoryLabel = value === "10th-plus-two" ? "10th & Plus Two" : "Degree & PG";
        if (!isEditing || !prev.href) {
          updated.href =
            value === "10th-plus-two"
              ? `/universities/10th-plus-two/${prev.slug || "new-board"}`
              : `/universities/degree-pg/${prev.slug || "new-university"}`;
        }
      }
      return updated;
    });
  };

  // File to Base64 helper
  const handleFileUpload = (field: "logo" | "image" | "brochure") => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Save / Update Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter a university name.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      href: formData.href.trim(),
      category: formData.category,
      categoryLabel: formData.categoryLabel.trim(),
      logo: formData.logo.trim(),
      image: formData.image.trim(),
      description: formData.description.trim(),
      about: formData.about.trim(),
      brochure: formData.brochure.trim(),
      accreditations: formData.accreditationsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      courses: formData.coursesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      status: formData.status,
    };

    try {
      const url = isEditing ? `/api/universities/${formData.id}` : "/api/universities";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(
          isEditing ? "University details updated successfully!" : "New university added successfully!"
        );
        setIsModalOpen(false);
        fetchUniversities();
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        alert(data.error || "Failed to save university.");
      }
    } catch {
      alert("Network error while saving university.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Confirmation Handler
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/universities/${deleteId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage("University deleted successfully.");
        setDeleteId(null);
        fetchUniversities();
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        alert(data.error || "Could not delete university.");
      }
    } catch {
      alert("Network error while deleting university.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle Status
  const handleToggleStatus = async (uni: University) => {
    const newStatus = uni.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/universities/${uni.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...uni, status: newStatus }),
      });
      if (res.ok) {
        fetchUniversities();
      }
    } catch {
      console.error("Failed to toggle status");
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="tims-admin-page-header">
        <span className="tims-admin-eyebrow">Content Management</span>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 className="tims-admin-heading">Universities &amp; Boards Management</h1>
            <p className="tims-admin-subtitle">
              Manage all partner university details, logos, campus banners, descriptions, brochures (PDF), and course offerings.
            </p>
          </div>

          <button
            type="button"
            className="tims-admin-btn tims-admin-btn-primary"
            onClick={handleOpenCreate}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <span>+</span> Add New University
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div
          style={{
            background: "#dcfce7",
            color: "#15803d",
            border: "1px solid #bbf7d0",
            padding: "0.85rem 1.25rem",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{"\u2713 " + successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            style={{ background: "none", border: "none", color: "#15803d", cursor: "pointer", fontSize: "1.1rem" }}
          >
            {"\u00d7"}
          </button>
        </div>
      )}

      {/* Overview Stats Bar */}
      <div className="tims-admin-stats">
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">Total Institutions</span>
          <span className="tims-admin-stat-value">{stats.total}</span>
        </div>
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">Published</span>
          <span className="tims-admin-stat-value" style={{ color: "#16a34a" }}>{stats.published}</span>
        </div>
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">Degree &amp; PG</span>
          <span className="tims-admin-stat-value">{stats.degreePg}</span>
        </div>
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">10th &amp; 12th Boards</span>
          <span className="tims-admin-stat-value">{stats.boards}</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div
        className="tims-admin-card"
        style={{ marginBottom: "1.5rem", padding: "1.25rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}
      >
        <div style={{ flex: 1, minWidth: "240px" }}>
          <input
            type="text"
            placeholder="Search by university name or courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.9rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: "0.6rem 0.9rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.875rem" }}
          >
            <option value="all">All Categories</option>
            <option value="degree-pg">Degree &amp; PG</option>
            <option value="10th-plus-two">10th &amp; Plus Two</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "0.6rem 0.9rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.875rem" }}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Main Data Table Card */}
      <div className="tims-admin-card">
        <h2 className="tims-admin-card-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Universities List ({filteredUniversities.length})</span>
          {loading && <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Loading from MongoDB...</span>}
        </h2>

        {error && (
          <div style={{ padding: "1rem", color: "#dc2626", background: "#fef2f2", borderRadius: "8px", marginBottom: "1rem" }}>
            {"\u26a0 " + error}
          </div>
        )}

        {!loading && filteredUniversities.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#64748b" }}>
            <p>No universities found matching your criteria.</p>
            <button
              type="button"
              className="tims-admin-btn"
              onClick={handleOpenCreate}
              style={{ marginTop: "0.75rem" }}
            >
              + Create New University
            </button>
          </div>
        ) : (
          <div className="tims-admin-table-wrap">
            <table className="tims-admin-table">
              <thead>
                <tr>
                  <th>Logo &amp; Name</th>
                  <th>Category</th>
                  <th>Brochure (PDF)</th>
                  <th>Accreditations</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUniversities.map((uni) => (
                  <tr key={uni.id}>
                    {/* Logo & Name */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "8px",
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {uni.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={uni.logo} alt={uni.name} style={{ width: "85%", height: "85%", objectFit: "contain" }} />
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>No Logo</span>
                          )}
                        </div>
                        <div>
                          <strong style={{ display: "block", color: "#0f172a", fontSize: "0.95rem" }}>{uni.name}</strong>
                          <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{uni.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "6px",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          background: uni.category === "10th-plus-two" ? "#eff6ff" : "#faf5ff",
                          color: uni.category === "10th-plus-two" ? "#2563eb" : "#7e22ce",
                        }}
                      >
                        {uni.categoryLabel}
                      </span>
                    </td>

                    {/* Brochure PDF */}
                    <td>
                      {uni.brochure ? (
                        <a
                          href={uni.brochure}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "0.82rem",
                            color: "#dc2626",
                            fontWeight: 600,
                            textDecoration: "none",
                            background: "#fef2f2",
                            padding: "0.3rem 0.6rem",
                            borderRadius: "6px",
                          }}
                        >
                          📄 PDF Brochure
                        </a>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Not Uploaded</span>
                      )}
                    </td>

                    {/* Accreditations */}
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "220px" }}>
                        {uni.accreditations.length > 0 ? (
                          uni.accreditations.slice(0, 3).map((acc, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: "0.72rem",
                                background: "#f1f5f9",
                                color: "#475569",
                                padding: "2px 6px",
                                borderRadius: "4px",
                              }}
                            >
                              {acc}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>None</span>
                        )}
                        {uni.accreditations.length > 3 && (
                          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>+{uni.accreditations.length - 3}</span>
                        )}
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(uni)}
                        style={{
                          cursor: "pointer",
                          border: "none",
                          background: uni.status === "published" ? "#dcfce7" : "#f1f5f9",
                          color: uni.status === "published" ? "#166534" : "#475569",
                          padding: "0.3rem 0.65rem",
                          borderRadius: "12px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                        }}
                      >
                        {uni.status === "published" ? "Published" : "Draft"}
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                        <button
                          type="button"
                          className="tims-admin-btn"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
                          onClick={() => handleOpenEdit(uni)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="tims-admin-btn"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem", color: "#dc2626", borderColor: "#fca5a5" }}
                          onClick={() => {
                            setDeleteId(uni.id);
                            setDeleteName(uni.name);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------- ADD / EDIT UNIVERSITY MODAL FORM ---------- */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              padding: "2rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                {isEditing ? "Edit University: " + formData.name : "Add New University"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#64748b" }}
              >
                {"\u00d7"}
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                {/* Name */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                    University Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Aligarh Muslim University"
                    value={formData.name}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                {/* Slug */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                    URL Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    placeholder="e.g. aligarh-muslim-university"
                    value={formData.slug}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="degree-pg">Degree &amp; PG</option>
                    <option value="10th-plus-two">10th &amp; Plus Two Board</option>
                  </select>
                </div>

                {/* Logo Image */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                    University Logo (URL or Upload)
                  </label>
                  <input
                    type="text"
                    name="logo"
                    placeholder="/images/aligrh_image.png or https://..."
                    value={formData.logo}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "0.35rem" }}
                  />
                  <input type="file" accept="image/*" onChange={handleFileUpload("logo")} style={{ fontSize: "0.8rem" }} />
                </div>

                {/* Campus Banner Image */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                    Campus / Banner Image (URL or Upload)
                  </label>
                  <input
                    type="text"
                    name="image"
                    placeholder="/images/aligrh_image.png or https://..."
                    value={formData.image}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "0.35rem" }}
                  />
                  <input type="file" accept="image/*" onChange={handleFileUpload("image")} style={{ fontSize: "0.8rem" }} />
                </div>

                {/* Brochure PDF File / Link */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                    University Brochure PDF (Document URL or PDF Upload)
                  </label>
                  <input
                    type="text"
                    name="brochure"
                    placeholder="https://.../brochure.pdf or upload PDF below"
                    value={formData.brochure}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "0.35rem" }}
                  />
                  <input type="file" accept="application/pdf" onChange={handleFileUpload("brochure")} style={{ fontSize: "0.8rem" }} />
                </div>

                {/* Short Description */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                    Short Description (Showcased on Cards)
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    placeholder="Short summary of university accreditations and distance degree offerings..."
                    value={formData.description}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                {/* Detailed About */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                    Detailed About Information
                  </label>
                  <textarea
                    name="about"
                    rows={3}
                    placeholder="Full detailed introduction and background about the university..."
                    value={formData.about}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                {/* Accreditations */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                    Accreditations (Comma Separated)
                  </label>
                  <input
                    type="text"
                    name="accreditationsInput"
                    placeholder="e.g. UGC Entitled, DEB Approved, NAAC A+"
                    value={formData.accreditationsInput}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                {/* Offered Courses */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                    Offered Courses (Comma Separated)
                  </label>
                  <input
                    type="text"
                    name="coursesInput"
                    placeholder="e.g. BA, B.Com, MA, MBA, M.Com"
                    value={formData.coursesInput}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                {/* Detail Page Link Href */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                    Detail Page URL Route
                  </label>
                  <input
                    type="text"
                    name="href"
                    placeholder="/universities/degree-pg/..."
                    value={formData.href}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                {/* Status */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                    Publication Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem" }}>
                <button
                  type="button"
                  className="tims-admin-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="tims-admin-btn tims-admin-btn-primary"
                >
                  {isSubmitting ? "Saving..." : isEditing ? "Update University" : "Create University"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------- DELETE CONFIRMATION MODAL ---------- */}
      {deleteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              maxWidth: "440px",
              width: "100%",
              padding: "1.75rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 0.75rem 0", color: "#dc2626" }}>
              Delete University Record?
            </h3>
            <p style={{ fontSize: "0.92rem", color: "#475569", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              Are you sure you want to delete <strong>{deleteName}</strong> from MongoDB? This action cannot be undone.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                className="tims-admin-btn"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                className="tims-admin-btn"
                onClick={handleDeleteConfirm}
                style={{ background: "#dc2626", color: "#ffffff", borderColor: "#dc2626" }}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
