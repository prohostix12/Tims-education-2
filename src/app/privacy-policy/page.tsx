import type { Metadata } from "next";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy | TIMS Education",
  description: "Privacy Policy for TIMS Education — Learn how we protect your privacy and personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <PageHero title="Privacy Policy" />
      <section
        style={{
          padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
          background: "#faf8f3",
          minHeight: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            width: "100%",
            background: "#ffffff",
            border: "3px solid #14161c",
            borderRadius: "18px",
            padding: "clamp(2rem, 4vw, 3.5rem)",
            boxShadow: "6px 6px 0 #14161c",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <span
              style={{
                display: "inline-block",
                padding: "0.35rem 0.85rem",
                borderRadius: "20px",
                background: "#fff1f2",
                color: "#e11d48",
                border: "1.5px solid #f43f5e",
                fontSize: "0.8125rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Notice
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              fontWeight: 800,
              color: "#14161c",
              marginBottom: "1rem",
              lineHeight: 1.3,
            }}
          >
            Privacy Policy will be updated shortly.
          </h2>

          <p
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.8,
              color: "#4b5563",
              margin: 0,
            }}
          >
            <strong style={{ color: "#14161c" }}>TIMS EDUCATION</strong> is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information.
          </p>
        </div>
      </section>
    </main>
  );
}
