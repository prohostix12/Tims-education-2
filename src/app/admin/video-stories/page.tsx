"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./VideoStoriesAdmin.module.css";

interface VideoStory {
  id: string;
  videoUrl: string;
  videoType: "file" | "instagram" | "youtube" | "url";
  thumbnailUrl?: string;
  duration?: string;
  isPublished: boolean;
  order: number;
  createdAt: string;
}

export default function AdminVideoStoriesPage() {
  const [stories, setStories] = useState<VideoStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");

  // Form State
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [duration, setDuration] = useState("0:30");
  const [isPublished, setIsPublished] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/video-stories");
      const data = await res.json();
      if (data.stories) {
        setStories(data.stories);
      }
    } catch (err) {
      console.error("Failed to fetch video stories:", err);
      setStatusMessage({ type: "error", text: "Failed to load video stories from database." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const detectType = (url: string) => {
    if (!url) return null;
    const lower = url.toLowerCase();
    if (lower.includes("instagram.com/reel") || lower.includes("instagram.com/p/") || lower.includes("instagr.am")) {
      return { type: "instagram", label: "📸 Instagram Reel" };
    }
    if (lower.includes("youtube.com") || lower.includes("youtu.be") || lower.includes("youtube.com/shorts")) {
      return { type: "youtube", label: "▶️ YouTube Video / Shorts" };
    }
    if (lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.includes("/api/files/")) {
      return { type: "file", label: "📄 Direct Video File" };
    }
    return { type: "url", label: "🌐 Video URL" };
  };

  const detectedInfo = detectType(videoUrl);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isThumb = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(10);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setUploadProgress(100);

      if (data.url) {
        if (isThumb) {
          setThumbnailUrl(data.url);
          setStatusMessage({ type: "success", text: "Thumbnail uploaded successfully!" });
        } else {
          setVideoUrl(data.url);
          setStatusMessage({ type: "success", text: "Video file uploaded to GridFS successfully!" });
        }
      } else {
        throw new Error(data.error || "Upload failed.");
      }
    } catch (err: any) {
      console.error("File upload failed:", err);
      setStatusMessage({ type: "error", text: err.message || "Failed to upload file." });
    } finally {
      setTimeout(() => setUploadProgress(null), 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      setStatusMessage({ type: "error", text: "Please upload a video file or paste a video URL." });
      return;
    }

    try {
      setSubmitting(true);
      setStatusMessage(null);

      const payload = {
        videoUrl,
        thumbnailUrl,
        duration: duration || "0:30",
        isPublished,
      };

      let res: Response;
      if (editingId) {
        res = await fetch(`/api/video-stories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/video-stories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save video story.");

      setStatusMessage({
        type: "success",
        text: editingId ? "Video reel updated successfully!" : "New video reel added successfully!",
      });

      resetForm();
      fetchStories();
    } catch (err: any) {
      console.error("Failed to save video story:", err);
      setStatusMessage({ type: "error", text: err.message || "Failed to save video story." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (story: VideoStory) => {
    setEditingId(story.id);
    setVideoUrl(story.videoUrl);
    setThumbnailUrl(story.thumbnailUrl || "");
    setDuration(story.duration || "0:30");
    setIsPublished(story.isPublished);
    setUploadMode(story.videoType === "file" ? "file" : "url");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video reel?")) return;

    try {
      const res = await fetch(`/api/video-stories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed.");
      setStatusMessage({ type: "success", text: "Video reel deleted successfully." });
      fetchStories();
    } catch (err) {
      console.error("Failed to delete video story:", err);
      setStatusMessage({ type: "error", text: "Failed to delete video reel." });
    }
  };

  const toggleStatus = async (story: VideoStory) => {
    try {
      const res = await fetch(`/api/video-stories/${story.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !story.isPublished }),
      });
      if (!res.ok) throw new Error("Status update failed.");
      fetchStories();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setVideoUrl("");
    setThumbnailUrl("");
    setDuration("0:30");
    setIsPublished(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  return (
    <div className={styles.adminPage}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <span className={styles.eyebrow}>REAL PEOPLE. REAL PROGRESS.</span>
          <h1 className={styles.title}>Student Success Video Reels</h1>
          <p className={styles.subtitle}>
            Add and manage student success video reels shown on the home page.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`${styles.alert} ${
            statusMessage.type === "success" ? styles.alertSuccess : styles.alertError
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Upload Card Form */}
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2>{editingId ? "Edit Video Reel" : "Add New Video Reel"}</h2>

          {/* Mode Switcher matching User Mockup Image */}
          <div className={styles.uploadModeToggle}>
            <button
              type="button"
              className={`${styles.modeBtn} ${uploadMode === "file" ? styles.modeBtnActive : ""}`}
              onClick={() => setUploadMode("file")}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <polygon points="10 12 15 15 10 18 10 12" fill="currentColor" />
              </svg>
              <span>Upload File</span>
            </button>
            <button
              type="button"
              className={`${styles.modeBtn} ${uploadMode === "url" ? styles.modeBtnActive : ""}`}
              onClick={() => setUploadMode("url")}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>Paste URL</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* File Upload Mode */}
          {uploadMode === "file" && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Select Video File (MP4, WEBM)</label>
              <div className={styles.dropzone}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={(e) => handleFileUpload(e, false)}
                  className={styles.fileInputHidden}
                  id="video-file-upload"
                />
                <label htmlFor="video-file-upload" className={styles.dropzoneLabel}>
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Click to choose video file or drag and drop</span>
                  <small>Stored directly in MongoDB GridFS database</small>
                </label>
              </div>

              {videoUrl && (
                <div className={styles.previewBox}>
                  <span>Uploaded Video:</span>
                  <video src={videoUrl} controls className={styles.videoPreview} />
                </div>
              )}
            </div>
          )}

          {/* Paste URL Mode */}
          {uploadMode === "url" && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Instagram Reel Link or YouTube Video / Shorts URL</label>
              <div className={styles.urlInputWrapper}>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/reel/C... or https://youtube.com/shorts/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className={styles.input}
                />
                {detectedInfo && (
                  <span className={styles.typeBadge}>{detectedInfo.label}</span>
                )}
              </div>
              <small className={styles.helpText}>
                Supports Instagram Reels, Instagram Posts, YouTube Videos, YouTube Shorts, or direct video links.
              </small>
            </div>
          )}

          {uploadProgress !== null && (
            <div className={styles.progressTrack}>
              <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          {/* Optional Thumbnail Upload */}
          <div className={styles.rowTwo}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Custom Thumbnail Image (Optional)</label>
              <input
                ref={thumbInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, true)}
                className={styles.input}
              />
              {thumbnailUrl && (
                <div className={styles.thumbPreviewWrap}>
                  <img src={thumbnailUrl} alt="Thumbnail preview" className={styles.thumbPreview} />
                </div>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Reel Duration Tag (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 0:45 or 1:12"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.checkboxRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <span>Publish Reel immediately on home page</span>
            </label>
          </div>

          {/* Actions */}
          <div className={styles.formActions}>
            <button type="submit" disabled={submitting} className={styles.submitBtn}>
              {submitting ? "Saving..." : editingId ? "Update Video Reel" : "+ Add Video Reel"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Video Reels List Table / Cards */}
      <div className={styles.listSection}>
        <div className={styles.listHeader}>
          <h2>Uploaded Video Reels ({stories.length})</h2>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading video reels...</div>
        ) : stories.length === 0 ? (
          <div className={styles.emptyState}>No video reels found. Add your first reel above.</div>
        ) : (
          <div className={styles.grid}>
            {stories.map((story) => (
              <div
                key={story.id}
                className={`${styles.card} ${!story.isPublished ? styles.cardDraft : ""}`}
              >
                <div className={styles.cardPreviewArea}>
                  {story.videoType === "file" ? (
                    <video src={story.videoUrl} className={styles.cardVideo} />
                  ) : story.thumbnailUrl ? (
                    <img src={story.thumbnailUrl} alt="Reel thumbnail" className={styles.cardVideo} />
                  ) : (
                    <div className={styles.fallbackThumb}>
                      <span>{story.videoType.toUpperCase()} REEL</span>
                    </div>
                  )}

                  <span className={styles.durationBadge}>{story.duration}</span>
                  <span className={styles.typeBadgeOnCard}>{story.videoType}</span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <button
                      type="button"
                      onClick={() => toggleStatus(story)}
                      className={`${styles.statusPill} ${
                        story.isPublished ? styles.statusPublished : styles.statusDraft
                      }`}
                    >
                      {story.isPublished ? "✓ Published" : "Draft (Hidden)"}
                    </button>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      onClick={() => handleEdit(story)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(story.id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
