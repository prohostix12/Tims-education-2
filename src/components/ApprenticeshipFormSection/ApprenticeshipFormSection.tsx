"use client";

import { useEnquiryForm } from "@/lib/useEnquiryForm";
import "./tims-apprenticeship-form.css";

const perks = [
  "Guided admission support",
  "Credit assessment for your experience",
  "Flexible online & weekend classes",
];

export default function ApprenticeshipFormSection() {
  const { status, errorMessage, handleSubmit } = useEnquiryForm("apprenticeship-page");

  return (
    <section className="tims-apprenticeship-form-section">
      <div className="tims-apprenticeship-form-card">
        <div className="tims-apprenticeship-form-pitch">
          <span className="tims-apprenticeship-form-label">Enquire Now</span>
          <h2 className="tims-apprenticeship-form-heading">Apply for EALP</h2>
          <p className="tims-apprenticeship-form-subtitle">
            Share your details and our team will get in touch to guide you through the
            Employee Apprenticeship-Based Learning Program.
          </p>

          <ul className="tims-apprenticeship-form-perks">
            {perks.map((perk) => (
              <li className="tims-apprenticeship-form-perk" key={perk}>
                <span className="tims-apprenticeship-form-perk-dot" aria-hidden="true">
                  &#10003;
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="tims-apprenticeship-form-panel">
          <form className="tims-apprenticeship-form" onSubmit={handleSubmit}>
            <label className="tims-apprenticeship-form-group">
              <span className="tims-apprenticeship-form-field-label">First Name *</span>
              <input
                type="text"
                name="firstName"
                required
                placeholder="Enter your first name"
                className="tims-apprenticeship-form-field"
              />
            </label>

            <label className="tims-apprenticeship-form-group">
              <span className="tims-apprenticeship-form-field-label">Last Name *</span>
              <input
                type="text"
                name="lastName"
                required
                placeholder="Enter your last name"
                className="tims-apprenticeship-form-field"
              />
            </label>

            <label className="tims-apprenticeship-form-group tims-apprenticeship-form-group--full">
              <span className="tims-apprenticeship-form-field-label">Phone Number *</span>
              <input
                type="tel"
                name="phoneNumber"
                required
                placeholder="Enter your phone number"
                className="tims-apprenticeship-form-field"
              />
            </label>

            <label className="tims-apprenticeship-form-group tims-apprenticeship-form-group--full">
              <span className="tims-apprenticeship-form-field-label">Email *</span>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                className="tims-apprenticeship-form-field"
              />
            </label>

            <label className="tims-apprenticeship-form-group tims-apprenticeship-form-group--full">
              <span className="tims-apprenticeship-form-field-label">Company</span>
              <input
                type="text"
                name="company"
                placeholder="Enter your company name"
                className="tims-apprenticeship-form-field"
              />
            </label>

            <label className="tims-apprenticeship-form-group tims-apprenticeship-form-group--full">
              <span className="tims-apprenticeship-form-field-label">Enquiry *</span>
              <textarea
                name="enquiry"
                required
                placeholder="Tell us how we can help you"
                className="tims-apprenticeship-form-field"
                rows={2}
              />
            </label>

            <button
              type="submit"
              className="tims-apprenticeship-form-submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sending..." : "Submit Now"}
            </button>

            {status === "success" && (
              <p style={{ color: "#16a34a", fontWeight: 700, fontSize: "0.875rem", margin: "0.5rem 0 0" }}>
                ✓ Thanks! We&rsquo;ll get in touch with you shortly.
              </p>
            )}

            {status === "error" && (
              <p style={{ color: "#dc2626", fontWeight: 600, fontSize: "0.875rem", margin: "0.5rem 0 0" }}>
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
