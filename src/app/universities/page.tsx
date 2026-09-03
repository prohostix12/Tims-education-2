"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import "./universities.css";

type CategoryFilter = "all" | "degree-pg" | "10th-plus-two";

type University = {
  id: string;
  name: string;
  slug: string;
  href: string;
  image: string;
  brochure?: string;
  category: "degree-pg" | "10th-plus-two";
  categoryLabel: string;
  description: string;
  badgeTheme?: "red" | "dark";
};

const defaultUniversityData: University[] = [
  {
    id: "amu",
    name: "Aligarh Muslim University",
    slug: "aligarh-muslim-university",
    href: "/universities/degree-pg/aligarh-muslim-university",
    image: "/images/aligrh_image.png",
    category: "degree-pg",
    categoryLabel: "Degree & PG",
    description:
      "Aligarh Muslim University (AMU): Shaping Futures, Empowering Minds with recognized distance & online degree programs.",
    badgeTheme: "red",
  },
  {
    id: "svsu",
    name: "Swami Vivekanand Subharti University",
    slug: "swami-vivekanand-subharti-university",
    href: "/universities/degree-pg/swami-vivekanand-subharti-university",
    image: "/images/swami-logo.webp",
    category: "degree-pg",
    categoryLabel: "Degree & PG",
    description:
      "Swami Vivekanand Subharti University (SVSU): UGC & DEB approved online and distance learning programs.",
    badgeTheme: "dark",
  },
  {
    id: "guru-kashi",
    name: "Guru Kashi University",
    slug: "guru-kashi-university",
    href: "/universities/degree-pg/guru-kashi-university",
    image: "/images/universities/guru-kashi-university.jpg",
    category: "degree-pg",
    categoryLabel: "Degree & PG",
    description:
      "Guru Kashi University: Prominent institution offering accredited distance degree, credit transfer, and PG courses.",
    badgeTheme: "red",
  },
  {
    id: "mizoram",
    name: "Mizoram University",
    slug: "mizoram-university",
    href: "/universities/degree-pg/mizoram-university",
    image: "/images/andhra_image.png",
    category: "degree-pg",
    categoryLabel: "Degree & PG",
    description:
      "Mizoram University: Premier Central University offering UGC entitled online degree and post graduation programs.",
    badgeTheme: "dark",
  },
  {
    id: "sgvu",
    name: "Suresh Gyan Vihar University",
    slug: "suresh-gyan-vihar-university",
    href: "/universities/degree-pg/suresh-gyan-vihar-university",
    image: "/images/bg-1.png",
    category: "degree-pg",
    categoryLabel: "Degree & PG",
    description:
      "Suresh Gyan Vihar University: NAAC A+ accredited university offering flexible recognized distance education degrees.",
    badgeTheme: "red",
  },
  {
    id: "andhra",
    name: "Andhra University",
    slug: "andhra-university",
    href: "/universities/degree-pg/andhra-university",
    image: "/images/andra-logo.webp",
    category: "degree-pg",
    categoryLabel: "Degree & PG",
    description:
      "Andhra University: Renowned public university offering accredited online and distance learning degree programs.",
    badgeTheme: "dark",
  },
  {
    id: "nios",
    name: "National Institute of Open Schooling",
    slug: "national-institute-of-open-schooling",
    href: "/universities/10th-plus-two/national-institute-of-open-schooling",
    image: "/images/aligrh_image.png",
    category: "10th-plus-two",
    categoryLabel: "10th & Plus Two",
    description:
      "National Institute of Open Schooling (NIOS): Globally recognized secondary (10th) and senior secondary (12th) open school board.",
    badgeTheme: "red",
  },
  {
    id: "jamia-urdu",
    name: "Jamia Urdu Aligarh",
    slug: "jamia-urdu-aligarh",
    href: "/universities/10th-plus-two/jamia-urdu-aligarh",
    image: "/images/swami-logo.webp",
    category: "10th-plus-two",
    categoryLabel: "10th & Plus Two",
    description:
      "Jamia Urdu Aligarh: Historical educational institution offering secondary & senior secondary equivalency programs.",
    badgeTheme: "dark",
  },
  {
    id: "bosse",
    name: "BOSSE Board",
    slug: "bosse",
    href: "/universities/10th-plus-two/bosse",
    image: "/images/andra-logo.webp",
    category: "10th-plus-two",
    categoryLabel: "10th & Plus Two",
    description:
      "Board of Open Schooling and Skill Education (BOSSE): Recognized open schooling board for 10th, 12th & skill certifications.",
    badgeTheme: "red",
  },
];

function GraduationCapIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 17.18 8.5 20 12 20C15.5 20 19 17.18 19 17.18V13.18L12 17L5 13.18Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

