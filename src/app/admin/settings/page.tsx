"use client";

import type { FormEvent } from "react";

export default function AdminSettingsPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // UI only for now — no backend wiring.
  };

  return (
    <div>
      <div className="tims-admin-page-header">
        <span className="tims-admin-eyebrow">Configuration</span>
        <h1 className="tims-admin-heading">Settings</h1>
        <p className="tims-admin-subtitle">Basic site details. UI only — nothing is saved yet.</p>
      </div>

      <form className="tims-admin-card" onSubmit={handleSubmit}>
        <h2 className="tims-admin-card-title">Site Details</h2>

        <div className="tims-admin-field">
          <label className="tims-admin-label" htmlFor="site-name">
            Site Name
          </label>
          <input id="site-name" className="tims-admin-input" type="text" defaultValue="TIMS Education" />
        </div>

        <div className="tims-admin-field">
          <label className="tims-admin-label" htmlFor="contact-email">
            Contact Email
          </label>
          <input id="contact-email" className="tims-admin-input" type="email" defaultValue="info@timseducation.com" />
        </div>

        <div className="tims-admin-field">
          <label className="tims-admin-label" htmlFor="contact-phone">
            Contact Phone
          </label>
          <input id="contact-phone" className="tims-admin-input" type="tel" defaultValue="+91 7736 1115 88" />
        </div>

        <div className="tims-admin-field">
          <label className="tims-admin-label" htmlFor="site-description">
            Site Description
          </label>
          <textarea id="site-description" className="tims-admin-textarea" rows={3} defaultValue="TIMS Education - Learning Without Boundaries" />
        </div>

        <button type="submit" className="tims-admin-save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
}
