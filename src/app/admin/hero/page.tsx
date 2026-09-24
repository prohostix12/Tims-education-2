"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./hero-admin.module.css";
import { DEFAULT_HERO_CONTENT } from "@/lib/heroSectionDb";

export default function HeroAdminPage() {
  const [eyebrow, setEyebrow] = useState(DEFAULT_HERO_CONTENT.eyebrow);
  const [headingMain, setHeadingMain] = useState(DEFAULT_HERO_CONTENT.headingMain);
  const [headingHighlight, setHeadingHighlight] = useState(DEFAULT_HERO_CONTENT.headingHighlight);
  const [subtitle, setSubtitle] = useState(DEFAULT_HERO_CONTENT.subtitle);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    fetch("/api/hero-content")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.eyebrow) setEyebrow(data.eyebrow);
          if (data.headingMain) setHeadingMain(data.headingMain);
          if (data.headingHighlight) setHeadingHighlight(data.headingHighlight);
          if (data.subtitle) setSubtitle(data.subtitle);
        }
      })
      .catch((err) => console.error("Failed to load hero content:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/hero-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eyebrow,
          headingMain,
          headingHighlight,
          subtitle,
        }),
      });

      if (res.ok) {
        showToast("Hero section content saved successfully!");
      } else {
        alert("Failed to save changes. Please try again.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset Hero section content to default values?")) {
      setEyebrow(DEFAULT_HERO_CONTENT.eyebrow);
      setHeadingMain(DEFAULT_HERO_CONTENT.headingMain);
      setHeadingHighlight(DEFAULT_HERO_CONTENT.headingHighlight);
      setSubtitle(DEFAULT_HERO_CONTENT.subtitle);
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
        <span className={styles.breadcrumbActive}>Content &amp; Media</span>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbActive}>Hero Section</span>
      </nav>

      {/* Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.headerMain}>
          <h1 className={styles.heading}>Hero Section Editor</h1>
          <p className={styles.subtitle}>
            Manage homepage Hero section text elements: eyebrow badge, main heading, teal highlighted title, and intro paragraph.
          </p>
        </div>
      </div>

      <div className={styles.editorLayout}>
        {/* Left Column: Form Controls */}
        <form onSubmit={handleSave} className={styles.formCard}>
          {/* Eyebrow Badge */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Eyebrow Tag / Badge Text</label>
            <input
              type="text"
              className={styles.inputControl}
              placeholder="e.g. BEST ONLINE DEGREE PLATFORM"
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              disabled={isLoading}
            />
            <span className={styles.fieldHelper}>
              Top uppercase badge label above the main title heading.
            </span>
          </div>

          {/* Main Heading Line 1 */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Main Heading (First Line)</label>
            <input
              type="text"
              className={styles.inputControl}
              placeholder="e.g. 18+ Years of Experience."
              value={headingMain}
              onChange={(e) => setHeadingMain(e.target.value)}
              disabled={isLoading}
            />
            <span className={styles.fieldHelper}>
              First line of the H1 hero title.
            </span>
          </div>

          {/* Teal Highlighted Line */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Heading Highlighted Line (Teal Color)</label>
            <input
              type="text"
              className={styles.inputControl}
              placeholder="e.g. One Commitment to Your Future."
              value={headingHighlight}
              onChange={(e) => setHeadingHighlight(e.target.value)}
              disabled={isLoading}
            />
            <span className={styles.fieldHelper}>
              Second line of the heading rendered in teal brand accent color.
            </span>
          </div>

          {/* Subtitle / Paragraph */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Subtitle Paragraph</label>
            <textarea
              className={styles.textareaControl}
              placeholder="e.g. Explore 10th & Plus Two, degree, postgraduate..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              disabled={isLoading}
              rows={4}
            />
            <span className={styles.fieldHelper}>
              Introductory description paragraph below the main title.
            </span>
          </div>

          {/* Action Buttons */}
          <div className={styles.btnRow}>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={isLoading || isSaving}
            >
              {isSaving ? "Saving..." : "Save Hero Content"}
            </button>

            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleReset}
              disabled={isLoading || isSaving}
            >
              Reset Defaults
            </button>
          </div>
        </form>

        {/* Right Column: Live Visual Preview */}
        <div className={styles.previewCol}>
          <div className={styles.previewHeader}>
            <span className={styles.previewLabel}>LIVE FRONTEND HERO PREVIEW</span>
          </div>

          <div className={styles.previewFrame}>
            <div className={styles.previewEyebrow}>
              <span className={styles.previewEyebrowLine} />
              <span>{eyebrow || "EYEBROW BADGE PLACEHOLDER"}</span>
            </div>

            <h1 className={styles.previewTitle}>
              {headingMain || "Main Heading Placeholder"}
              <br />
              <span className={styles.previewTitleTeal}>
                {headingHighlight || "Highlighted Line Placeholder"}
              </span>
            </h1>

            <p className={styles.previewSubtitle}>
              {subtitle || "Subtitle description paragraph placeholder."}
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <span>✓</span> {toastMessage}
        </div>
      )}
    </div>
  );
}
