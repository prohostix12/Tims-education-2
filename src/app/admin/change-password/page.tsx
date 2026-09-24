"use client";

import React, { useState, type FormEvent } from "react";
import Link from "next/link";

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export default function AdminChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!currentPassword.trim()) {
      setStatusMessage({ type: "error", text: "Please enter your current password." });
      return;
    }

    if (!newPassword.trim()) {
      setStatusMessage({ type: "error", text: "Please enter a new password." });
      return;
    }

    if (newPassword.length < 6) {
      setStatusMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: "error", text: "New password and confirmation password do not match." });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim(),
          confirmPassword: confirmPassword.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: data.message || "Admin password updated successfully in MongoDB.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to update password. Please check current password.",
        });
      }
    } catch (err) {
      console.error("Failed to update password:", err);
      setStatusMessage({
        type: "error",
        text: "A network or server error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "680px" }}>
      <div className="tims-admin-page-header">
        <span className="tims-admin-eyebrow">Security & Access</span>
        <h1 className="tims-admin-heading">Change Admin Password</h1>
        <p className="tims-admin-subtitle">
          Update the password used to access the TIMS Education Admin Panel. The password will be securely stored in MongoDB.
        </p>
      </div>

      {statusMessage && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "0.9375rem",
            fontWeight: 500,
            backgroundColor: statusMessage.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: statusMessage.type === "success" ? "#166534" : "#991b1b",
            border: statusMessage.type === "success" ? "1px solid #bbf7d0" : "1px solid #fecaca",
          }}
        >
          {statusMessage.type === "success" ? <CheckCircleIcon /> : <AlertIcon />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form className="tims-admin-card" onSubmit={handleSubmit}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "8px",
              backgroundColor: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1e293b",
            }}
          >
            <LockIcon />
          </div>
          <div>
            <h2 className="tims-admin-card-title" style={{ margin: 0, fontSize: "1.1rem" }}>
              Update Credentials
            </h2>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
              Make sure to use a strong, unique password.
            </p>
          </div>
        </div>

        {/* Current Password */}
        <div className="tims-admin-field">
          <label className="tims-admin-label" htmlFor="current-password">
            Current Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="current-password"
              className="tims-admin-input"
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current admin password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
              required
              style={{ paddingRight: "44px" }}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
              aria-label={showCurrent ? "Hide password" : "Show password"}
            >
              <EyeIcon visible={showCurrent} />
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="tims-admin-field">
          <label className="tims-admin-label" htmlFor="new-password">
            New Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="new-password"
              className="tims-admin-input"
              type={showNew ? "text" : "password"}
              placeholder="Enter new password (min. 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              required
              style={{ paddingRight: "44px" }}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              <EyeIcon visible={showNew} />
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="tims-admin-field">
          <label className="tims-admin-label" htmlFor="confirm-password">
            Confirm New Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="confirm-password"
              className="tims-admin-input"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
              style={{ paddingRight: "44px" }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              <EyeIcon visible={showConfirm} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "24px" }}>
          <button type="submit" className="tims-admin-save-button" disabled={isLoading}>
            {isLoading ? "Updating Password..." : "Update Password"}
          </button>
          <Link
            href="/admin/users"
            style={{
              fontSize: "0.875rem",
              color: "#64748b",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
