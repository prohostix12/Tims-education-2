"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function StudentLoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentId.trim(),
          email: studentId.trim(),
          password,
        }),
      });

      const data = await response.json();
      console.log("Data:", data);

      if (response.ok && data.success) {
        setSuccessMessage("Signed in successfully! Redirecting to student portal...");
        setTimeout(() => {
          if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
          } else {
            // router.push("/students/dashboard");
          }
        }, 500);
      } else {
        setErrorMessage(data.error || data.message || "Invalid credentials");
      }
    } catch (err) {
      setErrorMessage("An error occurred during login. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <Link href="/" className={styles.logoWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/tims_logo/logo.webp"
              alt="TIMS Education logo"
              className={styles.logoImage}
            />
          </Link>
          <br />
          <span className={styles.badge}>Student Portal</span>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Sign in to access your course materials, hall tickets &amp; exam updates
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errorMessage && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                background: "rgba(239, 68, 68, 0.12)",
                color: "#b91c1c",
                border: "1px solid rgba(239, 68, 68, 0.25)",
              }}
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                background: "rgba(34, 197, 94, 0.12)",
                color: "#15803d",
                border: "1px solid rgba(34, 197, 94, 0.25)",
              }}
            >
              {successMessage}
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label htmlFor="studentId" className={styles.label}>
              Register No. / Email Address
            </label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="studentId"
                type="text"
                className={styles.input}
                placeholder="Enter Email Address"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              Password / Date of Birth
            </label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={styles.input}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className={styles.togglePassBtn}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className={styles.formRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            <span>{isLoading ? "Signing in..." : "Sign In to Portal"}</span>
            {!isLoading && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
