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
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

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
    } catch {
      setMessage({ type: "error", text: "An error occurred while saving CRM configuration." });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/integrations/crm/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpointUrl: crmConfig.endpointUrl,
          apiKey: crmConfig.apiKey,
        }),
      });
      const data = await res.json();
      setTestResult({
        success: Boolean(data.success),
        message: data.message || (data.success ? "✓ CRM connection successful" : "✕ CRM connection failed"),
      });
    } catch {
      setTestResult({
        success: false,
        message: "✕ CRM connection failed: Network error.",
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: "#64748b" }}>
        Loading integration settings...
      </div>
    );
  }

  const isConfigured = crmConfig.hasApiKey || Boolean(crmConfig.apiKey);

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h2 className="tims-admin-card-title" style={{ margin: 0 }}>CRM Integration</h2>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "20px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  background: !isConfigured
                    ? "#f1f5f9"
                    : testResult
                    ? testResult.success
                      ? "rgba(34, 197, 94, 0.15)"
                      : "rgba(239, 68, 68, 0.15)"
                    : "rgba(34, 197, 94, 0.15)",
                  color: !isConfigured
                    ? "#64748b"
                    : testResult
                    ? testResult.success
                      ? "#15803d"
                      : "#b91c1c"
                    : "#15803d",
                }}
              >
                {!isConfigured
                  ? "○ Not configured"
                  : testResult
                  ? testResult.success
                    ? "● Connected"
                    : "⚠ Connection failed"
                  : "● Connected"}
              </span>
            </div>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#64748b" }}>
              Forward student enquiry leads securely to PypeCRM
            </p>
          </div>
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
            The endpoint URL for forwarding student leads to PypeCRM.
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

        {testResult && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              background: testResult.success ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
              color: testResult.success ? "#15803d" : "#b91c1c",
              border: testResult.success ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            {testResult.message}
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
          <button
            type="submit"
            className="tims-admin-save-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save CRM Settings"}
          </button>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing || (!crmConfig.hasApiKey && !crmConfig.apiKey)}
            style={{
              padding: "0.65rem 1.25rem",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              cursor: testing || (!crmConfig.hasApiKey && !crmConfig.apiKey) ? "not-allowed" : "pointer",
              opacity: testing || (!crmConfig.hasApiKey && !crmConfig.apiKey) ? 0.6 : 1,
            }}
          >
            {testing ? "Testing Connection..." : "Test Connection"}
          </button>
        </div>
      </form>
    </div>
  );
}

