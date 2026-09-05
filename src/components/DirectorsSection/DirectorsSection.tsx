"use client";

import { useEffect, useState } from "react";
import "./tims-directors-section.css";

type Director = {
  id: string;
  name: string;
  role: string;
  image?: string;
  accentBg?: string;
};

const directorsList: Director[] = [
  {
    id: "dir-1",
    name: "Adv ShoukathAli Pootheri",
    role: "Founder & Director",
    image: "/images/Shoukathali.png",
    accentBg: "#14161c",
  },
  {
    id: "dir-2",
    name: "Nabeel CM",
    role: "Managing Director",
    image: "/images/Nabeel.png",
    accentBg: "#123061",
  },
  {
    id: "dir-3",
    name: "Mohamed Shameem",
    role: "CEO & Director",
    image: "/images/Shameem.png",
    accentBg: "#1a202c",
  },
  {
    id: "dir-4",
    name: "Mr Jamsheer Backer",
    role: "Founder & Managing Director",
    image: "/images/",
    accentBg: "#0f382c",
  },
  {
    id: "dir-5",
    name: "Dr. K. P. Abdullah",
    role: "Academic Director",
    accentBg: "#1e293b",
  },
];

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4 20c1.5-4.2 4.8-6.2 8-6.2s6.5 2 8 6.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DirectorsSection() {
  const [directors, setDirectors] = useState<Director[]>(directorsList);

  useEffect(() => {
    async function loadBackendDirectors() {
      try {
        const res = await fetch("/api/directors");
        const data = await res.json();
        if (data.directors && Array.isArray(data.directors) && data.directors.length > 0) {
          const published = data.directors.filter((d: any) => d.isPublished);
          if (published.length > 0) {
            setDirectors(
              published.map((item: any) => ({
                id: item.id,
                name: item.name,
                role: item.role,
                image: item.image || undefined,
                accentBg: item.accentBg || "#14161c",
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to load directors from DB:", err);
      }
    }
    loadBackendDirectors();
  }, []);

  // Duplicate directors list for seamless infinite right-to-left marquee loop
  const loopDirectors = [...directors, ...directors];

  return (
    <section className="tims-directors-section">
      <div className="tims-directors-inner">
        {/* Section Header */}
        <div className="tims-directors-heading-wrap">
          <span className="tims-directors-label">LEADERSHIP &amp; VISION</span>
          <h2 className="tims-directors-heading">
            Meet Our <span>Directors</span>
          </h2>
          <p className="tims-directors-subtitle">
            Guided by visionary leadership committed to quality education, student guidance, and academic excellence.
          </p>
        </div>

        {/* Infinite Right-to-Left Continuous Loop Marquee */}
        <div className="tims-directors-marquee">
          <div className="tims-directors-track">
            {loopDirectors.map((director, index) => (
              <div
                className="tims-director-card"
                key={`${director.id}-${index}`}
              >
                {/* Skewed Geometric Photo Frame matching reference design */}
                <div
                  className="tims-director-skew-frame"
                  style={{ backgroundColor: director.accentBg || "#14161c" }}
                >
                  <div className="tims-director-unskew-content">
                    {director.image ? (
                      <img
                        src={director.image}
                        alt={director.name}
                        className="tims-director-portrait-img"
                      />
                    ) : (
                      <div className="tims-director-placeholder-space">
                        <PersonIcon />
                        <span className="tims-director-placeholder-text">
                          Director Photo Space
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Overlay Badge for Name & Role */}
                <div className="tims-director-info-badge">
                  <h3 className="tims-director-name">{director.name}</h3>
                  <p className="tims-director-role">{director.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
