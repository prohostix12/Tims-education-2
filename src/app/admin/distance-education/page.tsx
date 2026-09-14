"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import styles from "./page.module.css";
import { DistanceEducationData } from "@/types/distanceEducation";

export default function AdminDistanceEducationPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState<DistanceEducationData>({
    videoUrl: "/images/stories/Campus_video1.mp4",
    videoType: "upload",
    heading: "Best Distance Education Centre in Kerala \u2013 Building Futures with Flexible Learning",
    subheading: "Why Students Choose Us",
    badgeValue: "18+ Years",
    badgeLabel: "Guiding Students Forward",
    highlights: [
      "Simple Admission Procedures",
      "Clear, Ongoing Support",
      "Experienced Mentors",
      "Reliable University Tie-ups",
    ],
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/distance-education");
      const data = await res.json();
      if (data.settings) {
        setFormData(data.settings);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      setStatusMessage({ type: "error", text: "Failed to load distance education settings." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({
          ...prev,
          videoUrl: data.url,
          videoType: "upload",
        }));
        setStatusMessage({ type: "success", text: "Video uploaded successfully to MongoDB GridFS!" });
      } else {
        throw new Error(data.error || "Video upload failed.");
      }
    } catch (err: any) {
      console.error("Video upload error:", err);
      setStatusMessage({ type: "error", text: err.message || "Failed to upload video file." });
    } finally {
      setUploading(false);
    }
  };

  const handleHighlightChange = (index: number, value: string) => {
    const updated = [...formData.highlights];
    updated[index] = value;
    setFormData({ ...formData, highlights: updated });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.videoUrl.trim()) {
      setStatusMessage({ type: "error", text: "Please provide or upload a video URL." });
      return;
    }

    try {
      setSaving(true);
      setStatusMessage(null);

      const res = await fetch("/api/distance-education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings.");

      setStatusMessage({
        type: "success",
        text: "Distance Education section settings updated successfully! View changes live on the homepage.",
      });
      if (data.settings) {
        setFormData(data.settings);
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setStatusMessage({ type: "error", text: err.message || "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  // Helper to extract Instagram Reel embed ID or YouTube Video ID
  const getEmbedUrl = (url: string) => {
    if (url.includes("instagram.com")) {
      const match = url.match(/reel\/([A-Za-z0-9_-]+)/);
      if (match && match[1]) {
        return `https://www.instagram.com/reel/${match[1]}/embed`;
      }
    }
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const match = url.match(/(?:v=|\/embed\/|\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1`;
      }
    }
    return url;
  };

  const isEmbed = formData.videoUrl.includes("instagram.com") || formData.videoUrl.includes("youtube.com") || formData.videoUrl.includes("youtu.be");

  return (
    <div className={styles.adminPage}>
      <div className={styles.headerRow}>
        <span className={styles.eyebrow}>SECTION SETTINGS</span>
        <h1 className={styles.title}>Distance Education Section Video</h1>
        <p className={styles.subtitle}>
          Manage the video player and section content for &quot;Best Distance Education Centre in Kerala&quot; on the homepage.
        </p>
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

      {loading ? (
        <div className={styles.card} style={{ textAlign: "center", color: "#64748b" }}>
          Loading section settings...
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Video Settings Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>🎥 Section Video Configuration</h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>Option A: Upload Video File (GridFS Database)</label>
              <div className={styles.uploadBox}>
                <label className={styles.uploadBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <span>{uploading ? "Uploading Video..." : "Choose MP4 / WebM Video File"}</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/*"
                    onChange={handleFileUpload}
                    className={styles.fileInput}
                    disabled={uploading}
                  />
                </label>
                <p style={{ fontSize: "0.8125rem", color: "#64748b", margin: "0.5rem 0 0" }}>
                  Uploads directly to MongoDB database. Autoplays muted on scroll with Mute/Unmute toggle.
                </p>
              </div>
            </div>

            <div className={styles.orDivider}>OR</div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Option B: External Video / Reel URL</label>
              <input
                type="text"
                placeholder="Paste MP4 file URL, YouTube URL, or Instagram Reel link"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className={styles.input}
              />
            </div>

            {/* Video Preview */}
            {formData.videoUrl && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Live Video Preview</label>
                <div className={styles.previewContainer}>
                  <div className={styles.previewHeader}>
                    <span>{isEmbed ? "Embedded Video Player" : "HTML5 Video File"}</span>
                    <span>{formData.videoType || "Active"}</span>
                  </div>
                  {isEmbed ? (
                    <iframe
                      src={getEmbedUrl(formData.videoUrl)}
                      className={styles.iframePreview}
                      title="Video Preview"
                      allow="autoplay; encrypted-media"
                    />
                  ) : (
                    <video
                      src={formData.videoUrl}
                      controls
                      muted
                      autoPlay
                      className={styles.videoPreview}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section Text & Content Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>📝 Section Text Content</h2>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Subheading Label</label>
                <input
                  type="text"
                  value={formData.subheading}
                  onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Floating Badge Highlight</label>
                <input
                  type="text"
                  placeholder="e.g. 18+ Years"
                  value={formData.badgeValue}
                  onChange={(e) => setFormData({ ...formData, badgeValue: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Main Section Heading</label>
                <textarea
                  rows={2}
                  value={formData.heading}
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Floating Badge Subtext</label>
                <input
                  type="text"
                  placeholder="e.g. Guiding Students Forward"
                  value={formData.badgeLabel}
                  onChange={(e) => setFormData({ ...formData, badgeLabel: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
              <label className={styles.label}>Section Highlights (Chips)</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {formData.highlights.map((highlight, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(idx, e.target.value)}
                    className={styles.input}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <button type="submit" disabled={saving || uploading} className={styles.saveBtn}>
                {saving ? "Saving Changes..." : "Save Section Settings"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
