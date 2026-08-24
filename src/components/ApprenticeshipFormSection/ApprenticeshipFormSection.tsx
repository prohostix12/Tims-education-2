"use client";

import "./tims-apprenticeship-form.css";

const perks = [
  "Guided admission support",
  "Credit assessment for your experience",
  "Flexible online & weekend classes",
];

export default function ApprenticeshipFormSection() {
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
          <form
            className="tims-apprenticeship-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="tims-apprenticeship-form-group">
              <span className="tims-apprenticeship-form-field-label">Your Name</span>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="tims-apprenticeship-form-field"
              />
            </label>

            <label className="tims-apprenticeship-form-group">
              <span className="tims-apprenticeship-form-field-label">Your Phone Number</span>
              <input
                type="tel"
                name="phone"
                placeholder="+91 00000 00000"
                className="tims-apprenticeship-form-field"
              />
            </label>

            <label className="tims-apprenticeship-form-group tims-apprenticeship-form-group--full">
              <span className="tims-apprenticeship-form-field-label">Your Email</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="tims-apprenticeship-form-field"
              />
            </label>

            <label className="tims-apprenticeship-form-group tims-apprenticeship-form-group--full">
              <span className="tims-apprenticeship-form-field-label">Program</span>
              <select name="program" defaultValue="" className="tims-apprenticeship-form-field">
                <option value="" disabled>
                  Please Choose an Option
                </option>
                <option value="bba">BBA</option>
                <option value="bcom">B.Com</option>
                <option value="bca">BCA</option>
                <option value="bsc-it">B.Sc IT</option>
                <option value="btech">B.Tech</option>
                <option value="ba">BA</option>
                <option value="mba">MBA</option>
                <option value="mcom">M.Com</option>
                <option value="mca">MCA</option>
                <option value="mtech">M.Tech</option>
              </select>
            </label>

            <label className="tims-apprenticeship-form-group tims-apprenticeship-form-group--full">
              <span className="tims-apprenticeship-form-field-label">Message</span>
              <textarea
                name="message"
                placeholder="Tell us about your experience and goals..."
                className="tims-apprenticeship-form-field"
              />
            </label>

            <button type="submit" className="tims-apprenticeship-form-submit">
              Submit Now
            </button>

            <p className="tims-apprenticeship-form-note">
              This form is for demonstration only and does not submit anywhere yet.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
