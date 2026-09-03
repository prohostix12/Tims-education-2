"use client";

import { useEffect, useState } from "react";
import styles from "./GallerySection.module.css";

type GallerySectionData = {
  id: string;
  sectionName: string;
  images: string[];
};

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function GallerySection() {
  const [sections, setSections] = useState<GallerySectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            if (data && Array.isArray(data.sections)) {
              const randomizedSections = data.sections.map((sec: GallerySectionData) => ({
                ...sec,
                images: Array.isArray(sec.images) ? shuffleArray(sec.images) : [],
              }));
              setSections(randomizedSections);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load gallery:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  const filteredSections = activeFilter === "ALL"
    ? sections
    : sections.filter((s) => s.id === activeFilter);

  const hasPhotos = sections.some((s) => s.images && s.images.length > 0);

  return (
    <div className={styles.galleryPageWrapper}>
      <section className={styles.gallerySection}>
      <p className={styles.intro}>
        Explore memory highlights, campus life, convocation, workshops, and special events at TIMS Education.
      </p>

      {/* Filter Tabs */}
      {!loading && sections.length > 1 && (
        <div className={styles.filterBar}>
          <button
            type="button"
            className={`${styles.filterBtn} ${activeFilter === "ALL" ? styles.filterBtnActive : ""}`}
            onClick={() => setActiveFilter("ALL")}
          >
            All Events
          </button>
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`${styles.filterBtn} ${activeFilter === section.id ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveFilter(section.id)}
            >
              {section.sectionName}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className={styles.loadingState}>
          <p style={{ margin: 0, fontWeight: 600 }}>Loading gallery photos...</p>
        </div>
      ) : !hasPhotos ? (
        <div className={styles.emptyState}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "1.1rem" }}>No gallery events published yet.</p>
          <p style={{ margin: "0.4rem 0 0", fontSize: "0.9375rem" }}>
            Check back soon for photo updates of our recent events and campus activities.
          </p>
        </div>
      ) : (
        <div>
          {filteredSections.map((section) => {
            if (!section.images || section.images.length === 0) return null;

            return (
              <div key={section.id} className={styles.eventBlock}>
                <div className={styles.eventHeader}>
                  <div className={styles.eventTitleWrapper}>
                    <div className={styles.eventAccentBar} />
                    <h2 className={styles.eventTitle}>{section.sectionName}</h2>
                  </div>
                  <span className={styles.badge}>
                    {section.images.length} {section.images.length === 1 ? "Photo" : "Photos"}
                  </span>
                </div>

                <div className={styles.masonryGrid}>
                  {section.images.map((imgUrl, idx) => (
                    <div key={idx} className={styles.masonryCard}>
                      <img
                        src={imgUrl}
                        alt={`${section.sectionName} photo ${idx + 1}`}
                        className={styles.cardImg}
                        loading="lazy"
                      />
                      <div className={styles.cardHoverFrame} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
    </div>
  );
}
