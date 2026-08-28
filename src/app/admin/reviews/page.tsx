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
  image: string | null;
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch("/api/reviews");
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
        body: JSON.stringify({ name, date, rating, image: imagePreview }),
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

  const handleDelete = async (id: string) => {
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
        <h1 className="tims-admin-heading">Reviews</h1>
        <p className="tims-admin-subtitle">Add and manage the reviews shown across the site.</p>
      </div>

      <div className={styles.layout}>
        <form className="tims-admin-card" onSubmit={handleSubmit}>
          <h2 className="tims-admin-card-title">Add Review</h2>

          <div className="tims-admin-field">
            <label className="tims-admin-label" htmlFor="review-name">
              Name
            </label>
            <input
              id="review-name"
              className="tims-admin-input"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Reviewer's full name"
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
            <span className="tims-admin-label">Star Rating</span>
            <StarRatingInput value={rating} onChange={setRating} />
          </div>

          <div className="tims-admin-field">
            <label className="tims-admin-label" htmlFor="review-image">
              Image
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

          <button type="submit" className="tims-admin-save-button" disabled={status === "submitting"}>
            {status === "submitting" ? "Saving..." : "Add Review"}
          </button>

          {status === "success" && <p className={styles.formStatusSuccess}>Review added.</p>}
          {status === "error" && <p className={styles.formStatusError}>{errorMessage}</p>}
        </form>

        <div className="tims-admin-card">
          <h2 className="tims-admin-card-title">All Reviews</h2>

          {loading ? (
            <p className="tims-admin-subtitle">Loading reviews...</p>
          ) : loadError ? (
            <p className="tims-admin-subtitle">{loadError}</p>
          ) : reviews.length === 0 ? (
            <p className="tims-admin-subtitle">No reviews yet — add the first one using the form.</p>
          ) : (
            <div className="tims-admin-table-wrap">
              <table className="tims-admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Rating</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td>
                        {review.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={review.image} alt={review.name} className={styles.reviewThumb} />
                        ) : (
                          <span className={styles.reviewThumbPlaceholder}>N/A</span>
                        )}
                      </td>
                      <td>{review.name}</td>
                      <td>{review.date}</td>
                      <td>
                        <StarRatingDisplay rating={review.rating} />
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
