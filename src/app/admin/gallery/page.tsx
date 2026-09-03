"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";

type GallerySection = {
  id: string;
  sectionName: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminGalleryPage() {
  const [sections, setSections] = useState<GallerySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<{
    id?: string;
    sectionName: string;
    images: string[];
  } | null>(null);

  const fetchGallerySections = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.sections) {
        setSections(data.sections);
      }
    } catch (error) {
      console.error("Failed to load gallery:", error);
      setStatusMessage({ type: "error", text: "Failed to load gallery sections." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallerySections();
  }, []);

  const openCreateModal = () => {
    setEditingSection({
      sectionName: "",
      images: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (section: GallerySection) => {
    setEditingSection({
      id: section.id,
      sectionName: section.sectionName,
      images: [...section.images],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
  };

  // Convert uploaded files to base64 data URLs
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);

    fileList.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setEditingSection((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              images: [...prev.images, result],
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same files can be re-selected if needed
    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setEditingSection((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        images: prev.images.filter((_, idx) => idx !== indexToRemove),
      };
    });
  };

  const handleSaveSection = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    if (!editingSection.sectionName.trim()) {
      alert("Please enter a section/event name.");
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const isEdit = Boolean(editingSection.id);
    const endpoint = isEdit ? `/api/gallery/${editingSection.id}` : "/api/gallery";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionName: editingSection.sectionName,
          images: editingSection.images,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save gallery section.");
      }

      setStatusMessage({
        type: "success",
        text: isEdit ? "Gallery section updated successfully!" : "New gallery section created successfully!",
      });

      closeModal();
      await fetchGallerySections();
    } catch (error: any) {
      console.error("Save error:", error);
      alert(error.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete section.");
      }

      setStatusMessage({ type: "success", text: `Gallery section "${name}" deleted successfully.` });
      await fetchGallerySections();
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete gallery section.");
    }
  };

  if (loading) {
    return (
      <div>
        <div className="tims-admin-page-header">
          <span className="tims-admin-eyebrow">Content & Events</span>
          <h1 className="tims-admin-heading">Gallery Management</h1>
          <p className="tims-admin-subtitle">Loading gallery events and photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="tims-admin-page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="tims-admin-eyebrow">Content & Events</span>
            <h1 className="tims-admin-heading">Gallery Management</h1>
            <p className="tims-admin-subtitle">
              Organize gallery events, upload multiple images under each section, and manage media content.
            </p>
          </div>
          <button
            type="button"
            className="tims-admin-save-button"
            onClick={openCreateModal}
          >
            + Add New Event Section
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={
            statusMessage.type === "success" ? "tims-admin-alert-success" : "tims-admin-alert-error"
          }
        >
          {statusMessage.text}
        </div>
      )}

      {sections.length === 0 ? (
        <div className="tims-admin-card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem" }}>No Gallery Sections Found</h3>
          <p className="tims-admin-subtitle" style={{ marginBottom: "1.5rem" }}>
            Get started by creating your first event section (e.g., &quot;Annual Sports Day&quot;, &quot;Convocation 2025&quot;).
          </p>
          <button type="button" className="tims-admin-save-button" onClick={openCreateModal}>
            + Create First Event Section
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {sections.map((section) => (
            <div className="tims-admin-card" key={section.id}>
              <div className="tims-admin-card-header">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <h2 className="tims-admin-card-title" style={{ margin: 0 }}>
                      {section.sectionName}
                    </h2>
                    <span className="tims-admin-badge" style={{ background: "#eff6ff", color: "#2563eb" }}>
                      {section.images.length} {section.images.length === 1 ? "Image" : "Images"}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className="tims-admin-secondary-button"
                    onClick={() => openEditModal(section)}
                  >
                    Edit / Add Images
                  </button>
                  <button
                    type="button"
                    className="tims-admin-danger-button"
                    onClick={() => handleDeleteSection(section.id, section.sectionName)}
                  >
                    Delete Section
                  </button>
                </div>
              </div>

              {section.images.length === 0 ? (
                <p className="tims-admin-subtitle" style={{ fontStyle: "italic" }}>
                  No images uploaded in this section yet. Click &quot;Edit / Add Images&quot; to upload photos.
                </p>
              ) : (
                <div className="tims-admin-gallery-grid">
                  {section.images.map((imgUrl, idx) => (
                    <div className="tims-admin-gallery-thumb" key={idx}>
                      <img src={imgUrl} alt={`${section.sectionName} image ${idx + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create / Edit */}
      {isModalOpen && editingSection && (
        <div className="tims-admin-modal-overlay">
          <div className="tims-admin-modal">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid var(--aa-border)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>
                {editingSection.id ? "Edit Gallery Section" : "Create New Event Section"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "var(--aa-muted)",
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveSection}>
              <div className="tims-admin-field">
                <label className="tims-admin-label" htmlFor="gallery-section-name">
                  Section Name (Event Name) *
                </label>
                <input
                  id="gallery-section-name"
                  type="text"
                  className="tims-admin-input"
                  placeholder="e.g. Convocation 2025, Campus Tour, Cultural Fest"
                  value={editingSection.sectionName}
                  onChange={(e) =>
                    setEditingSection((prev) => (prev ? { ...prev, sectionName: e.target.value } : null))
                  }
                  required
                />
              </div>

              <div className="tims-admin-field">
                <label className="tims-admin-label">Upload Images</label>
                <label className="tims-admin-dropzone">
                  <span style={{ display: "block", fontSize: "1.25rem", marginBottom: "0.3rem" }}>📁</span>
                  <span style={{ fontWeight: 600, color: "var(--aa-navy)" }}>
                    Click to select multiple images from your computer
                  </span>
                  <span style={{ display: "block", fontSize: "0.8125rem", color: "var(--aa-muted)", marginTop: "0.2rem" }}>
                    Supports PNG, JPG, JPEG, WEBP files
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              {/* Preview Grid */}
              {editingSection.images.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  <label className="tims-admin-label">
                    Section Photos ({editingSection.images.length}):
                  </label>
                  <div className="tims-admin-gallery-grid">
                    {editingSection.images.map((imgUrl, idx) => (
                      <div className="tims-admin-gallery-thumb" key={idx}>
                        <img src={imgUrl} alt={`Preview ${idx + 1}`} />
                        <button
                          type="button"
                          className="tims-admin-gallery-remove"
                          title="Remove image"
                          onClick={() => handleRemoveImage(idx)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                style={{
                  marginTop: "1.75rem",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                }}
              >
                <button
                  type="button"
                  className="tims-admin-secondary-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="tims-admin-save-button"
                  disabled={saving}
                >
                  {saving ? "Saving Section..." : editingSection.id ? "Update Section" : "Create Section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
