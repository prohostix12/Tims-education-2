import type { ReactNode } from "react";
import "../SslcDistanceEducationSection/tims-sslc-distance.css";

function Highlight({ children }: { children: ReactNode }) {
  return <strong className="tims-sslc-distance-highlight">{children}</strong>;
}

export default function CreditTransferRestartSection() {
  return (
    <section className="tims-sslc-distance-section" style={{ backgroundColor: "#F6F2E7" }}>
      <div className="tims-sslc-distance-inner">
        <div className="tims-sslc-distance-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/creditTransfer.jpg"
            alt="Restart Your Studies Smoothly Through Credit Transfer at TIMS Education"
            className="tims-sslc-distance-img"
          />
        </div>

        <div>
          <span className="tims-sslc-distance-eyebrow">Continue Where You Left Off</span>
          <h2 className="tims-sslc-distance-title">
            Restart Your Studies Smoothly Through Credit Transfer
          </h2>

          <p className="tims-sslc-distance-text">
            Many students pause their education for reasons they never planned &mdash; work
            pressure, family needs, or simply life getting in the way. When they&rsquo;re
            ready to continue, starting from the beginning can feel discouraging. That&rsquo;s
            where <Highlight>credit transfer</Highlight> becomes a real relief. It lets you
            carry forward the subjects you&rsquo;ve already completed, so your earlier effort
            isn&rsquo;t wasted.
          </p>

          <p className="tims-sslc-distance-text">
            At TIMS Education, we meet a lot of learners who just want a fair way to finish
            what they started. With <Highlight>credit transfer</Highlight>, they can join a
            new program without repeating everything, which saves both time and energy. We
            sit with them, check their old mark lists, and help them understand how the
            process works in a simple, clear way.
          </p>

          <p className="tims-sslc-distance-text">
            If you&rsquo;ve been thinking about restarting your studies,{" "}
            <Highlight>credit transfer</Highlight> can help you move ahead more quickly. With
            the right guidance, your <Highlight>credit transfer</Highlight> process becomes
            smooth, sensible, and much easier than you expect.
          </p>
        </div>
      </div>
    </section>
  );
}
