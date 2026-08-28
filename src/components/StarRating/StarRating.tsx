"use client";

import { useState } from "react";
import styles from "./StarRating.module.css";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill={filled ? "#f5a623" : "none"} aria-hidden="true">
      <path
        d="M12 3.5l2.6 5.4 6 .8-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.3-4.2 6-.8L12 3.5Z"
        stroke={filled ? "#f5a623" : "#c7ccd6"}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Read-only star display, e.g. for a review card/table row. */
export function StarRatingDisplay({ rating }: { rating: number }) {
  return (
    <span className={styles.display} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={star <= rating} />
      ))}
    </span>
  );
}

/** Interactive star picker for the create-review form. */
export function StarRatingInput({
  value,
  onChange,
  name = "rating",
}: {
  value: number;
  onChange: (next: number) => void;
  name?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? value;

  return (
    <div className={styles.input} role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className={styles.inputButton}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
        >
          <StarIcon filled={star <= displayValue} />
        </button>
      ))}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
