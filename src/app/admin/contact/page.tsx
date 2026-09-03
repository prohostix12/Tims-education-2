"use client";

import { useEffect, useState, FormEvent } from "react";
import type { OfficeInfo, SocialInfo } from "@/app/api/contact-info/route";

export default function AdminContactPage() {
  const [offices, setOffices] = useState<OfficeInfo[]>([
    {
      title: "Head Office",
      address: "",
      phone: "",
      email: "",
    },
  ]);
  const [socials, setSocials] = useState<SocialInfo>({
    youtube: "",
    facebook: "",
    instagram: "",
    x: "",
    telegram: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const res = await fetch("/api/contact-info");
        const data = await res.json();
        if (data.contactInfo) {
          if (Array.isArray(data.contactInfo.offices) && data.contactInfo.offices.length > 0) {
            setOffices(data.contactInfo.offices);
          }
          if (data.contactInfo.socials) {
            setSocials(data.contactInfo.socials);
          }
        }
      } catch (error) {
        console.error("Failed to load contact details:", error);
        setStatusMessage({ type: "error", text: "Failed to load current contact details from server." });
      } finally {
        setLoading(false);
      }
    }

    fetchContactInfo();
  }, []);

  const handleOfficeChange = (index: number, field: keyof OfficeInfo, value: string) => {
    setOffices((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddOffice = () => {
    setOffices((prev) => [
      ...prev,
      {
        title: `Branch Office ${prev.length + 1}`,
        address: "",
        phone: "",
        email: "",
      },
    ]);
  };

  const handleRemoveOffice = (index: number) => {
    if (offices.length <= 1) {
      alert("You must keep at least one office location.");
      return;
    }
    setOffices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSocialChange = (field: keyof SocialInfo, value: string) => {
    setSocials((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/contact-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offices, socials }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save contact info.");
      }

      setStatusMessage({ type: "success", text: "Contact details updated successfully!" });
    } catch (error: any) {
      console.error("Save error:", error);
      setStatusMessage({ type: "error", text: error.message || "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="tims-admin-page-header">
          <span className="tims-admin-eyebrow">Settings</span>
          <h1 className="tims-admin-heading">Contact Details</h1>
          <p className="tims-admin-subtitle">Loading contact details...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="tims-admin-page-header">
        <span className="tims-admin-eyebrow">Content & Settings</span>
        <h1 className="tims-admin-heading">Contact Details</h1>
        <p className="tims-admin-subtitle">
          Manage public office locations, detailed addresses, phone numbers, email addresses, and social media channels.
        </p>
      </div>

      {statusMessage && (
        <div
          className={
            statusMessage.type === "success" ? "tims-admin-alert-success" : "tims-admin-alert-error"
          }
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Office Locations */}
        <div className="tims-admin-card">
          <div className="tims-admin-card-header">
            <div>
              <h2 className="tims-admin-card-title" style={{ margin: 0 }}>
                Office Locations
              </h2>
              <p className="tims-admin-subtitle" style={{ margin: "0.2rem 0 0" }}>
                Add, edit, or remove office locations shown on the user contact page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddOffice}
              className="tims-admin-secondary-button"
            >
              + Add Office Location
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {offices.map((office, index) => (
              <div
                key={index}
                style={{
                  background: "#f8f9fb",
                  border: "1px solid var(--aa-border)",
                  borderRadius: "12px",
                  padding: "1.25rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--aa-navy)",
                    }}
                  >
                    Office #{index + 1}: {office.title || "Untitled Office"}
                  </h3>
                  {offices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOffice(index)}
                      className="tims-admin-danger-button"
                    >
                      Remove Office
                    </button>
                  )}
                </div>

                <div className="tims-admin-grid-2">
                  <div className="tims-admin-field">
                    <label className="tims-admin-label" htmlFor={`office-title-${index}`}>
                      Office Title
                    </label>
                    <input
                      id={`office-title-${index}`}
                      type="text"
                      className="tims-admin-input"
                      placeholder="e.g. Head Office, Edapal Office"
                      value={office.title}
                      onChange={(e) => handleOfficeChange(index, "title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="tims-admin-field">
                    <label className="tims-admin-label" htmlFor={`office-phone-${index}`}>
                      Phone Number
                    </label>
                    <input
                      id={`office-phone-${index}`}
                      type="text"
                      className="tims-admin-input"
                      placeholder="e.g. +91 9961967777"
                      value={office.phone}
                      onChange={(e) => handleOfficeChange(index, "phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="tims-admin-grid-2">
                  <div className="tims-admin-field">
                    <label className="tims-admin-label" htmlFor={`office-email-${index}`}>
                      Email Address
                    </label>
                    <input
                      id={`office-email-${index}`}
                      type="email"
                      className="tims-admin-input"
                      placeholder="e.g. info@timseducation.com"
                      value={office.email}
                      onChange={(e) => handleOfficeChange(index, "email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="tims-admin-field" style={{ marginBottom: 0 }}>
                  <label className="tims-admin-label" htmlFor={`office-address-${index}`}>
                    Detailed Location Address
                  </label>
                  <textarea
                    id={`office-address-${index}`}
                    className="tims-admin-textarea"
                    rows={3}
                    placeholder="Enter detailed street, floor, landmark, city, pin code..."
                    value={office.address}
                    onChange={(e) => handleOfficeChange(index, "address", e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Accounts */}
        <div className="tims-admin-card">
          <h2 className="tims-admin-card-title">Social Media Accounts</h2>
          <p className="tims-admin-subtitle" style={{ marginBottom: "1.25rem" }}>
            Enter the URLs for your social media channels (YouTube, Facebook, Instagram, X, Telegram).
          </p>

          <div className="tims-admin-grid-2">
            <div className="tims-admin-field">
              <label className="tims-admin-label" htmlFor="social-youtube">
                YouTube URL
              </label>
              <input
                id="social-youtube"
                type="url"
                className="tims-admin-input"
                placeholder="https://youtube.com/@..."
                value={socials.youtube}
                onChange={(e) => handleSocialChange("youtube", e.target.value)}
              />
            </div>

            <div className="tims-admin-field">
              <label className="tims-admin-label" htmlFor="social-facebook">
                Facebook URL
              </label>
              <input
                id="social-facebook"
                type="url"
                className="tims-admin-input"
                placeholder="https://facebook.com/..."
                value={socials.facebook}
                onChange={(e) => handleSocialChange("facebook", e.target.value)}
              />
            </div>

            <div className="tims-admin-field">
              <label className="tims-admin-label" htmlFor="social-instagram">
                Instagram URL
              </label>
              <input
                id="social-instagram"
                type="url"
                className="tims-admin-input"
                placeholder="https://instagram.com/..."
                value={socials.instagram}
                onChange={(e) => handleSocialChange("instagram", e.target.value)}
              />
            </div>

            <div className="tims-admin-field">
              <label className="tims-admin-label" htmlFor="social-x">
                X (Twitter) URL
              </label>
              <input
                id="social-x"
                type="url"
                className="tims-admin-input"
                placeholder="https://x.com/..."
                value={socials.x}
                onChange={(e) => handleSocialChange("x", e.target.value)}
              />
            </div>

            <div className="tims-admin-field">
              <label className="tims-admin-label" htmlFor="social-telegram">
                Telegram URL
              </label>
              <input
                id="social-telegram"
                type="url"
                className="tims-admin-input"
                placeholder="https://t.me/..."
                value={socials.telegram}
                onChange={(e) => handleSocialChange("telegram", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
          <button type="submit" className="tims-admin-save-button" disabled={saving}>
            {saving ? "Saving Changes..." : "Save Contact Info"}
          </button>
        </div>
      </form>
    </div>
  );
}
