import type { ReactNode } from "react";
import "../SslcDistanceEducationSection/tims-sslc-distance.css";

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m4.5 17 4.8-5 3.4 3.6 2.4-2.6 4.4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return <strong className="tims-sslc-distance-highlight">{children}</strong>;
}

export default function AttestationTrustSection() {
  return (
    <section className="tims-sslc-distance-section">
      <div className="tims-sslc-distance-inner">
        <div className="tims-sslc-distance-media">
          <div className="tims-sslc-distance-media-placeholder">
            <span className="tims-sslc-distance-media-icon">
              <ImageIcon />
            </span>
            <span className="tims-sslc-distance-media-hint">Image coming soon</span>
          </div>
        </div>

        <div>
          <span className="tims-sslc-distance-eyebrow">Documentation Support</span>
          <h2 className="tims-sslc-distance-title">
            Trusted Certificate Attestation Services for Students and Professionals
          </h2>

          <p className="tims-sslc-distance-text">
            For a lot of students and professionals, the attestation process is the first
            thing they have to do before they can go abroad. It can be a bit tough &mdash;
            especially if you don&rsquo;t know which office to go to or what each stamp means.
            That&rsquo;s why we make sure that our{" "}
            <Highlight>certificate attestation services</Highlight> are quick and easy. We
            help to get things done right, which helps to avoid all related problems.
          </p>

          <p className="tims-sslc-distance-text">
            At TIMS Education, we meet a lot of people who need{" "}
            <Highlight>certificate attestation services</Highlight> for higher studies, job
            placement, or immigration procedures. Most of them simply want someone
            trustworthy to handle the paperwork without delays. We collect the documents,
            process them through the right departments, and make sure everything is completed
            properly.
          </p>

          <p className="tims-sslc-distance-text">
            If you&rsquo;re unsure where to begin, our{" "}
            <Highlight>certificate attestation services</Highlight> give you a steady starting
            point. With careful handling and clear updates, our{" "}
            <Highlight>certificate attestation services</Highlight> help you move ahead with
            confidence.
          </p>
        </div>
      </div>
    </section>
  );
}
