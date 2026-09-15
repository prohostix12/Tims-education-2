import type { ReactNode } from "react";
import "../SslcDistanceEducationSection/tims-sslc-distance.css";

function Highlight({ children }: { children: ReactNode }) {
  return <strong className="tims-sslc-distance-highlight">{children}</strong>;
}

export default function JamiaUrduHeritageSection() {
  return (
    <section className="tims-sslc-distance-section">
      <div className="tims-sslc-distance-inner">
        <div className="tims-sslc-distance-media" style={{ background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.75rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://juaonline.in/website-assets/web/approval-slider-2.webp"
            alt="Jamia Urdu Aligarh Approval Letter"
            style={{ width: "100%", height: "100%", aspectRatio: "4 / 5", objectFit: "contain", display: "block" }}
          />
        </div>

        <div>
          <span className="tims-sslc-distance-eyebrow">Language &amp; Culture</span>
          <h2 className="tims-sslc-distance-title">
            Jamia Urdu Aligarh &ndash; Preserving the Beauty and Heritage of the Urdu Language
          </h2>

          <p className="tims-sslc-distance-text">
            The Jamia Urdu Aligarh has always tried to keep a proud language and its
            traditions intact. We provide <Highlight>Urdu language and culture education</Highlight>{" "}
            because we believe that a language is more than just words &mdash; it has meaning,
            identity, and stories. Many of our students want to reconnect with their roots or
            learn Urdu in a way that is meaningful to them.
          </p>

          <p className="tims-sslc-distance-text">
            We make <Highlight>Urdu language and culture education</Highlight> easy and fun for
            everyone. Whether they are just starting out or picking up where they left off,
            it&rsquo;s now easier than ever. We slowly guide students, which helps them
            understand how beautiful Urdu literature is and its related culture. Over time,
            they learn the language better and also know the value of customs that go along
            with it.
          </p>

          <p className="tims-sslc-distance-text">
            For anyone looking to explore their heritage, our{" "}
            <Highlight>Urdu language and culture education</Highlight> creates a genuine space
            to learn and grow. It&rsquo;s a chance to strengthen your connection to a language
            that has shaped generations.
          </p>
        </div>
      </div>
    </section>
  );
}
