"use client";

import { useEffect, useState, useMemo, ChangeEvent, FormEvent } from "react";
import UniversityDetailPage, { type UniversityPageDetails, type ProgramRowData } from "@/components/UniversityDetailPage/UniversityDetailPage";

type ProgramRow = {
  sl: number;
  course: string;
  specialization: string;
  fees: string;
};

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
  aboutHeading?: string;
  about: string;
  achievementsTitle?: string;
  achievementsText?: string;
  affiliationsText?: string;
  cdoeTitle?: string;
  cdoeText?: string;
  programsHeading?: string;
  programsTable?: ProgramRow[];
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
  aboutHeading: string;
  about: string;
  achievementsTitle: string;
  achievementsText: string;
  affiliationsText: string;
  cdoeTitle: string;
  cdoeText: string;
  programsHeading: string;
  programsTable: ProgramRow[];
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
  aboutHeading: "About University",
  about: "",
  achievementsTitle: "University Achievements",
  achievementsText: "",
  affiliationsText: "",
  cdoeTitle: "Centre For Distance and Online Education (CDOE)",
  cdoeText: "",
  programsHeading: "Course Fees & Eligibility",
  programsTable: [
    { sl: 1, course: "BA General", specialization: "Economics, History, English Literature, Psychology, Political Science", fees: "10+2 or its equivalent" },
    { sl: 2, course: "BBA", specialization: "General Management, Marketing, HR", fees: "10+2 or its equivalent" },
    { sl: 3, course: "B.COM", specialization: "Accountancy, Finance, Commerce", fees: "10+2 or its equivalent" },
    { sl: 4, course: "MBA", specialization: "Human Resource, Finance, Marketing, Operations", fees: "Graduation with 50% score" },
  ],
  brochure: "",
  accreditationsInput: "",
  coursesInput: "",
  status: "published",
};

// Canvas helper to downscale/compress oversized images (> 1920px or > 1.2MB)
async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < 1.2 * 1024 * 1024) {
    return file;
  }
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxDim = 1920;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(file);

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) return resolve(file);
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

