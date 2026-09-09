"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./HomeGallerySection.module.css";

const fallbackImages = [
  "/images/distance-education-student.jpg",
  "/images/tims_logo/tims_favicon.png",
  "/images/distance-education-student.jpg",
  "/images/distance-education-student.jpg",
  "/images/tims_logo/tims_favicon.png",
  "/images/distance-education-student.jpg",
  "/images/tims_logo/tims_favicon.png",
  "/images/distance-education-student.jpg",
  "/images/distance-education-student.jpg",
];

function ArrowIcon() {
  return (
    <svg
      className={styles.arrowIcon}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomeGallerySection() {
  const [images, setImages] = useState<string[]>(fallbackImages);

  useEffect(() => {
    async function fetchGalleryImages() {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            if (data && Array.isArray(data.sections)) {
              const allFetchedImages: string[] = [];
              data.sections.forEach((sec: { images?: string[] }) => {
                if (Array.isArray(sec.images)) {
                  allFetchedImages.push(...sec.images);
                }
              });

              if (allFetchedImages.length > 0) {
                let combined = [...allFetchedImages];
                while (combined.length < 5) {
                  combined = combined.concat(fallbackImages);
                }
                setImages(combined);
              }
            }
          }
        }
      } catch (err) {
        console.error("Could not fetch gallery images for home section:", err);
      }
    }

    fetchGalleryImages();
  }, []);

  // Sequential diagonal editorial stack items
  const displayItems = [
    { src: images[0] || fallbackImages[0], className: styles.item1 },
    { src: images[1] || fallbackImages[1], className: styles.item2 },
    { src: images[2] || fallbackImages[2], className: styles.item3 },
    { src: images[3] || fallbackImages[3], className: styles.item4 },
    { src: images[4] || fallbackImages[4], className: styles.item5 },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Left Copy & CTA */}
        <div className={styles.leftContent}>
          <span className={styles.eyebrow}>Our Gallery</span>
          <h2 className={styles.heading}>
            Stories Worth Seeing &ndash; Capturing Moments Across Campus
          </h2>
          <p className={styles.subtitle}>
            A glimpse into moments, achievements, and experiences that inspire our students and community at TIMS Education.
          </p>
          <Link href="/gallery" className={styles.exploreBtn}>
            <span>Explore Gallery</span>
            <ArrowIcon />
          </Link>
        </div>

        {/* Right Animated Diagonal Editorial Collage */}
        <div className={styles.rightContainer}>
          <div className={styles.diagonalCanvas}>
            {displayItems.map((item, idx) => (
              <Link
                key={`diag-item-${idx}`}
                href="/gallery"
                className={`${styles.diagonalItem} ${item.className}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={`TIMS Gallery highlight ${idx + 1}`}
                  className={styles.diagonalImg}
                  loading="lazy"
                />
                <span className={styles.cardGlow} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
