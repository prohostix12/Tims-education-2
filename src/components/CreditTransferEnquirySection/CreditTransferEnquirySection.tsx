"use client";

import { useEnquiryForm } from "@/lib/useEnquiryForm";
import "../CreditTransferSection/tims-credit-transfer.css";

const perks = [
  "100% Free Credit Evaluation & Guidance",
  "Carry Forward Completed Subjects & Save Time",
  "Partnered with UGC Recognized Universities",
];

export default function CreditTransferEnquirySection() {
  const { status, errorMessage, handleSubmit } = useEnquiryForm("credit-transfer-page");

  return (
    <section className="tims-credit-section" style={{ paddingTop: 0 }}>
      <div className="tims-credit-inner">
        <div className="tims-credit-card tims-credit-form-card">
          <div className="tims-credit-form-grid">
            <div className="tims-credit-form-pitch">
              <span className="tims-credit-label">ENQUIRE NOW</span>
              <h2 className="tims-credit-card-title" style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>
                Apply for Credit Transfer
              </h2>
              <p className="tims-credit-text">
                Fill out the form below to receive a personalized credit evaluation. Our academic counselors will review your previous mark lists and guide you through a seamless transfer process.
              </p>

              <ul className="tims-credit-form-perks">
                {perks.map((perk) => (
                  <li key={perk} className="tims-credit-form-perk">
                    <span className="tims-credit-form-perk-check">✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tims-credit-form-wrap">
              <form onSubmit={handleSubmit} className="tims-credit-form">
                <div className="tims-credit-form-field">
                  <label htmlFor="ct-name" className="tims-credit-form-label">
                    Full Name *
                  </label>
                  <input
                    id="ct-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="tims-credit-form-input"
                  />
                </div>

                <div className="tims-credit-form-row">
                  <div className="tims-credit-form-field">
                    <label htmlFor="ct-email" className="tims-credit-form-label">
                      Email Address *
                    </label>
                    <input
                      id="ct-email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="tims-credit-form-input"
                    />
                  </div>

                  <div className="tims-credit-form-field">
                    <label htmlFor="ct-phone" className="tims-credit-form-label">
                      Phone Number *
                    </label>
                    <input
                      id="ct-phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91 00000 00000"
                      className="tims-credit-form-input"
                    />
                  </div>
                </div>

                <div className="tims-credit-form-field">
                  <label htmlFor="ct-preference" className="tims-credit-form-label">
                    Preferred Stream / Course *
                  </label>
                  <select
                    id="ct-preference"
                    name="preference"
                    required
                    className="tims-credit-form-select"
                    defaultValue="credit-transfer"
                  >
                    <option value="credit-transfer">B.Tech / Degree Credit Transfer</option>
                    <option value="btech-mtech">Btech / Mtech</option>
                    <option value="online-degree">Online Degree</option>
                    <option value="diploma">Diploma</option>
                    <option value="post-graduation">Post Graduation</option>
                    <option value="sslc-plus-two">SSLC / Plus Two</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="tims-credit-form-btn"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Submitting Request..." : "Submit Enquiry"}
                </button>

                {status === "success" && (
                  <p className="tims-credit-form-success">
                    ✓ Thank you! Your credit transfer enquiry has been submitted. Our team will contact you shortly.
                  </p>
                )}
                {status === "error" && (
                  <p className="tims-credit-form-error">
                    {errorMessage || "Failed to submit enquiry. Please try again."}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
