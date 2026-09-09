"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import "./tims-partners-section.css";

type Partner = {
  name: string;
  logo: string;
  href: string;
};

const defaultPartners: Partner[] = [
  {
    name: "Aligarh Muslim University",
    logo: "/images/aligrh_image.png",
    href: "/universities/degree-pg/aligarh-muslim-university",
  },
  {
    name: "Swami Vivekanand Subharti University",
    logo: "/images/swami-logo.webp",
    href: "/universities/degree-pg/swami-vivekanand-subharti-university",
  },
  {
    name: "Guru Kashi University",
    logo: "/images/universities/guru-kashi-university.jpg",
    href: "/universities/degree-pg/guru-kashi-university",
  },
  {
    name: "Mizoram University",
    logo: "/images/andhra_image.png",
    href: "/universities/degree-pg/mizoram-university",
  },
  {
    name: "Suresh Gyan Vihar University",
    logo: "/images/bg-1.png",
    href: "/universities/degree-pg/suresh-gyan-vihar-university",
  },
  {
    name: "Andhra University",
    logo: "/images/andra-logo.webp",
    href: "/universities/degree-pg/andhra-university",
  },
  {
    name: "Jamia Urdu Aligarh",
    logo: "/images/jua-logo.webp",
    href: "/universities/10th-plus-two/jamia-urdu-aligarh",
  },
  {
    name: "Board of Open Schooling & Skill Education",
    logo: "/images/bosse-logo.webp",
    href: "/universities/10th-plus-two/bosse",
  },
  {
    name: "National Institute of Open Schooling",
    logo: "/images/bosse-logo.webp",
    href: "/universities/10th-plus-two/national-institute-of-open-schooling",
  },
];

export default function PartnersSection() {
  const [partnersList, setPartnersList] = useState<Partner[]>(defaultPartners);

  useEffect(() => {
    async function loadUniversities() {
      try {
        const res = await fetch("/api/universities");
        if (!res.ok) return;
        const data = await res.json();

        if (Array.isArray(data.universities) && data.universities.length > 0) {
          const mapped: Partner[] = data.universities.map(
            (u: { name: string; logo?: string; image?: string; href?: string; slug?: string }) => ({
              name: u.name,
              logo: u.logo || u.image || "/images/swami-logo.webp",
              href: u.href || `/universities?search=${encodeURIComponent(u.name)}`,
            })
          );
          setPartnersList(mapped);
        }
      } catch (err) {
        console.error("Using default partner universities:", err);
      }
    }

    loadUniversities();
  }, []);

  const loopedPartners = [...partnersList, ...partnersList, ...partnersList];

  return (
    <section className="tims-partners-section">
      <div className="tims-partners-inner">
        <div className="tims-partners-header">
          <span className="tims-partners-label">OUR AFFILIATIONS</span>
          <h2 className="tims-partners-title">Recognized Universities &amp; Boards</h2>
        </div>
      </div>

      {/* Top Carousel (Right to Left) */}
      <div className="tims-partners-marquee-wrap">
        <div className="tims-partners-marquee-track-rtl">
          {loopedPartners.map((partner, index) => (
            <Link
              href={partner.href}
              className="tims-partner-card"
              key={`top-${partner.name}-${index}`}
              title={`View ${partner.name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={partner.logo} alt={partner.name} className="tims-partner-logo" />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Carousel (Left to Right) */}
      <div className="tims-partners-marquee-wrap tims-partners-marquee-wrap-bottom">
        <div className="tims-partners-marquee-track-ltr">
          {loopedPartners.map((partner, index) => (
            <Link
              href={partner.href}
              className="tims-partner-card"
              key={`bottom-${partner.name}-${index}`}
              title={`View ${partner.name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={partner.logo} alt={partner.name} className="tims-partner-logo" />
            </Link>
          ))}
        </div>
      </div>

      <div className="tims-partners-action">
        <Link href="/universities" className="tims-partners-btn">
          Explore Universities &rarr;
        </Link>
      </div>
    </section>
  );
}
