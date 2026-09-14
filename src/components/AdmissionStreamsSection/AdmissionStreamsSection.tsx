"use client";

import { useEffect, useState, type ReactNode } from "react";
import "./tims-admission-streams.css";

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

type Stream = {
  number: string;
  title: string;
  text: ReactNode;
  image?: string;
};

export default function AdmissionStreamsSection() {
  const [dynamicCards, setDynamicCards] = useState<Stream[] | null>(null);

  useEffect(() => {
    // 1. Try loading cached cards from localStorage
    try {
      const cached = localStorage.getItem("tims_sslc_cards");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const published = parsed
            .filter((c: any) => c.section === "admission" && c.status === "Published")
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
          if (published.length > 0) {
            setDynamicCards(
              published.map((c: any, idx: number) => ({
                number: c.number || String(idx + 1).padStart(2, "0"),
                title: c.heading,
                image: c.image,
                text: (
                  <div
                    className="tims-admission-card-text"
                    dangerouslySetInnerHTML={{ __html: c.descriptionHtml }}
                  />
                ),
              }))
            );
          } else {
            setDynamicCards([]);
          }
        }
      }
    } catch {}

    // 2. Fetch latest cards from API
    fetch("/api/sslc-content-cards")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.cards)) {
          try {
            localStorage.setItem("tims_sslc_cards", JSON.stringify(data.cards));
          } catch {}
          const publishedAdmissionCards = data.cards
            .filter((c: any) => c.section === "admission" && c.status === "Published")
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

          if (publishedAdmissionCards.length > 0) {
            const mapped: Stream[] = publishedAdmissionCards.map((c: any, idx: number) => ({
              number: c.number || String(idx + 1).padStart(2, "0"),
              title: c.heading,
              image: c.image,
              text: (
                <div
                  className="tims-admission-card-text"
                  dangerouslySetInnerHTML={{ __html: c.descriptionHtml }}
                />
              ),
            }));
            setDynamicCards(mapped);
          } else {
            setDynamicCards([]);
          }
        }
      })
      .catch((err) => console.error("Failed to load admission cards:", err));
  }, []);

  // Only show cards when added/published from admin panel
  if (!dynamicCards || dynamicCards.length === 0) {
    return null;
  }

  return (
    <section className="tims-admission-section">
      <span className="tims-admission-blob" aria-hidden="true" />

      <div className="tims-admission-inner">
        <div className="tims-admission-header">
          <span className="tims-admission-label">Admissions</span>
          <h2 className="tims-admission-heading">Two Ways to Get Admitted</h2>
          <p className="tims-admission-subtitle">
            Choose the admission stream that matches your situation &mdash; whether
            you&rsquo;re starting fresh or need to save a year lost to a failed board exam.
          </p>
        </div>

        <div className="tims-admission-grid">
          {dynamicCards.map((stream, idx) => (
            <article className="tims-admission-card" key={stream.title + idx}>
              <div className="tims-admission-card-media">
                <span className="tims-admission-card-number">{stream.number}</span>
                {stream.image ? (
                  <img
                    src={stream.image}
                    alt={stream.title}
                    className="tims-admission-card-media-img"
                  />
                ) : (
                  <>
                    <span className="tims-admission-card-media-icon">
                      <ImageIcon />
                    </span>
                    <span className="tims-admission-card-media-hint">Image coming soon</span>
                  </>
                )}
              </div>

              <div className="tims-admission-card-body">
                <h3 className="tims-admission-card-title">{stream.title}</h3>
                {typeof stream.text === "string" ? (
                  <p className="tims-admission-card-text">{stream.text}</p>
                ) : (
                  stream.text
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
