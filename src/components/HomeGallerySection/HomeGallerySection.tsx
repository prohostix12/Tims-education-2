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
              // Extract all images from all published sections
              const allFetchedImages: string[] = [];
              data.sections.forEach((sec: { images?: string[] }) => {
                if (Array.isArray(sec.images)) {
                  allFetchedImages.push(...sec.images);
                }
              });

              if (allFetchedImages.length > 0) {
                let combined = [...allFetchedImages];
                while (combined.length < 9) {
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

  // Column 1: Moves Bottom to Top
  const col1 = [
    { src: images[0] || fallbackImages[0], ratio: styles.ratioTall },
    { src: images[1] || fallbackImages[1], ratio: styles.ratioShort },
    { src: images[2] || fallbackImages[2], ratio: styles.ratioMedium },
  ];

  // Column 2: Moves Top to Bottom
  const col2 = [
    { src: images[3] || fallbackImages[3], ratio: styles.ratioShort },
    { src: images[4] || fallbackImages[4], ratio: styles.ratioSquare },
    { src: images[5] || fallbackImages[5], ratio: styles.ratioTall },
  ];

  // Column 3: Moves Bottom to Top
  const col3 = [
    { src: images[6] || fallbackImages[6], ratio: styles.ratioMedium },
    { src: images[7] || fallbackImages[7], ratio: styles.ratioTall },
    { src: images[8] || fallbackImages[8], ratio: styles.ratioShort },
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

        {/* Right 3 Vertical Infinite Moving Columns */}
        <div className={styles.rightCollage}>
          {/* Column 1: Bottom to Top */}
          <div className={styles.collageColumn}>
            <div className={`${styles.collageColumnTrack} ${styles.moveUp}`}>
              {[...col1, ...col1].map((item, idx) => (
                <div key={idx} className={`${styles.collageCard} ${item.ratio}`}>
                  <img
                    src={item.src}
                    alt={`TIMS Gallery highlight 1-${idx + 1}`}
                    className={styles.collageImg}
                    loading="lazy"
                  />
                  <div className={styles.cardHoverFrame} />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Top to Bottom */}
          <div className={styles.collageColumn}>
            <div className={`${styles.collageColumnTrack} ${styles.moveDown}`}>
              {[...col2, ...col2].map((item, idx) => (
                <div key={idx} className={`${styles.collageCard} ${item.ratio}`}>
                  <img
                    src={item.src}
                    alt={`TIMS Gallery highlight 2-${idx + 1}`}
                    className={styles.collageImg}
                    loading="lazy"
                  />
                  <div className={styles.cardHoverFrame} />
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Bottom to Top */}
          <div className={`${styles.collageColumn} ${styles.col3Hide}`}>
            <div className={`${styles.collageColumnTrack} ${styles.moveUpAlt}`}>
              {[...col3, ...col3].map((item, idx) => (
                <div key={idx} className={`${styles.collageCard} ${item.ratio}`}>
                  <img
                    src={item.src}
                    alt={`TIMS Gallery highlight 3-${idx + 1}`}
                    className={styles.collageImg}
                    loading="lazy"
                  />
                  <div className={styles.cardHoverFrame} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
