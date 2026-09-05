"use client";

import { useEffect, useState, FormEvent, DragEvent, ChangeEvent } from "react";
import styles from "./page.module.css";

type SuccessStoryItem = {
  id: string;
  title: string;
  caption: string;
  category: string;
  dateLocation: string;
  imageSrc: string;
  imageAlt: string;
  tagBg: string;
  tagColor: string;
  studentName?: string;
  role?: string;
  order: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminSuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    caption: string;
    category: string;
    dateLocation: string;
    imageSrc: string;
    imageAlt: string;
    tagBg: string;
    tagColor: string;
    studentName: string;
    role: string;
    order: number;
    isPublished: boolean;
  }>({
    title: "",
    caption: "",
    category: "CONVOCATION EVENT",
    dateLocation: "",
    imageSrc: "",
    imageAlt: "",
    tagBg: "#ffe4e2",
    tagColor: "#dc2626",
    studentName: "",
    role: "",
    order: 0,
    isPublished: true,
  });

  // Drag and Drop Hover State
  const [isDragging, setIsDragging] = useState(false);

  const fetchStories = async () => {
    try {
      const res = await fetch("/api/success-stories");
      const data = await res.json();
      if (data.stories && Array.isArray(data.stories)) {
        setStories(data.stories);
      }
    } catch (error) {
      console.error("Failed to load success stories:", error);
      setStatusMessage({ type: "error", text: "Failed to load success stories from database." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const openCreateModal = () => {
    setFormData({
      title: "",
      caption: "",
      category: "CONVOCATION EVENT",
      dateLocation: "",
      imageSrc: "",
      imageAlt: "",
      tagBg: "#ffe4e2",
      tagColor: "#dc2626",
      studentName: "",
      role: "",
      order: stories.length,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: SuccessStoryItem) => {
    setFormData({
      id: item.id,
      title: item.title,
      caption: item.caption,
      category: item.category,
      dateLocation: item.dateLocation,
      imageSrc: item.imageSrc,
      imageAlt: item.imageAlt || "",
      tagBg: item.tagBg || "#ffe4e2",
      tagColor: item.tagColor || "#dc2626",
      studentName: item.studentName || "",
      role: item.role || "",
      order: typeof item.order === "number" ? item.order : 0,
      isPublished: Boolean(item.isPublished),
    });
    setIsModalOpen(true);
  };

  // Upload handler for drag & drop or file selector
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
          imageSrc: data.url,
          imageAlt: prev.imageAlt || file.name.replace(/\.[^/.]+$/, ""),
        }));
        setStatusMessage({ type: "success", text: "Image uploaded successfully!" });
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

    if (!formData.title.trim()) {
      setStatusMessage({ type: "error", text: "Base Heading (Title) is required." });
      setSaving(false);
      return;
    }

    if (!formData.caption.trim()) {
      setStatusMessage({ type: "error", text: "Description (Caption) is required." });
      setSaving(false);
      return;
    }

    if (!formData.category.trim()) {
      setStatusMessage({ type: "error", text: "Event Name / Category Tag is required." });
      setSaving(false);
      return;
    }

    if (!formData.imageSrc.trim()) {
      setStatusMessage({ type: "error", text: "Image is required. Upload a file or provide a valid URL." });
      setSaving(false);
      return;
    }

    const payload = {
      title: formData.title,
      caption: formData.caption,
      category: formData.category,
      dateLocation: formData.dateLocation,
      imageSrc: formData.imageSrc,
      imageAlt: formData.imageAlt || formData.title,
      tagBg: formData.tagBg,
      tagColor: formData.tagColor,
      studentName: formData.studentName,
      role: formData.role,
      order: Number(formData.order) || 0,
      isPublished: formData.isPublished,
    };

    try {
      const isEditing = Boolean(formData.id);
      const url = isEditing ? `/api/success-stories/${formData.id}` : "/api/success-stories";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save story card.");
      }

      setStatusMessage({
        type: "success",
        text: isEditing ? "Story card updated successfully!" : "New story card created successfully!",
      });

      setIsModalOpen(false);
      fetchStories();
    } catch (error: any) {
      console.error("Save error:", error);
      setStatusMessage({ type: "error", text: error.message || "Failed to save story card." });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item: SuccessStoryItem) => {
    try {
      const res = await fetch(`/api/success-stories/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });

      if (res.ok) {
        setStories((prev) =>
          prev.map((story) => (story.id === item.id ? { ...story, isPublished: !story.isPublished } : story))
        );
      }
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/success-stories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStatusMessage({ type: "success", text: "Story card deleted successfully." });
        setStories((prev) => prev.filter((story) => story.id !== id));
      } else {
        const data = await res.json();
        setStatusMessage({ type: "error", text: data.error || "Failed to delete story card." });
      }
    } catch (err) {
      console.error("Failed to delete story card:", err);
      setStatusMessage({ type: "error", text: "Failed to delete story card." });
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Categories list
  const categoriesList = Array.from(new Set(stories.map((s) => s.category).filter(Boolean)));

  // Filtered stories
  const filteredStories = stories.filter((story) => {
    const matchesCategory = categoryFilter === "all" || story.category === categoryFilter;
    const matchesSearch =
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.dateLocation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.container}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <h1>Real Impact &amp; Success Stories</h1>
          <p className={styles.subtitle}>
            Manage convocation photos, event details, spot admission drives, and recognition card decks.
          </p>
        </div>
        <button type="button" className={styles.createBtn} onClick={openCreateModal}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add New Story Card
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
            <div className={styles.statLabel}>Total Cards</div>
            <div className={styles.statValue}>{stories.length}</div>
          </div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff5a4e" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>Published Cards</div>
            <div className={styles.statValue}>{stories.filter((s) => s.isPublished).length}</div>
          </div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>Event Categories</div>
            <div className={styles.statValue}>{categoriesList.length}</div>
          </div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
        </div>
      </div>

      {/* Controls Bar */}
      <div className={styles.controlsRow}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by event title, location, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            className={styles.selectFilter}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories ({stories.length})</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards List Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>Loading success story cards...</div>
      ) : filteredStories.length === 0 ? (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>No Success Stories Found</h3>
          <p className={styles.emptySub}>No story cards match your search criteria. Create a new card to get started.</p>
          <button type="button" className={styles.createBtn} onClick={openCreateModal}>
            Add First Card
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredStories.map((story) => (
            <div key={story.id} className={styles.cardItem}>
              <div className={styles.imagePreviewWrapper}>
                {story.imageSrc ? (
                  <img src={story.imageSrc} alt={story.imageAlt || story.title} className={styles.cardImage} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8" }}>
                    No Image
                  </div>
                )}
                <span
                  className={styles.categoryBadge}
                  style={{ backgroundColor: story.tagBg || "#ffe4e2", color: story.tagColor || "#dc2626" }}
                >
                  {story.category}
                </span>

                <span
                  className={`${styles.statusBadge} ${story.isPublished ? styles.statusPublished : styles.statusDraft}`}
                >
                  {story.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <div className={styles.cardContent}>
                {story.dateLocation && <div className={styles.dateLocText}>{story.dateLocation}</div>}
                <h3 className={styles.cardTitle}>{story.title}</h3>
                <p className={styles.cardCaption}>{story.caption}</p>

                {(story.studentName || story.role) && (
                  <div className={styles.studentMeta}>
                    {story.studentName && <span className={styles.studentNameText}>{story.studentName}</span>}
                    {story.role && <span className={styles.studentRoleText}>({story.role})</span>}
                  </div>
                )}

                <div className={styles.cardActions}>
                  <button type="button" className={styles.editBtn} onClick={() => openEditModal(story)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>

                  <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => handleTogglePublish(story)}
                    title="Toggle public visibility"
                  >
                    {story.isPublished ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => setDeleteConfirmId(story.id)}
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
              <h2>{formData.id ? "Edit Success Story Card" : "Add New Success Story Card"}</h2>
              <button type="button" className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Event Name / Category Tag <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. CONVOCATION EVENT, ADMISSION DRIVE"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Event Location &amp; Date</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Tirur Auditorium · Class of 2025"
                    value={formData.dateLocation}
                    onChange={(e) => setFormData({ ...formData, dateLocation: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Base Heading (Title) <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Grand Annual Convocation & Graduate Excellence Ceremony"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Description (Caption) <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe the event, graduates, awards or spot admission highlights..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  required
                />
              </div>

              {/* Drag and Drop File Upload Area */}
              <div className={styles.field}>
                <label className={styles.label}>
                  Card Image <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div
                  className={`${styles.dropZone} ${isDragging ? styles.dropZoneHover : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-upload-input")?.click()}
                >
                  <input
                    id="file-upload-input"
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
                    {uploading ? "Uploading image..." : "Drag & Drop image here, or click to browse"}
                  </p>
                  <p className={styles.dropZoneSubtext}>PNG, JPG, WEBP formats supported</p>
                </div>

                {/* Fallback Image URL Input */}
                <div style={{ marginTop: "0.5rem" }}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Or paste image URL (e.g. /images/stories/convocation.jpg)"
                    value={formData.imageSrc}
                    onChange={(e) => setFormData({ ...formData, imageSrc: e.target.value })}
                  />
                </div>

                {formData.imageSrc && (
                  <div className={styles.imagePreviewBox}>
                    <img src={formData.imageSrc} alt="Preview" className={styles.previewImg} />
                  </div>
                )}
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Student / Honoree Name <span className={styles.optionalTag}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Ananya Nair & Graduates"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Role / Alumni Details <span className={styles.optionalTag}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Online BBA Alumni"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Category Tag Background</label>
                  <div className={styles.colorPickerRow}>
                    <input
                      type="color"
                      className={styles.colorPicker}
                      value={formData.tagBg}
                      onChange={(e) => setFormData({ ...formData, tagBg: e.target.value })}
                    />
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.tagBg}
                      onChange={(e) => setFormData({ ...formData, tagBg: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Category Tag Color</label>
                  <div className={styles.colorPickerRow}>
                    <input
                      type="color"
                      className={styles.colorPicker}
                      value={formData.tagColor}
                      onChange={(e) => setFormData({ ...formData, tagColor: e.target.value })}
                    />
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.tagColor}
                      onChange={(e) => setFormData({ ...formData, tagColor: e.target.value })}
                    />
                  </div>
                </div>
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
                    Publish card on live website
                  </label>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn} disabled={saving || uploading}>
                  {saving ? "Saving..." : formData.id ? "Update Story Card" : "Save Story Card"}
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
              Are you sure you want to delete this success story card? This action cannot be undone.
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
                Delete Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