function UniversitiesPageContent() {
  const searchParams = useSearchParams();
  const [universityList, setUniversityList] = useState<University[]>(defaultUniversityData);
  const [activeTab, setActiveTab] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Read search or slug params from URL if navigated with selected university
  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    const slugFromUrl = searchParams.get("slug") || searchParams.get("university");

    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    } else if (slugFromUrl) {
      const matched = universityList.find(
        (u) =>
          u.slug.toLowerCase() === slugFromUrl.toLowerCase() ||
          u.id.toLowerCase() === slugFromUrl.toLowerCase() ||
          u.name.toLowerCase().includes(slugFromUrl.toLowerCase())
      );
      if (matched) {
        setSearchQuery(matched.name);
      } else {
        setSearchQuery(slugFromUrl);
      }
    }
  }, [searchParams, universityList]);

  // Fetch dynamic universities from MongoDB API
  useEffect(() => {
    async function loadUniversities() {
      try {
        const res = await fetch("/api/universities");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.universities) && data.universities.length > 0) {
          const mapped = data.universities.map(
            (u: {
              id: string;
              name: string;
              slug: string;
              href: string;
              image: string;
              logo?: string;
              category: "degree-pg" | "10th-plus-two";
              categoryLabel: string;
              description: string;
              brochure?: string;
              accent?: string;
            }) => ({
              id: u.id,
              name: u.name,
              slug: u.slug,
              href: u.href || `/universities/${u.category}/${u.slug}`,
              image: u.image || u.logo || "/images/aligrh_image.png",
              brochure: u.brochure || "",
              category: u.category || "degree-pg",
              categoryLabel: u.categoryLabel || "Degree & PG",
              description: u.description || `${u.name} accredited educational programs.`,
              badgeTheme: u.accent === "navy" ? "dark" : "red",
            })
          );
          setUniversityList(mapped);
        }
      } catch (err) {
        console.error("Using static fallback for universities page:", err);
      }
    }

    loadUniversities();
  }, []);

  const filteredUniversities = useMemo(() => {
    return universityList.filter((uni) => {
      const matchesCategory = activeTab === "all" || uni.category === activeTab;
      const queryLower = searchQuery.toLowerCase().trim();
      if (!queryLower) return matchesCategory;

      const matchesName = uni.name.toLowerCase().includes(queryLower);
      const matchesSlug = uni.slug.toLowerCase().includes(queryLower) || uni.id.toLowerCase().includes(queryLower);
      const matchesDesc = uni.description.toLowerCase().includes(queryLower);

      return matchesCategory && (matchesName || matchesSlug || matchesDesc);
    });
  }, [universityList, activeTab, searchQuery]);

  return (
    <main className="universities-page">
      {/* Hero Banner */}
      <section className="universities-hero">
        <div className="universities-hero-inner">
          <span className="universities-label">OUR PARTNER INSTITUTIONS</span>
          <h1 className="universities-title">Universities &amp; Accredited Boards</h1>
          <p className="universities-subtitle">
            Explore UGC, DEB, and AICTE recognized universities and open schooling boards offering flexible distance, online, and degree learning programs.
          </p>
        </div>
      </section>

      {/* Filter Tabs & Search Controls */}
      <div className="universities-controls">
        <div className="universities-controls-card">
          <div className="universities-tabs">
            <button
              type="button"
              className={`uni-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Partner Institutions ({universityList.length})
            </button>
            <button
              type="button"
              className={`uni-tab-btn ${activeTab === "degree-pg" ? "active" : ""}`}
              onClick={() => setActiveTab("degree-pg")}
            >
              Degree &amp; PG Universities
            </button>
            <button
              type="button"
              className={`uni-tab-btn ${activeTab === "10th-plus-two" ? "active" : ""}`}
              onClick={() => setActiveTab("10th-plus-two")}
            >
              10th &amp; 12th Boards
            </button>
          </div>

          <div className="universities-search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search university or board..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="uni-search-input"
            />
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <section className="universities-grid-container">
        <div className="universities-grid">
          {filteredUniversities.length > 0 ? (
            filteredUniversities.map((uni) => (
              <article key={uni.id} className="uni-card">
                {/* Top Banner Image with Arc Divider */}
                <div className="uni-card-banner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={uni.image} alt={uni.name} className="uni-card-img" />
                </div>

                {/* Floating Graduation Cap Icon Badge */}
                <div className={`uni-card-badge uni-badge-${uni.badgeTheme || "red"}`}>
                  <GraduationCapIcon />
                </div>

                {/* Card Content Body */}
                <div className="uni-card-body">
                  <h2 className="uni-card-title">{uni.name}</h2>
                  <p className="uni-card-desc">{uni.description}</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "auto" }}>
                    {uni.brochure && (
                      <a
                        href={uni.brochure}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="uni-card-btn"
                        style={{ borderColor: "#0284c7", color: "#0284c7", background: "#f0f9ff" }}
                      >
                        📄 Download Brochure (PDF)
                      </a>
                    )}

                    <Link
                      href={uni.href}
                      className={`uni-card-btn ${uni.badgeTheme === "dark" ? "uni-card-btn-dark" : ""}`}
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="universities-empty">
              <h3>No Universities Found</h3>
              <p>Try searching for a different keyword or reset the filter tabs.</p>
              <button
                type="button"
                className="uni-tab-btn active"
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function UniversitiesPage() {
  return (
    <Suspense
      fallback={
        <main className="universities-page">
          <section className="universities-hero">
            <div className="universities-hero-inner">
              <span className="universities-label">OUR PARTNER INSTITUTIONS</span>
              <h1 className="universities-title">Universities &amp; Accredited Boards</h1>
            </div>
          </section>
        </main>
      }
    >
      <UniversitiesPageContent />
    </Suspense>
  );
}
