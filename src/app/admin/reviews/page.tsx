"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { StarRatingDisplay, StarRatingInput } from "@/components/StarRating/StarRating";
import styles from "./reviews.module.css";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB

type Review = {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  image: string | null;
  selected: boolean;
  source: "student" | "admin";
  createdAt: string;
};

type Status = "idle" | "submitting" | "success" | "error";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [date, setDate] = useState(todayIsoDate());
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [selected, setSelected] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch("/api/reviews?all=true");
      if (!response.ok) throw new Error("Could not load reviews.");
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageError(null);

    if (!file) {
      setImagePreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.");
      event.target.value = "";
      setImagePreview(null);
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image is too large. Please use a file under 3MB.");
      event.target.value = "";
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setName("");
    setDate(todayIsoDate());
    setRating(5);
    setText("");
    setSelected(true);
    setImagePreview(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          date,
          rating,
          text,
          image: imagePreview,
          selected,
          source: "admin",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Could not save the review.");
      }

      setStatus("success");
      resetForm();
      loadReviews();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Could not save the review.");
    }
  };

  const handleToggleSelect = async (review: Review) => {
    const newSelected = !review.selected;
    setTogglingId(review.id);
    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected: newSelected }),
      });

      if (!response.ok) throw new Error("Failed to update selection status.");

      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, selected: newSelected } : r))
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not update selection status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete this review.");
      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not delete this review.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="tims-admin-page-header">
        <span className="tims-admin-eyebrow">Testimonials</span>
        <h1 className="tims-admin-heading">Student Reviews Management</h1>
        <p className="tims-admin-subtitle">
          Review student submissions from the website and choose which ones to feature on the public homepage.
        </p>
      </div>

      <div className={styles.layout}>
        {/* Compose / Add Review Form */}
        <form className="tims-admin-card" onSubmit={handleSubmit}>
          <h2 className="tims-admin-card-title">Add / Write Review</h2>

          <div className="tims-admin-field">
            <label className="tims-admin-label" htmlFor="review-name">
              Student / Reviewer Name *
            </label>
            <input
              id="review-name"
              className="tims-admin-input"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              required
            />
          </div>

          <div className="tims-admin-field">
            <label className="tims-admin-label" htmlFor="review-date">
              Date
            </label>
            <input
              id="review-date"
              className="tims-admin-input"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </div>

          <div className="tims-admin-field">
            <span className="tims-admin-label">Star Rating *</span>
            <StarRatingInput value={rating} onChange={setRating} />
          </div>

          <div className="tims-admin-field">
            <label className="tims-admin-label" htmlFor="review-text">
              Review Content / Feedback *
            </label>
            <textarea
              id="review-text"
              className="tims-admin-input"
              rows={3}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Write the testimonial or student review..."
              required
              style={{ fontFamily: "inherit", resize: "vertical" }}
            />
          </div>

          <div className="tims-admin-field">
            <label className="tims-admin-label" htmlFor="review-image">
              Image / Avatar
            </label>
            <div className={styles.imageUpload}>
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
              ) : (
                <span className={styles.imagePlaceholder}>No image</span>
              )}
              <div className={styles.imageInputWrap}>
                <input
                  id="review-image"
                  className="tims-admin-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <span className={styles.fileHint}>PNG or JPG, up to 3MB. Optional.</span>
                {imageError && <span className={styles.formStatusError}>{imageError}</span>}
              </div>
            </div>
          </div>

          <div className="tims-admin-field">
            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => setSelected(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "#E91D24", cursor: "pointer" }}
              />
              <span>Display on public website immediately</span>
            </label>
          </div>

          <button type="submit" className="tims-admin-save-button" disabled={status === "submitting"}>
            {status === "submitting" ? "Saving..." : "Add Review"}
          </button>

          {status === "success" && <p className={styles.formStatusSuccess}>Review added successfully.</p>}
          {status === "error" && <p className={styles.formStatusError}>{errorMessage}</p>}
        </form>

        {/* Reviews List / Table */}
        <div className="tims-admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h2 className="tims-admin-card-title" style={{ margin: 0 }}>All Student &amp; Admin Reviews</h2>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
                Select which reviews should appear on the public website testimonial section.
              </p>
            </div>
            <span className="tims-admin-badge tims-admin-badge-muted">
              {reviews.filter((r) => r.selected).length} Featured on Site
            </span>
          </div>

          {loading ? (
            <p className="tims-admin-subtitle">Loading reviews...</p>
          ) : loadError ? (
            <p className="tims-admin-subtitle">{loadError}</p>
          ) : reviews.length === 0 ? (
            <p className="tims-admin-subtitle">No reviews submitted yet.</p>
          ) : (
            <div className="tims-admin-table-wrap">
              <table className="tims-admin-table">
                <thead>
                  <tr>
                    <th>Reviewer</th>
                    <th>Rating &amp; Review Text</th>
                    <th>Source</th>
                    <th>Public Website Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          {review.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={review.image} alt={review.name} className={styles.reviewThumb} />
                          ) : (
                            <span className={styles.reviewThumbPlaceholder}>
                              {review.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <div>
                            <div style={{ fontWeight: 700, color: "#0f172a" }}>{review.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{review.date}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ maxWidth: "280px" }}>
                        <div style={{ marginBottom: "0.25rem" }}>
                          <StarRatingDisplay rating={review.rating} />
                        </div>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#334155", lineHeight: 1.4 }}>
                          &ldquo;{review.text}&rdquo;
                        </p>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.2rem 0.55rem",
                            borderRadius: "12px",
                            fontWeight: 600,
                            background: review.source === "admin" ? "rgba(147, 51, 234, 0.12)" : "rgba(14, 165, 233, 0.12)",
                            color: review.source === "admin" ? "#7e22ce" : "#0284c7",
                          }}
                        >
                          {review.source === "admin" ? "Admin Entry" : "Student Submission"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(review)}
                          disabled={togglingId === review.id}
                          style={{
                            padding: "0.35rem 0.75rem",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            border: review.selected ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid #cbd5e1",
                            background: review.selected ? "rgba(34, 197, 94, 0.15)" : "#f8fafc",
                            color: review.selected ? "#15803d" : "#64748b",
                            cursor: togglingId === review.id ? "not-allowed" : "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {togglingId === review.id
                            ? "Updating..."
                            : review.selected
                            ? "✓ Displayed on Site"
                            : "○ Select for Site"}
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => handleDelete(review.id)}
                          disabled={deletingId === review.id}
                        >
                          {deletingId === review.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

