"use client";

import { useEffect, useState, FormEvent, DragEvent, ChangeEvent } from "react";
import styles from "./page.module.css";

type DirectorItem = {
  id: string;
  name: string;
  role: string;
  image?: string;
  accentBg?: string;
  bio?: string;
  order: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const COLOR_PRESETS = ["#14161c", "#123061", "#1a202c", "#0f382c", "#1e293b", "#312e81"];

export default function AdminDirectorsPage() {
  const [directors, setDirectors] = useState<DirectorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id?: string;
    name: string;
    role: string;
    image: string;
    accentBg: string;
    bio: string;
    order: number;
    isPublished: boolean;
  }>({
    name: "",
    role: "",
    image: "",
    accentBg: "#14161c",
    bio: "",
    order: 0,
    isPublished: true,
  });

  const [isDragging, setIsDragging] = useState(false);

  const fetchDirectors = async () => {
    try {
      const res = await fetch("/api/directors");
      const data = await res.json();
      if (data.directors && Array.isArray(data.directors)) {
        setDirectors(data.directors);
      }
    } catch (error) {
      console.error("Failed to load directors:", error);
      setStatusMessage({ type: "error", text: "Failed to load directors from database." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectors();
  }, []);

  const openCreateModal = () => {
    setFormData({
      name: "",
      role: "",
      image: "",
      accentBg: "#14161c",
      bio: "",
      order: directors.length,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: DirectorItem) => {
    setFormData({
      id: item.id,
      name: item.name,
      role: item.role,
      image: item.image || "",
      accentBg: item.accentBg || "#14161c",
      bio: item.bio || "",
      order: typeof item.order === "number" ? item.order : 0,
      isPublished: Boolean(item.isPublished),
    });
    setIsModalOpen(true);
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setStatusMessage({ type: "error", text: "Please upload an image file (PNG, JPG, WEBP, etc.)." });
      return;
    }

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({
          ...prev,
          image: data.url,
        }));
        setStatusMessage({ type: "success", text: "Director photo uploaded successfully!" });
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to upload image." });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setStatusMessage({ type: "error", text: "Failed to upload image." });
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    if (!formData.name.trim()) {
      setStatusMessage({ type: "error", text: "Director full name is required." });
      setSaving(false);
      return;
    }

    if (!formData.role.trim()) {
      setStatusMessage({ type: "error", text: "Director role / title is required." });
      setSaving(false);
      return;
    }

    const payload = {
      name: formData.name,
      role: formData.role,
      image: formData.image,
      accentBg: formData.accentBg,
      bio: formData.bio,
      order: Number(formData.order) || 0,
      isPublished: formData.isPublished,
    };

    try {
      const isEditing = Boolean(formData.id);
      const url = isEditing ? `/api/directors/${formData.id}` : "/api/directors";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save director profile.");
      }

      setStatusMessage({
        type: "success",
        text: isEditing ? "Director profile updated successfully!" : "New director profile created successfully!",
      });

      setIsModalOpen(false);
      fetchDirectors();
    } catch (error: any) {
      console.error("Save error:", error);
      setStatusMessage({ type: "error", text: error.message || "Failed to save director profile." });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item: DirectorItem) => {
    try {
      const res = await fetch(`/api/directors/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });

      if (res.ok) {
        setDirectors((prev) =>
          prev.map((dir) => (dir.id === item.id ? { ...dir, isPublished: !dir.isPublished } : dir))
        );
      }
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/directors/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStatusMessage({ type: "success", text: "Director profile deleted successfully." });
        setDirectors((prev) => prev.filter((dir) => dir.id !== id));
      } else {
        const data = await res.json();
        setStatusMessage({ type: "error", text: data.error || "Failed to delete director profile." });
      }
    } catch (err) {
      console.error("Failed to delete director:", err);
      setStatusMessage({ type: "error", text: "Failed to delete director profile." });
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Filtered directors
  const filteredDirectors = directors.filter(
    (dir) =>
      dir.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dir.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <h1>Directors &amp; Leadership</h1>
          <p className={styles.subtitle}>
            Manage director names, roles, photo uploads, card background colors, and order.
          </p>
        </div>
        <button type="button" className={styles.createBtn} onClick={openCreateModal}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add New Director
        </button>
      </div>

      {/* Status Alert Message */}
      {statusMessage && (
        <div
          style={{
            padding: "0.85rem 1.25rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            fontWeight: 700,
            fontSize: "0.9rem",
            background: statusMessage.type === "success" ? "#dcfce7" : "#fee2e2",
            color: statusMessage.type === "success" ? "#15803d" : "#b91c1c",
            border: statusMessage.type === "success" ? "1px solid #86efac" : "1px solid #fca5a5",
          }}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Dashboard Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>Total Directors</div>
            <div className={styles.statValue}>{directors.length}</div>
          </div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff5a4e" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>Published Profiles</div>
            <div className={styles.statValue}>{directors.filter((d) => d.isPublished).length}</div>
          </div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>With Photos</div>
            <div className={styles.statValue}>{directors.filter((d) => Boolean(d.image)).length}</div>
          </div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      </div>

      {/* Search Controls */}
      <div className={styles.controlsRow}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search director by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Directors Cards Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>Loading director profiles...</div>
      ) : filteredDirectors.length === 0 ? (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>No Director Profiles Found</h3>
          <p className={styles.emptySub}>No director profiles match your search. Add a new director profile to get started.</p>
          <button type="button" className={styles.createBtn} onClick={openCreateModal}>
            Add First Director
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredDirectors.map((director) => (
            <div key={director.id} className={styles.cardItem}>
              <div
                className={styles.imageWrapper}
                style={{ backgroundColor: director.accentBg || "#14161c" }}
              >
                {director.image ? (
                  <img src={director.image} alt={director.name} className={styles.directorImg} />
                ) : (
                  <div className={styles.avatarFallback}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span style={{ fontSize: "0.75rem", marginTop: "0.25rem", opacity: 0.8 }}>No Photo Uploaded</span>
                  </div>
                )}

                <span
                  className={`${styles.statusBadge} ${director.isPublished ? styles.statusPublished : styles.statusDraft}`}
                >
                  {director.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.directorName}>{director.name}</h3>
                <div className={styles.directorRole}>{director.role}</div>
                {director.bio && <p className={styles.directorBio}>{director.bio}</p>}

                <div className={styles.colorMeta}>
                  <span className={styles.colorDot} style={{ backgroundColor: director.accentBg || "#14161c" }} />
                  <span>Card Accent: {director.accentBg || "#14161c"}</span>
                </div>

                <div className={styles.cardActions}>
                  <button type="button" className={styles.editBtn} onClick={() => openEditModal(director)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>

                  <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => handleTogglePublish(director)}
                  >
                    {director.isPublished ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => setDeleteConfirmId(director.id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{formData.id ? "Edit Director Profile" : "Add New Director Profile"}</h2>
              <button type="button" className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Full Name <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Adv ShoukathAli Pootheri"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Role / Title <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Founder & Director, Managing Director"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Drag and Drop Photo Upload Area */}
              <div className={styles.field}>
                <label className={styles.label}>Director Photo</label>
                <div
                  className={`${styles.dropZone} ${isDragging ? styles.dropZoneHover : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("director-photo-input")?.click()}
                >
                  <input
                    id="director-photo-input"
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleFileChange}
                  />
                  <svg className={styles.dropZoneIcon} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className={styles.dropZoneText}>
                    {uploading ? "Uploading photo..." : "Drag & Drop director photo here, or click to browse"}
                  </p>
                  <p className={styles.dropZoneSubtext}>PNG, JPG, WEBP formats supported</p>
                </div>

                <div style={{ marginTop: "0.5rem" }}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Or paste photo URL (e.g. /images/Shoukathali.png)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                {formData.image && (
                  <div
                    className={styles.imagePreviewBox}
                    style={{ backgroundColor: formData.accentBg || "#14161c" }}
                  >
                    <img src={formData.image} alt="Preview" className={styles.previewImg} />
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Card Background Accent Color</label>
                <div className={styles.colorPickerRow}>
                  <input
                    type="color"
                    className={styles.colorPicker}
                    value={formData.accentBg}
                    onChange={(e) => setFormData({ ...formData, accentBg: e.target.value })}
                  />
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.accentBg}
                    onChange={(e) => setFormData({ ...formData, accentBg: e.target.value })}
                  />
                </div>
                <div className={styles.colorPresetGroup}>
                  <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700 }}>Presets:</span>
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={styles.presetSwatch}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, accentBg: color })}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Director Bio / Description (Optional)</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Optional brief description of academic background, leadership, or role..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Display Order Index</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className={styles.field} style={{ justifyContent: "center" }}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    />
                    Publish profile on live website
                  </label>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn} disabled={saving || uploading}>
                  {saving ? "Saving..." : formData.id ? "Update Director Profile" : "Save Director Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirmId(null)}>
          <div className={styles.modalContent} style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.2rem", fontWeight: 800 }}>Confirm Deletion</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 1.5rem" }}>
              Are you sure you want to delete this director profile? This action cannot be undone.
            </p>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.saveBtn}
                style={{ background: "#dc2626", color: "#ffffff" }}
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
