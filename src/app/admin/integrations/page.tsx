"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";

type CrmIntegrationState = {
  enabled: boolean;
  endpointUrl: string;
  apiKey: string;
  hasApiKey: boolean;
  apiKeyMasked: string;
};

export default function AdminIntegrationsPage() {
  const [crmConfig, setCrmConfig] = useState<CrmIntegrationState>({
    enabled: false,
    endpointUrl: "https://pypecrm.com/api/v1/leads",
    apiKey: "",
    hasApiKey: false,
    apiKeyMasked: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load CRM config on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/admin/integrations/crm");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.config) {
            setCrmConfig({
              enabled: data.config.enabled || false,
              endpointUrl: data.config.endpointUrl || "https://pypecrm.com/api/v1/leads",
              apiKey: "",
              hasApiKey: data.config.hasApiKey || false,
              apiKeyMasked: data.config.apiKeyMasked || "",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load CRM integration:", err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSaveCrm = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/integrations/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: crmConfig.enabled,
          endpointUrl: crmConfig.endpointUrl,
          apiKey: crmConfig.apiKey,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "CRM integration settings saved successfully." });
        if (data.config) {
          setCrmConfig((prev) => ({
            ...prev,
            enabled: data.config.enabled,
            endpointUrl: data.config.endpointUrl,
            apiKey: "", // Clear input
            hasApiKey: data.config.hasApiKey,
            apiKeyMasked: data.config.apiKeyMasked,
          }));
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save CRM settings." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while saving CRM configuration." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: "#64748b" }}>
        Loading integration settings...
      </div>
    );
  }

  return (
    <div>
      <div className="tims-admin-page-header">
        <span className="tims-admin-eyebrow">ADMIN INTEGRATION</span>
        <h1 className="tims-admin-heading">Integrations</h1>
        <p className="tims-admin-subtitle">
          Configure CRM connection details and lead forwarding for TIMS Education.
        </p>
      </div>

      {message && (
        <div
          style={{
            marginBottom: "1.5rem",
            padding: "0.85rem 1.15rem",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: 600,
            background: message.type === "success" ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
            color: message.type === "success" ? "#15803d" : "#b91c1c",
            border: message.type === "success" ? "1px solid rgba(34, 197, 94, 0.25)" : "1px solid rgba(239, 68, 68, 0.25)",
          }}
        >
          {message.type === "success" ? "✓ " : "✕ "}
          {message.text}
        </div>
      )}

      {/* CRM Integration Card */}
      <form className="tims-admin-card" onSubmit={handleSaveCrm}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h2 className="tims-admin-card-title" style={{ margin: 0 }}>CRM Integration</h2>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#64748b" }}>
              Forward student enquiry leads to PypeCRM &amp; authenticate CRM student accounts
            </p>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem" }}>
            <span>{crmConfig.enabled ? "ENABLED" : "DISABLED"}</span>
            <input
              type="checkbox"
              checked={crmConfig.enabled}
              onChange={(e) => setCrmConfig({ ...crmConfig, enabled: e.target.checked })}
              style={{ width: "20px", height: "20px", accentColor: "#E91D24", cursor: "pointer" }}
            />
          </label>
        </div>

        <div className="tims-admin-field">
          <label className="tims-admin-label" htmlFor="crm-endpoint">
            CRM Endpoint URL
          </label>
          <input
            id="crm-endpoint"
            className="tims-admin-input"
            type="url"
            placeholder="https://pypecrm.com/api/v1/leads"
            value={crmConfig.endpointUrl}
            onChange={(e) => setCrmConfig({ ...crmConfig, endpointUrl: e.target.value })}
            required
          />
          <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
            The endpoint URL for forwarding student leads and CRM integration requests.
          </span>
        </div>

        <div className="tims-admin-field">
          <label className="tims-admin-label" htmlFor="crm-apikey">
            CRM API Key
          </label>
          <input
            id="crm-apikey"
            className="tims-admin-input"
            type="password"
            placeholder={crmConfig.hasApiKey ? "Saved API key (enter to replace)" : "Enter CRM API Key"}
            value={crmConfig.apiKey}
            onChange={(e) => setCrmConfig({ ...crmConfig, apiKey: e.target.value })}
            autoComplete="new-password"
          />
          {crmConfig.hasApiKey && !crmConfig.apiKey && (
            <span style={{ fontSize: "0.75rem", color: "#16a34a", marginTop: "0.25rem", display: "block" }}>
              ✓ CRM API key is safely encrypted and saved server-side ({crmConfig.apiKeyMasked}).
            </span>
          )}
        </div>

        <button
          type="submit"
          className="tims-admin-save-button"
          disabled={saving}
          style={{ marginTop: "1rem" }}
        >
          {saving ? "Saving..." : "Save CRM Settings"}
        </button>
      </form>
    </div>
  );
}
