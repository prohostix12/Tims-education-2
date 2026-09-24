"use client";

import { useEffect, useState, FormEvent } from "react";
import type { OfficeInfo, SocialInfo } from "@/app/api/contact-info/route";
import type { DepartmentContact } from "@/lib/departmentContactsDb";

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

  // Department Contacts state
  const [departmentContacts, setDepartmentContacts] = useState<DepartmentContact[]>([]);
  const [deptForm, setDeptForm] = useState({
    departmentName: "",
    description: "",
    landline: "",
    mobile: "",
    email: "",
  });
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [savingDept, setSavingDept] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function fetchAllContactInfo() {
      try {
        const [contactRes, deptRes] = await Promise.all([
          fetch("/api/contact-info", { cache: "no-store" }),
          fetch("/api/department-contacts", { cache: "no-store" }),
        ]);

        if (contactRes.ok) {
          const data = await contactRes.json();
          if (data.contactInfo) {
            if (Array.isArray(data.contactInfo.offices) && data.contactInfo.offices.length > 0) {
              setOffices(data.contactInfo.offices);
            }
            if (data.contactInfo.socials) {
              setSocials(data.contactInfo.socials);
            }
          }
        }

        if (deptRes.ok) {
          const deptData = await deptRes.json();
          if (Array.isArray(deptData.contacts)) {
            setDepartmentContacts(deptData.contacts);
          }
        }
      } catch (error) {
        console.error("Failed to load contact details:", error);
        setStatusMessage({ type: "error", text: "Failed to load current contact details from server." });
      } finally {
        setLoading(false);
      }
    }

    fetchAllContactInfo();
  }, []);

  // Department contact handlers
  const handleDeptSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!deptForm.departmentName.trim()) {
      setStatusMessage({ type: "error", text: "Department Name is required." });
      return;
    }

    setSavingDept(true);
    setStatusMessage(null);

    try {
      if (editingDeptId) {
        // Update existing contact
        const res = await fetch(`/api/department-contacts/${editingDeptId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deptForm),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update department contact.");

        setDepartmentContacts((prev) =>
          prev.map((item) =>
            item.id === editingDeptId || item._id === editingDeptId
              ? { ...item, ...deptForm }
              : item
          )
        );
        setStatusMessage({ type: "success", text: "Department contact updated successfully!" });
        setEditingDeptId(null);
      } else {
        // Add new contact
        const res = await fetch("/api/department-contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deptForm),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add department contact.");

        if (data.contact) {
          setDepartmentContacts((prev) => [...prev, data.contact]);
        }
        setStatusMessage({ type: "success", text: "Department contact added successfully!" });
      }

      setDeptForm({
        departmentName: "",
        description: "",
        landline: "",
        mobile: "",
        email: "",
      });
    } catch (error: unknown) {
      console.error("Department contact save error:", error);
      const errMsg = error instanceof Error ? error.message : "Failed to save contact.";
      setStatusMessage({ type: "error", text: errMsg });
    } finally {
      setSavingDept(false);
    }
  };

  const handleEditDept = (contact: DepartmentContact) => {
    setEditingDeptId(contact.id || contact._id || null);
    setDeptForm({
      departmentName: contact.departmentName || "",
      description: contact.description || "",
      landline: contact.landline || "",
      mobile: contact.mobile || "",
      email: contact.email || "",
    });
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleCancelDeptEdit = () => {
    setEditingDeptId(null);
    setDeptForm({
      departmentName: "",
      description: "",
      landline: "",
      mobile: "",
      email: "",
    });
  };

  const handleDeleteDept = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department contact?")) return;

    try {
      const res = await fetch(`/api/department-contacts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete contact.");
      }

      setDepartmentContacts((prev) => prev.filter((item) => item.id !== id && item._id !== id));
      setStatusMessage({ type: "success", text: "Department contact deleted successfully." });
    } catch (error: unknown) {
      console.error("Delete contact error:", error);
      const errMsg = error instanceof Error ? error.message : "Failed to delete contact.";
      setStatusMessage({ type: "error", text: errMsg });
    }
  };

  // Office locations handlers
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

  const handleOfficeSubmit = async (e: FormEvent) => {
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

      setStatusMessage({ type: "success", text: "Office details and social accounts updated successfully!" });
    } catch (error: unknown) {
      console.error("Save error:", error);
      const errMsg = error instanceof Error ? error.message : "Failed to save. Please try again.";
      setStatusMessage({ type: "error", text: errMsg });
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
          Manage department contacts (Front Office, Student Affairs, Finance, etc.), office locations, phone numbers, and social media.
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

      {/* 1. Add / Edit Department Contact Form Card (Matching Image 2 Reference) */}
      <div className="tims-admin-card" style={{ background: "#ffffff", borderRadius: "16px", padding: "1.75rem", border: "1px solid var(--aa-border)" }}>
        <h2 className="tims-admin-card-title" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#14161c", marginBottom: "1.25rem" }}>
          {editingDeptId ? "Edit Department Contact" : "Add New Contact"}
        </h2>

        <form onSubmit={handleDeptSubmit}>
          <div className="tims-admin-field">
            <label className="tims-admin-label" htmlFor="dept-name">
              Department Name
            </label>
            <input
              id="dept-name"
              type="text"
              className="tims-admin-input"
              placeholder=""
              value={deptForm.departmentName}
              onChange={(e) => setDeptForm({ ...deptForm, departmentName: e.target.value })}
              required
            />
          </div>

          <div className="tims-admin-field">
            <label className="tims-admin-label" htmlFor="dept-desc">
              Description <span style={{ fontWeight: 400, color: "#6b7686" }}>(optional)</span>
            </label>
            <input
              id="dept-desc"
              type="text"
              className="tims-admin-input"
              placeholder=""
              value={deptForm.description}
              onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
            />
          </div>

          <div className="tims-admin-grid-2">
            <div className="tims-admin-field">
              <label className="tims-admin-label" htmlFor="dept-landline">
                Landline Phone
              </label>
              <input
                id="dept-landline"
                type="text"
                className="tims-admin-input"
                placeholder=""
                value={deptForm.landline}
                onChange={(e) => setDeptForm({ ...deptForm, landline: e.target.value })}
              />
            </div>

            <div className="tims-admin-field">
              <label className="tims-admin-label" htmlFor="dept-mobile">
                Mobile Number
              </label>
              <input
                id="dept-mobile"
                type="text"
                className="tims-admin-input"
                placeholder=""
                value={deptForm.mobile}
                onChange={(e) => setDeptForm({ ...deptForm, mobile: e.target.value })}
              />
            </div>
          </div>

          <div className="tims-admin-field">
            <label className="tims-admin-label" htmlFor="dept-email">
              Email Address
            </label>
            <input
              id="dept-email"
              type="email"
              className="tims-admin-input"
              placeholder=""
              value={deptForm.email}
              onChange={(e) => setDeptForm({ ...deptForm, email: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
            {editingDeptId && (
              <button
                type="button"
                onClick={handleCancelDeptEdit}
                className="tims-admin-secondary-button"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={savingDept}
              style={{
                background: "#800000",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                padding: "0.75rem 1.75rem",
                fontWeight: 700,
                fontSize: "0.9375rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "opacity 0.2s ease",
                opacity: savingDept ? 0.7 : 1,
              }}
            >
              {savingDept
                ? "Saving..."
                : editingDeptId
                ? "Update Contact"
                : "+ Add Contact"}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Existing Department Contacts List */}
      <div className="tims-admin-card">
        <h2 className="tims-admin-card-title">Department Contacts List</h2>
        <p className="tims-admin-subtitle" style={{ marginBottom: "1.25rem" }}>
          These section-wise contact details are displayed on the public Contact page (bottom of office address & enquiry form).
        </p>

        {departmentContacts.length === 0 ? (
          <p style={{ color: "var(--aa-muted)", fontStyle: "italic" }}>
            No department contacts added yet. Use the form above to add contact details for Front Office, Student Affairs, Accounts & Finance, etc.
          </p>
        ) : (
          <div className="tims-admin-table-wrap">
            <table className="tims-admin-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Description</th>
                  <th>Landline / Mobile</th>
                  <th>Email</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departmentContacts.map((contact) => {
                  const id = contact.id || contact._id || "";
                  const phones = [contact.landline, contact.mobile].filter(Boolean).join(" / ");
                  return (
                    <tr key={id}>
                      <td style={{ fontWeight: 700, color: "var(--aa-navy)" }}>{contact.departmentName}</td>
                      <td style={{ color: "var(--aa-muted)", fontSize: "0.875rem" }}>
                        {contact.description || "—"}
                      </td>
                      <td>{phones || "—"}</td>
                      <td>
                        {contact.email ? (
                          <a href={`mailto:${contact.email}`} style={{ color: "#2563eb", textDecoration: "underline" }}>
                            {contact.email}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                          <button
                            type="button"
                            onClick={() => handleEditDept(contact)}
                            className="tims-admin-secondary-button"
                            style={{ padding: "0.35rem 0.75rem", fontSize: "0.8125rem" }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDept(id)}
                            className="tims-admin-danger-button"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Office Locations & Social Media Accounts Form */}
      <form onSubmit={handleOfficeSubmit}>
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
            {saving ? "Saving Changes..." : "Save Office Locations & Socials"}
          </button>
        </div>
      </form>
    </div>
  );
}
