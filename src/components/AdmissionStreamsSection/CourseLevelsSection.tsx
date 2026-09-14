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

type CourseLevel = {
  badge: ReactNode;
  title: string;
  text: ReactNode;
  image?: string;
};

export default function CourseLevelsSection() {
  const [dynamicLevels, setDynamicLevels] = useState<CourseLevel[] | null>(null);

  useEffect(() => {
    // 1. Try loading cached cards from localStorage
    try {
      const cached = localStorage.getItem("tims_sslc_cards");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const published = parsed
            .filter((c: any) => c.section === "course-structure" && c.status === "Published")
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
          if (published.length > 0) {
            setDynamicLevels(
              published.map((c: any, idx: number) => ({
                badge: c.number || String(idx + 1).padStart(2, "0"),
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
            setDynamicLevels([]);
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
          const publishedCourseStructureCards = data.cards
            .filter((c: any) => c.section === "course-structure" && c.status === "Published")
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

          if (publishedCourseStructureCards.length > 0) {
            const mapped: CourseLevel[] = publishedCourseStructureCards.map((c: any, idx: number) => ({
              badge: c.number || String(idx + 1).padStart(2, "0"),
              title: c.heading,
              image: c.image,
              text: (
                <div
                  className="tims-admission-card-text"
                  dangerouslySetInnerHTML={{ __html: c.descriptionHtml }}
                />
              ),
            }));
            setDynamicLevels(mapped);
          } else {
            setDynamicLevels([]);
          }
        }
      })
      .catch((err) => console.error("Failed to load course-structure cards:", err));
  }, []);

  // Only show cards when added/published from admin panel
  if (!dynamicLevels || dynamicLevels.length === 0) {
    return null;
  }

  return (
    <section className="tims-admission-section">
      <span className="tims-admission-blob" aria-hidden="true" />

      <div className="tims-admission-inner">
        <div className="tims-admission-header">
          <span className="tims-admission-label">Course Structure</span>
          <h2 className="tims-admission-heading">SSLC &amp; Plus Two at a Glance</h2>
          <p className="tims-admission-subtitle">
            Eligibility, subjects, and outcomes for both levels of the open schooling
            programme.
          </p>
        </div>

        <div className="tims-admission-grid">
          {dynamicLevels.map((level, idx) => (
            <article className="tims-admission-card" key={level.title + idx}>
              <div className="tims-admission-card-media">
                <span className="tims-admission-card-number">{level.badge}</span>
                {level.image ? (
                  <img
                    src={level.image}
                    alt={level.title}
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
                <h3 className="tims-admission-card-title">{level.title}</h3>
                {typeof level.text === "string" ? (
                  <p className="tims-admission-card-text">{level.text}</p>
                ) : (
                  level.text
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
