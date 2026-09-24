"use client";

import { useEffect, useState, FormEvent } from "react";
import type { MissionVisionData } from "@/app/api/mission-vision/route";

export default function AdminMissionVisionPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState<MissionVisionData>({
    missionEyebrow: "OUR MISSION",
    missionHeading: "Empowering Learners Through Accessible, Accredited Education",
    missionDescription:
      "Providing accessible, high-quality distance and online education that breaks geographical and financial barriers. We guide students and professionals to achieve recognized qualifications, personal growth, and successful career pathways.",
    missionPoints: [
      "UGC-DEB Recognized & Accredited University Affiliations",
      "Flexible Learning Models Tailored for Working Professionals",
      "Personalized Academic Counseling from Admission to Graduation"
    ],
    visionEyebrow: "OUR VISION",
    visionHeading: "Inspiring Academic Excellence and Global Opportunities",
    visionDescription:
      "To be the premier educational counseling and distance learning institution in Kerala and the GCC region, recognized for transforming lives through innovative learning pathways, higher education accessibility, and career excellence.",
    visionPoints: [
      "50,000+ Students Mentored Across India & GCC",
      "Continuous Innovation in Flexible Open & Distance Learning",
      "Building Confidence, Job Readiness & Lifelong Achievement"
    ]
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/mission-vision");
        if (res.ok) {
          const data = await res.json();
          if (data && data.missionHeading) {
            setFormData({
              missionEyebrow: data.missionEyebrow || "OUR MISSION",
              missionHeading: data.missionHeading || "",
              missionDescription: data.missionDescription || "",
              missionPoints: Array.isArray(data.missionPoints) ? data.missionPoints : [],
              visionEyebrow: data.visionEyebrow || "OUR VISION",
              visionHeading: data.visionHeading || "",
              visionDescription: data.visionDescription || "",
              visionPoints: Array.isArray(data.visionPoints) ? data.visionPoints : [],
            });
          }
        }
      } catch (err) {
        console.error("Failed to load mission & vision:", err);
        setStatusMessage({ type: "error", text: "Failed to load Mission & Vision data." });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleAddMissionPoint = () => {
    setFormData((prev) => ({
      ...prev,
      missionPoints: [...prev.missionPoints, ""],
    }));
  };

  const handleRemoveMissionPoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      missionPoints: prev.missionPoints.filter((_, i) => i !== index),
    }));
  };

  const handleMissionPointChange = (index: number, value: string) => {
    setFormData((prev) => {
      const nextPts = [...prev.missionPoints];
      nextPts[index] = value;
      return { ...prev, missionPoints: nextPts };
    });
  };

  const handleAddVisionPoint = () => {
    setFormData((prev) => ({
      ...prev,
      visionPoints: [...prev.visionPoints, ""],
    }));
  };

  const handleRemoveVisionPoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      visionPoints: prev.visionPoints.filter((_, i) => i !== index),
    }));
  };

  const handleVisionPointChange = (index: number, value: string) => {
    setFormData((prev) => {
      const nextPts = [...prev.visionPoints];
      nextPts[index] = value;
      return { ...prev, visionPoints: nextPts };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/mission-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save Mission & Vision");
      }

      setStatusMessage({
        type: "success",
        text: "Mission & Vision content updated successfully!",
      });
    } catch (err: any) {
      console.error("Save error:", err);
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to save. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="tims-admin-page-header">
          <span className="tims-admin-eyebrow">Content & Media</span>
          <h1 className="tims-admin-heading">Mission &amp; Vision Management</h1>
          <p className="tims-admin-subtitle">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="tims-admin-page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="tims-admin-eyebrow">Content & Media</span>
            <h1 className="tims-admin-heading">Mission &amp; Vision Management</h1>
            <p className="tims-admin-subtitle">
              Edit the Mission and Vision statements displayed at the top of the Leadership &amp; Directors page.
            </p>
          </div>
          <button
            type="submit"
            form="mission-vision-form"
            className="tims-admin-save-button"
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "✓ Save Mission & Vision"}
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

      <form id="mission-vision-form" onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
          {/* Mission Editor Card */}
          <div className="tims-admin-card" style={{ borderTop: "4px solid #E91D24" }}>
            <div className="tims-admin-card-header" style={{ marginBottom: "1.25rem" }}>
              <div>
                <span className="tims-admin-badge" style={{ background: "#ffe4e6", color: "#9f1239", border: "1px solid #fecdd3" }}>
                  Target Section
                </span>
                <h2 className="tims-admin-card-title" style={{ margin: "0.4rem 0 0" }}>
                  Our Mission Statement
                </h2>
              </div>
            </div>

            <div className="tims-admin-field">
              <label className="tims-admin-label" htmlFor="missionEyebrow">
                Mission Eyebrow Badge
              </label>
              <input
                id="missionEyebrow"
                type="text"
                className="tims-admin-input"
                placeholder="OUR MISSION"
                value={formData.missionEyebrow}
                onChange={(e) => setFormData({ ...formData, missionEyebrow: e.target.value })}
                required
              />
            </div>

            <div className="tims-admin-field">
              <label className="tims-admin-label" htmlFor="missionHeading">
                Mission Main Heading *
              </label>
              <input
                id="missionHeading"
                type="text"
                className="tims-admin-input"
                placeholder="Empowering Learners Through Accessible Education"
                value={formData.missionHeading}
                onChange={(e) => setFormData({ ...formData, missionHeading: e.target.value })}
                required
              />
            </div>

            <div className="tims-admin-field">
              <label className="tims-admin-label" htmlFor="missionDescription">
                Mission Description Paragraph *
              </label>
              <textarea
                id="missionDescription"
                className="tims-admin-textarea"
                rows={4}
                placeholder="Detailed mission text..."
                value={formData.missionDescription}
                onChange={(e) => setFormData({ ...formData, missionDescription: e.target.value })}
                required
              />
            </div>

            <div className="tims-admin-field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label className="tims-admin-label" style={{ margin: 0 }}>
                  Key Mission Highlights / Points
                </label>
                <button
                  type="button"
                  className="tims-admin-secondary-button"
                  style={{ padding: "0.3rem 0.6rem", fontSize: "0.78rem" }}
                  onClick={handleAddMissionPoint}
                >
                  + Add Point
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {formData.missionPoints.map((point, idx) => (
                  <div key={`m-pt-edit-${idx}`} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="text"
                      className="tims-admin-input"
                      placeholder={`Point ${idx + 1}`}
                      value={point}
                      onChange={(e) => handleMissionPointChange(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      className="tims-admin-danger-button"
                      style={{ padding: "0.55rem 0.75rem", flexShrink: 0 }}
                      onClick={() => handleRemoveMissionPoint(idx)}
                      title="Remove point"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vision Editor Card */}
          <div className="tims-admin-card" style={{ borderTop: "4px solid #142b72" }}>
            <div className="tims-admin-card-header" style={{ marginBottom: "1.25rem" }}>
              <div>
                <span className="tims-admin-badge" style={{ background: "#dbeafe", color: "#1e40af", border: "1px solid #bfdbfe" }}>
                  Future Direction
                </span>
                <h2 className="tims-admin-card-title" style={{ margin: "0.4rem 0 0" }}>
                  Our Vision Statement
                </h2>
              </div>
            </div>

            <div className="tims-admin-field">
              <label className="tims-admin-label" htmlFor="visionEyebrow">
                Vision Eyebrow Badge
              </label>
              <input
                id="visionEyebrow"
                type="text"
                className="tims-admin-input"
                placeholder="OUR VISION"
                value={formData.visionEyebrow}
                onChange={(e) => setFormData({ ...formData, visionEyebrow: e.target.value })}
                required
              />
            </div>

            <div className="tims-admin-field">
              <label className="tims-admin-label" htmlFor="visionHeading">
                Vision Main Heading *
              </label>
              <input
                id="visionHeading"
                type="text"
                className="tims-admin-input"
                placeholder="Inspiring Academic Excellence and Opportunities"
                value={formData.visionHeading}
                onChange={(e) => setFormData({ ...formData, visionHeading: e.target.value })}
                required
              />
            </div>

            <div className="tims-admin-field">
              <label className="tims-admin-label" htmlFor="visionDescription">
                Vision Description Paragraph *
              </label>
              <textarea
                id="visionDescription"
                className="tims-admin-textarea"
                rows={4}
                placeholder="Detailed vision text..."
                value={formData.visionDescription}
                onChange={(e) => setFormData({ ...formData, visionDescription: e.target.value })}
                required
              />
            </div>

            <div className="tims-admin-field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label className="tims-admin-label" style={{ margin: 0 }}>
                  Key Vision Highlights / Points
                </label>
                <button
                  type="button"
                  className="tims-admin-secondary-button"
                  style={{ padding: "0.3rem 0.6rem", fontSize: "0.78rem" }}
                  onClick={handleAddVisionPoint}
                >
                  + Add Point
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {formData.visionPoints.map((point, idx) => (
                  <div key={`v-pt-edit-${idx}`} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="text"
                      className="tims-admin-input"
                      placeholder={`Point ${idx + 1}`}
                      value={point}
                      onChange={(e) => handleVisionPointChange(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      className="tims-admin-danger-button"
                      style={{ padding: "0.55rem 0.75rem", flexShrink: 0 }}
                      onClick={() => handleRemoveVisionPoint(idx)}
                      title="Remove point"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1.75rem", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            className="tims-admin-save-button"
            style={{ padding: "0.85rem 1.75rem", fontSize: "1rem" }}
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "✓ Save Mission & Vision"}
          </button>
        </div>
      </form>
    </div>
  );
}
