"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";

type GallerySection = {
  id: string;
  sectionName: string;
  images: string[];
  homeImages?: string[];
  createdAt?: string;
  updatedAt?: string;
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

// Uploads a single file to MongoDB GridFS (/api/upload)
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

// Converts a base64 data URL to a File and uploads it to GridFS
async function uploadBase64DataUrl(dataUrl: string): Promise<string> {
  if (!dataUrl.startsWith("data:image/")) return dataUrl;
  try {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], `migrated_gallery_${Date.now()}.jpg`, { type: mime });
    return await uploadSingleFile(file);
  } catch (err) {
    console.error("Failed to migrate base64 image:", err);
    return dataUrl;
  }
}

export default function AdminGalleryPage() {
  const [sections, setSections] = useState<GallerySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<{
    id?: string;
    sectionName: string;
    images: string[];
    homeImages: string[];
  } | null>(null);

  const fetchGallerySections = async () => {
    try {
      const res = await fetch("/api/gallery");
      const resText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(resText);
      } catch {
        throw new Error(`Server returned invalid JSON: ${resText.slice(0, 100)}`);
      }
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
      homeImages: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (section: GallerySection) => {
    setEditingSection({
      id: section.id,
      sectionName: section.sectionName,
      images: [...section.images],
      homeImages: [...(section.homeImages || [])],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    setUploadingProgress(null);
  };

  // Quick toggle landing page status for an image directly from section view
  const toggleHomeImage = async (sectionId: string, imgUrl: string) => {
    const sec = sections.find((s) => s.id === sectionId);
    if (!sec) return;

    const currentHomeImages = sec.homeImages || [];
    const isMarked = currentHomeImages.includes(imgUrl);
    const newHomeImages = isMarked
      ? currentHomeImages.filter((url) => url !== imgUrl)
      : [...currentHomeImages, imgUrl];

    // Optimistic UI update
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, homeImages: newHomeImages } : s))
    );

    try {
      const res = await fetch(`/api/gallery/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeImages: newHomeImages }),
      });

      if (!res.ok) {
        throw new Error("Failed to update landing page selection");
      }
      setStatusMessage({
        type: "success",
        text: isMarked
          ? "Image removed from Landing Page gallery."
          : "⭐ Image marked to be shown on Landing Page gallery!",
      });
    } catch (err) {
      console.error("Failed to update home image:", err);
      // Revert state
      fetchGallerySections();
    }
  };

  // Upload selected image files directly to MongoDB GridFS (/api/upload)
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileList.length === 0) return;

    // Reset input value
    e.target.value = "";

    try {
      const total = fileList.length;
      const uploadedUrls: string[] = [];

      for (let i = 0; i < total; i++) {
        setUploadingProgress(`Uploading photo ${i + 1} of ${total} to GridFS...`);
        const url = await uploadSingleFile(fileList[i]);
        uploadedUrls.push(url);
      }

      setEditingSection((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        };
      });

      setStatusMessage({ type: "success", text: `Successfully uploaded ${total} image(s) to GridFS!` });
    } catch (err: any) {
      console.error("Image upload error:", err);
      alert(err.message || "Failed to upload images. Please try again.");
    } finally {
      setUploadingProgress(null);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setEditingSection((prev) => {
      if (!prev) return null;
      const removedUrl = prev.images[indexToRemove];
      return {
        ...prev,
        images: prev.images.filter((_, idx) => idx !== indexToRemove),
        homeImages: prev.homeImages.filter((url) => url !== removedUrl),
      };
    });
  };

  const handleToggleModalHomeImage = (imgUrl: string) => {
    setEditingSection((prev) => {
      if (!prev) return null;
      const isMarked = prev.homeImages.includes(imgUrl);
      return {
        ...prev,
        homeImages: isMarked
          ? prev.homeImages.filter((url) => url !== imgUrl)
          : [...prev.homeImages, imgUrl],
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

    try {
      // Auto-migrate any legacy base64 data URLs to GridFS before saving
      const hasBase64 = editingSection.images.some((img) => img.startsWith("data:image/"));
      let finalImages = editingSection.images;
      let finalHomeImages = editingSection.homeImages;

      if (hasBase64) {
        setUploadingProgress("Migrating legacy base64 photos to GridFS storage...");
        finalImages = await Promise.all(
          editingSection.images.map((img) => uploadBase64DataUrl(img))
        );
        finalHomeImages = await Promise.all(
          editingSection.homeImages.map((img) => uploadBase64DataUrl(img))
        );
      }

      const isEdit = Boolean(editingSection.id);
      const endpoint = isEdit ? `/api/gallery/${editingSection.id}` : "/api/gallery";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionName: editingSection.sectionName.trim(),
          images: finalImages,
          homeImages: finalHomeImages,
        }),
      });

      const resText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(resText);
      } catch {
        if (res.status === 413) {
          throw new Error("Request payload is too large. Images were uploaded to GridFS; please try saving again.");
        }
        throw new Error(`Server returned error (${res.status}): ${resText.slice(0, 120)}`);
      }

      if (!res.ok) {
        throw new Error(data.error || `Failed to save section (${res.status}).`);
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
      setUploadingProgress(null);
    }
  };

  const handleDeleteSection = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const resText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(resText);
      } catch {
        throw new Error(`Server returned error (${res.status}): ${resText.slice(0, 100)}`);
      }

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

  // Count total landing page marked images across all sections
  const totalLandingImages = sections.reduce(
    (sum, sec) => sum + (sec.homeImages ? sec.homeImages.length : 0),
    0
  );

  return (
    <div>
      <div className="tims-admin-page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="tims-admin-eyebrow">Content & Events</span>
            <h1 className="tims-admin-heading">Gallery Management</h1>
            <p className="tims-admin-subtitle">
              Organize gallery events, upload photos, and click <strong>&quot;⭐ Landing Page&quot;</strong> on any image to feature it on the home page gallery.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <span
              className="tims-admin-badge"
              style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "0.5rem 0.85rem",
                fontSize: "0.875rem",
                fontWeight: 700,
                border: "1px solid #86efac",
              }}
            >
              ✓ {totalLandingImages} Featured on Landing Page
            </span>
            <button
              type="button"
              className="tims-admin-save-button"
              onClick={openCreateModal}
            >
              + Add New Event Section
            </button>
          </div>
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
          {sections.map((section) => {
            const homeImagesList = section.homeImages || [];
            return (
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
                      {homeImagesList.length > 0 && (
                        <span
                          className="tims-admin-badge"
                          style={{ background: "#dcfce7", color: "#166534", border: "1px solid #86efac" }}
                        >
                          ✓ {homeImagesList.length} on Landing Page
                        </span>
                      )}
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
                    {section.images.map((imgUrl, idx) => {
                      const isLanding = homeImagesList.includes(imgUrl);
                      return (
                        <div
                          className="tims-admin-gallery-thumb"
                          key={idx}
                          style={{
                            position: "relative",
                            border: isLanding ? "3px solid #22c55e" : "1px solid var(--aa-border)",
                            borderRadius: "8px",
                            overflow: "hidden",
                          }}
                        >
                          <img src={imgUrl} alt={`${section.sectionName} image ${idx + 1}`} loading="lazy" />

                          {/* Landing Page Toggle Button (+ or green ✓) */}
                          <button
                            type="button"
                            onClick={() => toggleHomeImage(section.id, imgUrl)}
                            title={isLanding ? "Remove from Landing Page" : "Add to Landing Page"}
                            style={{
                              position: "absolute",
                              top: "6px",
                              left: "6px",
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              border: isLanding ? "2px solid #ffffff" : "1px solid rgba(255, 255, 255, 0.5)",
                              background: isLanding
                                ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                                : "rgba(15, 23, 42, 0.75)",
                              color: "#ffffff",
                              fontSize: isLanding ? "0.85rem" : "1rem",
                              fontWeight: 900,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backdropFilter: "blur(4px)",
                              boxShadow: isLanding ? "0 2px 8px rgba(22, 163, 74, 0.5)" : "0 2px 4px rgba(0, 0, 0, 0.2)",
                              zIndex: 5,
                            }}
                          >
                            {isLanding ? "✓" : "+"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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
                <label className="tims-admin-dropzone" style={{ opacity: uploadingProgress ? 0.6 : 1 }}>
                  <span style={{ display: "block", fontSize: "1.25rem", marginBottom: "0.3rem" }}>📁</span>
                  <span style={{ fontWeight: 600, color: "var(--aa-navy)" }}>
                    {uploadingProgress || "Click to select multiple images from your computer"}
                  </span>
                  <span style={{ display: "block", fontSize: "0.8125rem", color: "var(--aa-muted)", marginTop: "0.2rem" }}>
                    Supports PNG, JPG, JPEG, WEBP files (Uploaded directly to GridFS)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={Boolean(uploadingProgress) || saving}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              {uploadingProgress && (
                <div
                  style={{
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    marginBottom: "1rem",
                  }}
                >
                  ⏳ {uploadingProgress}
                </div>
              )}

              {/* Preview Grid */}
              {editingSection.images.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  <label className="tims-admin-label">
                    Section Photos ({editingSection.images.length}):
                    <span style={{ fontWeight: 400, color: "var(--aa-muted)", marginLeft: "0.5rem", fontSize: "0.8125rem" }}>
                      (Click + or ✓ button on any image to toggle Landing Page feature)
                    </span>
                  </label>
                  <div className="tims-admin-gallery-grid">
                    {editingSection.images.map((imgUrl, idx) => {
                      const isLanding = editingSection.homeImages.includes(imgUrl);
                      return (
                        <div
                          className="tims-admin-gallery-thumb"
                          key={idx}
                          style={{
                            position: "relative",
                            border: isLanding ? "3px solid #22c55e" : "1px solid var(--aa-border)",
                            borderRadius: "8px",
                            overflow: "hidden",
                          }}
                        >
                          <img src={imgUrl} alt={`Preview ${idx + 1}`} />

                          {/* Landing Page Toggle Button (+ or green ✓) */}
                          <button
                            type="button"
                            onClick={() => handleToggleModalHomeImage(imgUrl)}
                            title={isLanding ? "Remove from Landing Page" : "Add to Landing Page"}
                            style={{
                              position: "absolute",
                              top: "6px",
                              left: "6px",
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              border: isLanding ? "2px solid #ffffff" : "1px solid rgba(255, 255, 255, 0.5)",
                              background: isLanding
                                ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                                : "rgba(15, 23, 42, 0.75)",
                              color: "#ffffff",
                              fontSize: isLanding ? "0.85rem" : "1rem",
                              fontWeight: 900,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backdropFilter: "blur(4px)",
                              boxShadow: isLanding ? "0 2px 8px rgba(22, 163, 74, 0.5)" : "0 2px 4px rgba(0, 0, 0, 0.2)",
                              zIndex: 5,
                            }}
                          >
                            {isLanding ? "✓" : "+"}
                          </button>

                          <button
                            type="button"
                            className="tims-admin-gallery-remove"
                            title="Remove image"
                            onClick={() => handleRemoveImage(idx)}
                          >
                            &times;
                          </button>
                        </div>
                      );
                    })}
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
                  disabled={saving || Boolean(uploadingProgress)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="tims-admin-save-button"
                  disabled={saving || Boolean(uploadingProgress)}
                >
                  {saving
                    ? "Saving Section..."
                    : uploadingProgress
                    ? "Uploading Images..."
                    : editingSection.id
                    ? "Update Section"
                    : "Create Section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
