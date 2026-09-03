"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import "./tims-universities-section.css";

type University = {
  name: string;
  slug: string;
  href: string;
  image: string;
};

const defaultUniversities: University[] = [
  // Top Row (4 items)
  {
    name: "Aligarh Muslim University",
    slug: "aligarh-muslim-university",
    href: "/universities?search=Aligarh%20Muslim%20University",
    image: "/images/aligrh_image.png",
  },
  {
    name: "Swami Vivekanand Subharti University",
    slug: "swami-vivekanand-subharti-university",
    href: "/universities?search=Swami%20Vivekanand%20Subharti%20University",
    image: "/images/swami-logo.webp",
  },
  {
    name: "Guru Kashi University",
    slug: "guru-kashi-university",
    href: "/universities?search=Guru%20Kashi%20University",
    image: "/images/aligrh_image.png",
  },
  {
    name: "Mizoram University",
    slug: "mizoram-university",
    href: "/universities?search=Mizoram%20University",
    image: "/images/andhra_image.png",
  },

  // Bottom Row (5 items)
  {
    name: "Suresh Gyan Vihar University",
    slug: "suresh-gyan-vihar-university",
    href: "/universities?search=Suresh%20Gyan%20Vihar%20University",
    image: "/images/bg-1.png",
  },
  {
    name: "Andhra University",
    slug: "andhra-university",
    href: "/universities?search=Andhra%20University",
    image: "/images/andra-logo.webp",
  },
  {
    name: "Jamia Urdu Aligarh",
    slug: "jamia-urdu-aligarh",
    href: "/universities/10th-plus-two/jamia-urdu-aligarh",
    image: "/images/jua-logo.webp",
  },
  {
    name: "Board of Open Schooling & Skill Education",
    slug: "bosse",
    href: "/universities/10th-plus-two/bosse",
    image: "/images/bosse-logo.webp",
  },
  {
    name: "National Institute of Open Schooling",
    slug: "nios",
    href: "/universities/10th-plus-two/national-institute-of-open-schooling",
    image: "/images/bosse-logo.webp",
  },
];

export default function UniversitiesSection() {
  const [items, setItems] = useState<University[]>(defaultUniversities);

  useEffect(() => {
    async function loadUniversities() {
      try {
        const res = await fetch("/api/universities");
        if (!res.ok) return;
        const data = await res.json();

        if (Array.isArray(data.universities) && data.universities.length > 0) {
          const mapped = data.universities.map((u: {
            name: string;
            slug?: string;
            logo?: string;
            image?: string;
          }, idx: number) => ({
            name: u.name,
            slug: u.slug || `uni-${idx}`,
            href: `/universities?search=${encodeURIComponent(u.name)}`,
            image: u.logo || u.image || defaultUniversities[idx % defaultUniversities.length].image,
          }));

          let fullList = [...mapped];
          while (fullList.length < 9) {
            fullList = [...fullList, ...defaultUniversities.slice(0, 9 - fullList.length)];
          }
          setItems(fullList.slice(0, 9));
        }
      } catch (err) {
        console.error("Using default static universities:", err);
      }
    }

    loadUniversities();
  }, []);

  const row1 = items.slice(0, 4);
  const row2 = items.slice(4, 9);

  const renderCard = (uni: University, index: number) => {
    const gradientId = `tuGoldGrad-${index}`;
    return (
      <Link
        href={uni.href}
        className="tims-hex-card"
        key={`${uni.slug}-${index}`}
        aria-label={`View details for ${uni.name}`}
      >
        <svg className="tims-hex-svg" viewBox="0 0 185 214" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f7e5aa" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#aa8214" />
            </linearGradient>
          </defs>
          <polygon
            points="92.5,4 180,55 180,159 92.5,210 5,159 5,55"
            fill="#ffffff"
            stroke={`url(#${gradientId})`}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
        </svg>

        <div className="tims-hex-content">
          <div className="tims-hex-logo-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={uni.image} alt={uni.name} className="tims-hex-logo" />
          </div>
          <span className="tims-hex-name">{uni.name}</span>
        </div>
      </Link>
    );
  };

  return (
    <section className="tims-universities-section">
      <div className="tims-universities-bg-grid" aria-hidden="true" />

      <div className="tims-universities-inner">
        <div className="tims-universities-heading-block">
          <span className="tims-universities-label">UNIVERSITIES &amp; BOARDS</span>
          <h2 className="tims-universities-title">Explore Partner Universities</h2>
        </div>

        {/* 2 Staggered Honeycomb Rows (Top: 4 Hexagons, Bottom: 5 Hexagons) */}
        <div className="tims-hex-wrapper">
          <div className="tims-hex-row tims-hex-row-1">
            {row1.map((uni, idx) => renderCard(uni, idx))}
          </div>
          <div className="tims-hex-row tims-hex-row-2">
            {row2.map((uni, idx) => renderCard(uni, 4 + idx))}
          </div>
        </div>
      </div>
    </section>
  );
}




