"use client";

import { useState } from "react";

export default function CrmRetryButton({ enquiryId }: { enquiryId: string }) {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  const handleRetry = async () => {
    setLoading(true);
    setStatusText(null);
    try {
      const res = await fetch("/api/admin/enquiries/retry-crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enquiryId }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusText("✓ Synced");
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setStatusText(data.error || "✕ Failed");
      }
    } catch {
      setStatusText("✕ Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
      <button
        type="button"
        onClick={handleRetry}
        disabled={loading}
        style={{
          padding: "0.2rem 0.5rem",
          fontSize: "0.75rem",
          fontWeight: 600,
          borderRadius: "4px",
          border: "1px solid #cbd5e1",
          background: "#ffffff",
          color: "#0f172a",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Syncing..." : "Retry CRM"}
      </button>
      {statusText && <span style={{ fontSize: "0.75rem", color: statusText.startsWith("✓") ? "#16a34a" : "#dc2626" }}>{statusText}</span>}
    </div>
  );
}
