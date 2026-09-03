"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./EnquiryModal.module.css";
import { useEnquiryForm } from "@/lib/useEnquiryForm";

export default function EnquiryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { status, errorMessage, handleSubmit } = useEnquiryForm("popup-modal");

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Handle ESC key press to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal}>
        {/* Close Button */}
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close Enquiry Modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className={styles.headerGroup}>
          <div className={styles.badge}>
            <span className={styles.badgePulse} />
            ADMISSIONS OPEN 2026
          </div>

          <h2 id="modal-title" className={styles.title}>
            Start Your Journey
          </h2>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="modal-name" className={styles.label}>
              Name <span className={styles.required}>*</span>
            </label>
            <input
              id="modal-name"
              name="name"
              type="text"
              placeholder="Your full name"
              className={styles.input}
              required
              autoComplete="name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="modal-email" className={styles.label}>
              Email <span className={styles.required}>*</span>
            </label>
            <input
              id="modal-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className={styles.input}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="modal-phone" className={styles.label}>
              Phone Number <span className={styles.required}>*</span>
            </label>
            <input
              id="modal-phone"
              name="phone"
              type="tel"
              placeholder="+91 00000 00000"
              className={styles.input}
              required
              autoComplete="tel"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="modal-preference" className={styles.label}>
              Preference <span className={styles.required}>*</span>
            </label>
            <select
              id="modal-preference"
              name="preference"
              className={styles.select}
              defaultValue=""
              required
            >
              <option value="" disabled>
                Select a course
              </option>
              <option value="sslc-plus-two">SSLC / Plus Two</option>
              <option value="online-degree">Online Degree</option>
              <option value="post-graduation">Post Graduation</option>
              <option value="btech-mtech">Btech / Mtech</option>
              <option value="diploma">Diploma</option>
            </select>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending..." : "Submit Enquiry"}
          </button>

          {status === "success" && (
            <div className={styles.statusSuccess}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Thanks! We&rsquo;ll get in touch with you shortly.</span>
            </div>
          )}

          {status === "error" && (
            <p className={styles.statusError}>{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