// Uploads a file to MongoDB GridFS (/api/upload)
async function uploadSingleFile(file: File): Promise<string> {
  const compressed = await compressImageFile(file);
  const body = new FormData();
  body.append("file", compressed);

  const res = await fetch("/api/upload", {
    method: "POST",
    body,
  });

  const resText = await res.text();
  let data: any = {};
  try {
    data = JSON.parse(resText);
  } catch {
    if (!res.ok) {
      throw new Error(`Upload server error (${res.status}): ${resText.slice(0, 100)}`);
    }
  }

  if (!res.ok || !data.url) {
    throw new Error(data.error || `Upload failed with status ${res.status}`);
  }

  return data.url;
}

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<"logo" | "image" | "brochure" | null>(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal Form & Tab States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "about" | "cdoe" | "programs">("basic");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Page Preview Modal Overlay State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  // Handle open modal for edit
  const handleOpenEdit = (uni: University) => {
    const table: ProgramRow[] =
      Array.isArray(uni.programsTable) && uni.programsTable.length > 0
        ? uni.programsTable.map((r, i) => ({
            sl: r.sl || i + 1,
            course: r.course || "",
            specialization: Array.isArray(r.specialization)
              ? r.specialization.join(", ")
              : typeof r.specialization === "string"
              ? r.specialization
              : "",
            fees: r.fees || "",
          }))
        : initialForm.programsTable;

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
      aboutHeading: uni.aboutHeading || "About University",
      about: uni.about || "",
      achievementsTitle: uni.achievementsTitle || "University Achievements",
      achievementsText: uni.achievementsText || "",
      affiliationsText: uni.affiliationsText || uni.accreditations.join(", "),
      cdoeTitle: uni.cdoeTitle || "Centre For Distance and Online Education (CDOE)",
      cdoeText: uni.cdoeText || "",
      programsHeading: uni.programsHeading || "Course Fees & Eligibility",
      programsTable: table,
      brochure: uni.brochure,
      accreditationsInput: uni.accreditations.join(", "),
      coursesInput: uni.courses.join(", "),
      status: uni.status,
    });
    setIsEditing(true);
    setActiveTab("basic");
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

  // Program Table Row Handlers
  const handleAddProgramRow = () => {
    setFormData((prev) => {
      const nextSl = prev.programsTable.length + 1;
      return {
        ...prev,
        programsTable: [
          ...prev.programsTable,
          { sl: nextSl, course: "", specialization: "", fees: "" },
        ],
      };
    });
  };

  const handleRemoveProgramRow = (index: number) => {
    setFormData((prev) => {
      const updated = prev.programsTable.filter((_, i) => i !== index);
      return {
        ...prev,
        programsTable: updated.map((row, i) => ({ ...row, sl: i + 1 })),
      };
    });
  };

  const handleProgramRowChange = (index: number, field: keyof ProgramRow, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.programsTable];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, programsTable: updated };
    });
  };

  // File to GridFS upload helper
  const handleFileUpload = (field: "logo" | "image" | "brochure") => async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    try {
      const url = await uploadSingleFile(file);
      setFormData((prev) => ({ ...prev, [field]: url }));
    } catch (err: any) {
      alert(err.message || "Failed to upload file.");
    } finally {
      setUploadingField(null);
    }
  };

  // Save / Update Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter a university name.");
      return;
    }

    setIsSubmitting(true);

    try {
      let logoUrl = formData.logo.trim();
      let imageUrl = formData.image.trim();
      let brochureUrl = formData.brochure.trim();

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        href: formData.href.trim(),
        category: formData.category,
        categoryLabel: formData.categoryLabel.trim(),
        logo: logoUrl,
        image: imageUrl,
        description: formData.description.trim(),
        aboutHeading: formData.aboutHeading.trim(),
        about: formData.about.trim(),
        achievementsTitle: formData.achievementsTitle.trim(),
        achievementsText: formData.achievementsText.trim(),
        affiliationsText: formData.affiliationsText.trim(),
        cdoeTitle: formData.cdoeTitle.trim(),
        cdoeText: formData.cdoeText.trim(),
        programsHeading: formData.programsHeading.trim(),
        programsTable: formData.programsTable.map((r) => ({
          sl: r.sl,
          course: r.course.trim(),
          specialization: r.specialization
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          fees: r.fees.trim(),
        })),
        brochure: brochureUrl,
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

  // Construct Live Preview Data Object from Form State
  const previewData: UniversityPageDetails = useMemo(() => {
    const rows: ProgramRowData[] = formData.programsTable.map((r) => ({
      sl: r.sl,
      course: r.course,
      specialization: r.specialization
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      fees: r.fees,
    }));

    return {
      name: formData.name || "University Name",
      slug: formData.slug,
      image: formData.image || formData.logo || "/images/sureshviharuniversity.png",
      logo: formData.logo,
      description: formData.description,
      aboutHeading: formData.aboutHeading,
      about: formData.about,
      achievementsTitle: formData.achievementsTitle,
      achievementsText: formData.achievementsText,
      affiliationsText: formData.affiliationsText,
      cdoeTitle: formData.cdoeTitle,
      cdoeText: formData.cdoeText,
      programsHeading: formData.programsHeading,
      programsTable: rows,
      brochure: formData.brochure,
      accreditations: formData.accreditationsInput.split(",").map((s) => s.trim()).filter(Boolean),
      courses: formData.coursesInput.split(",").map((s) => s.trim()).filter(Boolean),
    };
  }, [formData]);

  return (
    <div>
      {/* Header Section */}
      <div className="tims-admin-page-header">
        <span className="tims-admin-eyebrow">Content Management</span>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 className="tims-admin-heading">Universities &amp; Boards Management</h1>
            <p className="tims-admin-subtitle">
              Manage partner university pages, campus images, affiliations, CDOE details, course programs &amp; fees tables, and brochures.
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
                          Edit &amp; Manage
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
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(5px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              maxWidth: "960px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
              padding: "1.75rem",
            }}
          >
            {/* Modal Header Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem" }}>
              <div>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                  {isEditing ? "Edit University Page: " + formData.name : "Create University Page"}
                </h2>
                <p style={{ margin: "3px 0 0 0", fontSize: "0.82rem", color: "#64748b" }}>
                  Fill in section details matching the SGVU page template format.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {/* Live Preview Button */}
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  style={{
                    background: "#6b21a8",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.5rem 0.9rem",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  👁️ Live Preview Page
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: "none", border: "none", fontSize: "1.6rem", cursor: "pointer", color: "#64748b" }}
                >
                  {"\u00d7"}
                </button>
              </div>
            </div>

            {/* Form Section Tabs Navigation */}
            <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
              <button
                type="button"
                onClick={() => setActiveTab("basic")}
                style={{
                  padding: "0.6rem 1rem",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  borderBottom: activeTab === "basic" ? "3px solid #6b21a8" : "3px solid transparent",
                  color: activeTab === "basic" ? "#6b21a8" : "#64748b",
                }}
              >
                1. Basic Details &amp; Branding
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("about")}
                style={{
                  padding: "0.6rem 1rem",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  borderBottom: activeTab === "about" ? "3px solid #6b21a8" : "3px solid transparent",
                  color: activeTab === "about" ? "#6b21a8" : "#64748b",
                }}
              >
                2. About &amp; Achievements
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("cdoe")}
                style={{
                  padding: "0.6rem 1rem",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  borderBottom: activeTab === "cdoe" ? "3px solid #6b21a8" : "3px solid transparent",
                  color: activeTab === "cdoe" ? "#6b21a8" : "#64748b",
                }}
              >
                3. Affiliations &amp; CDOE
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("programs")}
                style={{
                  padding: "0.6rem 1rem",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  borderBottom: activeTab === "programs" ? "3px solid #6b21a8" : "3px solid transparent",
                  color: activeTab === "programs" ? "#6b21a8" : "#64748b",
                }}
              >
                4. Programs Table &amp; Brochure
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* TAB 1: BASIC DETAILS & BRANDING */}
              {activeTab === "basic" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      University / Institution Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Suresh Gyan Vihar University"
                      value={formData.name}
                      onChange={handleFormChange}
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      URL Slug
                    </label>
                    <input
                      type="text"
                      name="slug"
                      placeholder="e.g. suresh-gyan-vihar-university"
                      value={formData.slug}
                      onChange={handleFormChange}
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>

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

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      University Logo {uploadingField === "logo" && <span style={{ color: "#2563eb" }}>(Uploading...)</span>}
                    </label>
                    <input
                      type="text"
                      name="logo"
                      placeholder="/images/sureshviharuniversity.png"
                      value={formData.logo}
                      onChange={handleFormChange}
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "0.35rem" }}
                    />
                    <input type="file" accept="image/*" disabled={uploadingField !== null} onChange={handleFileUpload("logo")} style={{ fontSize: "0.8rem" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      Campus / Banner Image {uploadingField === "image" && <span style={{ color: "#2563eb" }}>(Uploading...)</span>}
                    </label>
                    <input
                      type="text"
                      name="image"
                      placeholder="https://.../campus.jpg"
                      value={formData.image}
                      onChange={handleFormChange}
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "0.35rem" }}
                    />
                    <input type="file" accept="image/*" disabled={uploadingField !== null} onChange={handleFileUpload("image")} style={{ fontSize: "0.8rem" }} />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      Short Overview (Showcased on University Cards)
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

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      Accreditations (Comma Separated)
                    </label>
                    <input
                      type="text"
                      name="accreditationsInput"
                      placeholder="e.g. NAAC A+, UGC Approved, DEB Entitled"
                      value={formData.accreditationsInput}
                      onChange={handleFormChange}
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      Status
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
              )}

              {/* TAB 2: ABOUT & ACHIEVEMENTS */}
              {activeTab === "about" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      Detailed About Paragraph
                    </label>
                    <textarea
                      name="about"
                      rows={5}
                      placeholder="Full historical background, establishment, and vision of the university..."
                      value={formData.about}
                      onChange={handleFormChange}
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1", lineHeight: 1.6 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      Achievements Subheading
                    </label>
                    <input
                      type="text"
                      name="achievementsTitle"
                      placeholder="e.g. University Achievements"
                      value={formData.achievementsTitle}
                      onChange={handleFormChange}
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      Achievements &amp; Accreditation Details Text
                    </label>
                    <textarea
                      name="achievementsText"
                      rows={3}
                      placeholder="e.g. In 2017, the university was awarded an 'A' grade by NAAC..."
                      value={formData.achievementsText}
                      onChange={handleFormChange}
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: AFFILIATIONS & CDOE */}
              {activeTab === "cdoe" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      Affiliations Summary Text
                    </label>
                    <input
                      type="text"
                      name="affiliationsText"
                      placeholder="e.g. NAAC 'A' grade, UGC, AICTE, NBA, AIU, PCI, NCTE."
                      value={formData.affiliationsText}
                      onChange={handleFormChange}
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      CDOE Section Title
                    </label>
                    <input
                      type="text"
                      name="cdoeTitle"
                      placeholder="e.g. Centre For Distance and Online Education (CDOE)"
                      value={formData.cdoeTitle}
                      onChange={handleFormChange}
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      CDOE Details &amp; Mission Text
                    </label>
                    <textarea
                      name="cdoeText"
                      rows={5}
                      placeholder="Center for Distance and Online Education (CDOE), Suresh GyanVihar University has set out its journey..."
                      value={formData.cdoeText}
                      onChange={handleFormChange}
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1", lineHeight: 1.6 }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: PROGRAMS & FEES TABLE BUILDER + BROCHURE */}
              {activeTab === "programs" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      Programs Section Title
                    </label>
                    <input
                      type="text"
                      name="programsHeading"
                      placeholder="e.g. Course Fees &amp; Eligibility"
                      value={formData.programsHeading}
                      onChange={handleFormChange}
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>

                  {/* Programs Table Builder */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <label style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a" }}>
                        Online Programs &amp; Fees Table ({formData.programsTable.length} Courses)
                      </label>
                      <button
                        type="button"
                        onClick={handleAddProgramRow}
                        style={{
                          background: "#0f172a",
                          color: "#ffffff",
                          border: "none",
                          padding: "0.35rem 0.75rem",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        + Add Course Row
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                      {formData.programsTable.map((row, index) => (
                        <div
                          key={index}
                          style={{
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            padding: "0.85rem",
                            display: "grid",
                            gridTemplateColumns: "50px 180px 1fr 200px 40px",
                            gap: "0.75rem",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>S.No</span>
                            <input
                              type="number"
                              value={row.sl}
                              onChange={(e) => handleProgramRowChange(index, "sl", e.target.value)}
                              style={{ width: "100%", padding: "0.4rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                            />
                          </div>

                          <div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>Course</span>
                            <input
                              type="text"
                              placeholder="e.g. BA, MBA"
                              value={row.course}
                              onChange={(e) => handleProgramRowChange(index, "course", e.target.value)}
                              style={{ width: "100%", padding: "0.4rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                            />
                          </div>

                          <div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>Specialization (Comma Separated)</span>
                            <input
                              type="text"
                              placeholder="e.g. Marketing, HR, Finance"
                              value={row.specialization}
                              onChange={(e) => handleProgramRowChange(index, "specialization", e.target.value)}
                              style={{ width: "100%", padding: "0.4rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                            />
                          </div>

                          <div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>Fees / Eligibility</span>
                            <input
                              type="text"
                              placeholder="e.g. 10+2 or Graduation"
                              value={row.fees}
                              onChange={(e) => handleProgramRowChange(index, "fees", e.target.value)}
                              style={{ width: "100%", padding: "0.4rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                            />
                          </div>

                          <div style={{ textAlign: "center", marginTop: "1rem" }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveProgramRow(index)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#dc2626",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                              }}
                              title="Delete Row"
                            >
                              {"\u00d7"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Brochure PDF Upload */}
                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", color: "#334155" }}>
                      Official Brochure PDF (URL or File Upload) {uploadingField === "brochure" && <span style={{ color: "#2563eb" }}>(Uploading PDF...)</span>}
                    </label>
                    <input
                      type="text"
                      name="brochure"
                      placeholder="https://.../brochure.pdf"
                      value={formData.brochure}
                      onChange={handleFormChange}
                      style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "0.35rem" }}
                    />
                    <input type="file" accept="application/pdf,image/*" disabled={uploadingField !== null} onChange={handleFileUpload("brochure")} style={{ fontSize: "0.8rem" }} />
                  </div>
                </div>
              )}

              {/* Form Footer Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  className="tims-admin-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingField !== null}
                  className="tims-admin-btn tims-admin-btn-primary"
                >
                  {uploadingField ? "Uploading File..." : isSubmitting ? "Saving..." : isEditing ? "Update University Page" : "Create University Page"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------- LIVE PAGE PREVIEW MODAL OVERLAY ---------- */}
      {isPreviewOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#ffffff",
            zIndex: 2000,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Sticky Preview Header Control Bar */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 2100,
              background: "#0f172a",
              color: "#ffffff",
              padding: "0.85rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ background: "#22c55e", color: "#ffffff", padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
                LIVE PREVIEW MODE
              </span>
              <strong style={{ fontSize: "1rem" }}>{formData.name || "University Page Preview"}</strong>
            </div>

            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              style={{
                background: "#dc2626",
                color: "#ffffff",
                border: "none",
                padding: "0.45rem 1rem",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Close Live Preview
            </button>
          </div>

          {/* Render Full Live Student Page Component */}
          <div style={{ flex: 1, background: "#ffffff" }}>
            <UniversityDetailPage data={previewData} />
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
