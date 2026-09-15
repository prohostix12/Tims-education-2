"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { StarRatingInput } from "@/components/StarRating/StarRating";

type WriteReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB

export default function WriteReviewModal({ isOpen, onClose, onSuccess }: WriteReviewModalProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) {
      setImagePreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose a valid image file.");
      e.target.value = "";
      setImagePreview(null);
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image is too large. Please use a file under 3MB.");
      e.target.value = "";
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          rating,
          text: text.trim(),
          image: imagePreview,
          source: "student",
          selected: false,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not submit review.");
      }

      setSuccessMsg(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setName("");
        setRating(5);
        setText("");
        setImagePreview(null);
        setSuccessMsg(false);
        onClose();
      }, 2000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "520px",
          padding: "1.75rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            border: "none",
            background: "#f1f5f9",
            color: "#64748b",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            fontSize: "1.1rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close review modal"
        >
          ✕
        </button>

        <h3 style={{ margin: "0 0 0.35rem", fontSize: "1.35rem", fontWeight: 700, color: "#0f172a" }}>
          Write a Student Review
        </h3>
        <p style={{ margin: "0 0 1.25rem", fontSize: "0.875rem", color: "#64748b" }}>
          Share your experience with TIMS Education to help other prospective students.
        </p>

        {successMsg ? (
          <div
            style={{
              padding: "1.25rem",
              borderRadius: "12px",
              background: "rgba(34, 197, 94, 0.12)",
              border: "1px solid rgba(34, 197, 94, 0.25)",
              color: "#15803d",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            ✓ Thank you! Your review has been submitted for admin approval.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Your Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Star Rating *
              </label>
              <StarRatingInput value={rating} onChange={setRating} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Your Review / Experience *
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe your learning experience, course quality, support, etc..."
                required
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.9rem",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Profile Photo (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ fontSize: "0.85rem", color: "#64748b" }}
              />
              {imageError && <span style={{ display: "block", fontSize: "0.75rem", color: "#dc2626", marginTop: "0.25rem" }}>{imageError}</span>}
              {imagePreview && (
                <div style={{ marginTop: "0.5rem" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }} />
                </div>
              )}
            </div>

            {errorMsg && (
              <div style={{ fontSize: "0.85rem", color: "#b91c1c", background: "rgba(239, 68, 68, 0.1)", padding: "0.5rem 0.75rem", borderRadius: "6px" }}>
                ✕ {errorMsg}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                style={{
                  padding: "0.6rem 1.15rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#E91D24",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
