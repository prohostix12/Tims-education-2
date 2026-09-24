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

type ErmIntegrationState = {
  apiUrl: string;
  dashboardUrl: string;
  apiKey: string;
};

export default function AdminIntegrationsPage() {
  const [crmConfig, setCrmConfig] = useState<CrmIntegrationState>({
    enabled: false,
    endpointUrl: "https://pypecrm.com/api/v1/leads",
    apiKey: "",
    hasApiKey: false,
    apiKeyMasked: "",
  });

  const [ermConfig, setErmConfig] = useState<ErmIntegrationState>({
    apiUrl: "https://pypeerm.com/api/v1/auth/external/student-login",
    dashboardUrl: "https://pypeerm.com",
    apiKey: "Timsapikey",
  });

  const [loading, setLoading] = useState(true);

  // CRM state
  const [crmSaving, setCrmSaving] = useState(false);
  const [crmTesting, setCrmTesting] = useState(false);
  const [crmMessage, setCrmMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [crmTestResult, setCrmTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // PypeERM state
  const [ermSaving, setErmSaving] = useState(false);
  const [ermTesting, setErmTesting] = useState(false);
  const [ermMessage, setErmMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [ermTestResult, setErmTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load integration configs on mount
  useEffect(() => {
    async function loadConfigs() {
      try {
        const [crmRes, ermRes] = await Promise.all([
          fetch("/api/admin/integrations/crm").catch(() => null),
          fetch("/api/admin/integrations/erm").catch(() => null),
        ]);

        if (crmRes && crmRes.ok) {
          const data = await crmRes.json();
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

        if (ermRes && ermRes.ok) {
          const data = await ermRes.json();
          if (data.success && data.config) {
            setErmConfig({
              apiUrl: data.config.apiUrl || "https://pypeerm.com/api/v1/auth/external/student-login",
              dashboardUrl: data.config.dashboardUrl || "https://pypeerm.com",
              apiKey: data.config.apiKey || "Timsapikey",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load integration settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadConfigs();
  }, []);

  // Save PypeERM Settings
  const handleSaveErm = async (e: FormEvent) => {
    e.preventDefault();
    setErmSaving(true);
    setErmMessage(null);

    try {
      const res = await fetch("/api/admin/integrations/erm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ermConfig),
      });

      const data = await res.json();
      if (data.success) {
        setErmMessage({ type: "success", text: "PypeERM integration settings saved successfully." });
        if (data.config) {
          setErmConfig({
            apiUrl: data.config.apiUrl,
            dashboardUrl: data.config.dashboardUrl,
            apiKey: data.config.apiKey,
          });
        }
      } else {
        setErmMessage({ type: "error", text: data.error || "Failed to save PypeERM settings." });
      }
    } catch {
      setErmMessage({ type: "error", text: "An error occurred while saving PypeERM configuration." });
    } finally {
      setErmSaving(false);
    }
  };

  // Test PypeERM Connection
  const handleTestErmConnection = async () => {
    setErmTesting(true);
    setErmTestResult(null);
    try {
      const res = await fetch("/api/admin/integrations/erm/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiUrl: ermConfig.apiUrl,
          apiKey: ermConfig.apiKey,
        }),
      });
      const data = await res.json();
      setErmTestResult({
        success: Boolean(data.success),
        message: data.message || (data.success ? "✓ PypeERM connection successful" : "✕ PypeERM connection failed"),
      });
    } catch {
      setErmTestResult({
        success: false,
        message: "✕ PypeERM connection failed: Network error.",
      });
    } finally {
      setErmTesting(false);
    }
  };

  // Save CRM Settings
  const handleSaveCrm = async (e: FormEvent) => {
    e.preventDefault();
    setCrmSaving(true);
    setCrmMessage(null);

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
        setCrmMessage({ type: "success", text: "CRM integration settings saved successfully." });
        if (data.config) {
          setCrmConfig((prev) => ({
            ...prev,
            enabled: data.config.enabled,
            endpointUrl: data.config.endpointUrl,
            apiKey: "",
            hasApiKey: data.config.hasApiKey,
            apiKeyMasked: data.config.apiKeyMasked,
          }));
        }
      } else {
        setCrmMessage({ type: "error", text: data.error || "Failed to save CRM settings." });
      }
    } catch {
      setCrmMessage({ type: "error", text: "An error occurred while saving CRM configuration." });
    } finally {
      setCrmSaving(false);
    }
  };

  // Test CRM Connection
  const handleTestCrmConnection = async () => {
    setCrmTesting(true);
    setCrmTestResult(null);
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
      setCrmTestResult({
        success: Boolean(data.success),
        message: data.message || (data.success ? "✓ CRM connection successful" : "✕ CRM connection failed"),
      });
    } catch {
      setCrmTestResult({
        success: false,
        message: "✕ CRM connection failed: Network error.",
      });
    } finally {
      setCrmTesting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: "#64748b" }}>
        Loading integration settings...
      </div>
    );
  }

  const isCrmConfigured = crmConfig.hasApiKey || Boolean(crmConfig.apiKey);

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <div className="tims-admin-page-header">
        <span className="tims-admin-eyebrow">ADMIN INTEGRATION</span>
        <h1 className="tims-admin-heading">Integrations</h1>
        <p className="tims-admin-subtitle">
          Configure PypeERM student authentication and CRM connection details for TIMS Education.
        </p>
      </div>

      {/* 1. PypeERM Integration Card */}
      <form className="tims-admin-card" onSubmit={handleSaveErm} style={{ marginBottom: "2rem" }}>
        {ermMessage && (
          <div
            style={{
              marginBottom: "1.25rem",
              padding: "0.85rem 1.15rem",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontWeight: 600,
              background: ermMessage.type === "success" ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
              color: ermMessage.type === "success" ? "#15803d" : "#b91c1c",
              border: ermMessage.type === "success" ? "1px solid rgba(34, 197, 94, 0.25)" : "1px solid rgba(239, 68, 68, 0.25)",
            }}
          >
            {ermMessage.type === "success" ? "✓ " : "✕ "}
            {ermMessage.text}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h2 className="tims-admin-card-title" style={{ margin: 0 }}>PypeERM Integration</h2>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "20px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  background: ermTestResult
                    ? ermTestResult.success
                      ? "rgba(34, 197, 94, 0.15)"
                      : "rgba(239, 68, 68, 0.15)"
                    : "rgba(34, 197, 94, 0.15)",
                  color: ermTestResult
                    ? ermTestResult.success
                      ? "#15803d"
                      : "#b91c1c"
                    : "#15803d",
                }}
              >
                {ermTestResult
                  ? ermTestResult.success
                    ? "● Connected"
                    : "⚠ Connection failed"
                  : "● Connected"}
              </span>
            </div>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#64748b" }}>
              Configure PypeERM Student Portal verification API and SSO redirect URLs
            </p>
          </div>
        </div>

        <div className="tims-admin-field">
          <label className="tims-admin-label" htmlFor="erm-api-url">
            PypeERM API URL
          </label>
          <input
            id="erm-api-url"
            className="tims-admin-input"
            type="url"
            placeholder="https://pypeerm.com/api/v1/auth/external/student-login"
            value={ermConfig.apiUrl}
            onChange={(e) => setErmConfig({ ...ermConfig, apiUrl: e.target.value })}
            required
          />
          <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
            The API endpoint used for verifying student login credentials with PypeERM backend.
          </span>
        </div>

        <div className="tims-admin-field">
          <label className="tims-admin-label" htmlFor="erm-dashboard-url">
            PypeERM Dashboard URL (Single Sign-On Redirect)
          </label>
          <input
            id="erm-dashboard-url"
            className="tims-admin-input"
            type="url"
            placeholder="https://pypeerm.com"
            value={ermConfig.dashboardUrl}
            onChange={(e) => setErmConfig({ ...ermConfig, dashboardUrl: e.target.value })}
            required
          />
          <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
            The frontend student portal dashboard URL to redirect students after successful login.
          </span>
        </div>

        <div className="tims-admin-field">
          <label className="tims-admin-label" htmlFor="erm-apikey">
            PypeERM API Key
          </label>
          <input
            id="erm-apikey"
            className="tims-admin-input"
            type="text"
            placeholder="Enter PypeERM API Key (e.g. Timsapikey)"
            value={ermConfig.apiKey}
            onChange={(e) => setErmConfig({ ...ermConfig, apiKey: e.target.value })}
            required
          />
          <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
            Security API key passed in request headers (`x-api-key`).
          </span>
        </div>

        {ermTestResult && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              background: ermTestResult.success ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
              color: ermTestResult.success ? "#15803d" : "#b91c1c",
              border: ermTestResult.success ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            {ermTestResult.message}
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
          <button
            type="submit"
            className="tims-admin-save-button"
            disabled={ermSaving}
          >
            {ermSaving ? "Saving..." : "Save PypeERM Settings"}
          </button>

          <button
            type="button"
            onClick={handleTestErmConnection}
            disabled={ermTesting || !ermConfig.apiUrl}
            style={{
              padding: "0.65rem 1.25rem",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              cursor: ermTesting || !ermConfig.apiUrl ? "not-allowed" : "pointer",
              opacity: ermTesting || !ermConfig.apiUrl ? 0.6 : 1,
            }}
          >
            {ermTesting ? "Testing Connection..." : "Test PypeERM Connection"}
          </button>
        </div>
      </form>

      {/* 2. CRM Integration Card */}
      <form className="tims-admin-card" onSubmit={handleSaveCrm}>
        {crmMessage && (
          <div
            style={{
              marginBottom: "1.25rem",
              padding: "0.85rem 1.15rem",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontWeight: 600,
              background: crmMessage.type === "success" ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
              color: crmMessage.type === "success" ? "#15803d" : "#b91c1c",
              border: crmMessage.type === "success" ? "1px solid rgba(34, 197, 94, 0.25)" : "1px solid rgba(239, 68, 68, 0.25)",
            }}
          >
            {crmMessage.type === "success" ? "✓ " : "✕ "}
            {crmMessage.text}
          </div>
        )}

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
                  background: !isCrmConfigured
                    ? "#f1f5f9"
                    : crmTestResult
                    ? crmTestResult.success
                      ? "rgba(34, 197, 94, 0.15)"
                      : "rgba(239, 68, 68, 0.15)"
                    : "rgba(34, 197, 94, 0.15)",
                  color: !isCrmConfigured
                    ? "#64748b"
                    : crmTestResult
                    ? crmTestResult.success
                      ? "#15803d"
                      : "#b91c1c"
                    : "#15803d",
                }}
              >
                {!isCrmConfigured
                  ? "○ Not configured"
                  : crmTestResult
                  ? crmTestResult.success
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

        {crmTestResult && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              background: crmTestResult.success ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
              color: crmTestResult.success ? "#15803d" : "#b91c1c",
              border: crmTestResult.success ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            {crmTestResult.message}
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
          <button
            type="submit"
            className="tims-admin-save-button"
            disabled={crmSaving}
          >
            {crmSaving ? "Saving..." : "Save CRM Settings"}
          </button>

          <button
            type="button"
            onClick={handleTestCrmConnection}
            disabled={crmTesting || (!crmConfig.hasApiKey && !crmConfig.apiKey)}
            style={{
              padding: "0.65rem 1.25rem",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              cursor: crmTesting || (!crmConfig.hasApiKey && !crmConfig.apiKey) ? "not-allowed" : "pointer",
              opacity: crmTesting || (!crmConfig.hasApiKey && !crmConfig.apiKey) ? 0.6 : 1,
            }}
          >
            {crmTesting ? "Testing Connection..." : "Test CRM Connection"}
          </button>
        </div>
      </form>
    </div>
  );
}
