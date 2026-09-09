"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import styles from "./Header.module.css";

const LOGO_CLICK_DELAY = 250;

type NavLink = {
  label: string;
  href: string;
  children?: NavLink[];
};

const navItems: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "",
    children: [
      { label: "Directors", href: "/directors" },
      { label: "Gallery", href: "/gallery" },
      { label: "Blog", href: "/blog" },
      { label: "News", href: "/news" },
    ],
  },
  { label: "Find University", href: "/find-university" },
  {
    label: "Courses",
    href: "",
    children: [
      { label: "SSLC / PLUS TWO", href: "/courses/sslc-plus-two" },
      { label: "Online Degree", href: "/courses/online-degree" },
      { label: "Post Graduation", href: "/courses/post-graduation" },
      { label: "Btech / Mtech", href: "/courses/btech-mtech" },
      { label: "Diploma", href: "/courses/diploma" },
      { label: "Apprenticeship Program", href: "/courses/apprenticeship-program" },
      { label: "Skill Courses", href: "#" },
    ],
  },
  /*
  {
    label: "Service",
    href: "",
    children: [
      { label: "Attestation", href: "/service/attestation" },
      { label: "Credit Transfer", href: "/service/credit-transfer" },
    ],
  },
  */
  {
    label: "Universities",
    href: "/universities",
    children: [
      {
        label: "10th/Plus Two",
        href: "",
        children: [
          { label: "National Institute of Open Schooling", href: "/universities/10th-plus-two/national-institute-of-open-schooling" },
          { label: "Jamia Urdu Aligarh", href: "/universities/10th-plus-two/jamia-urdu-aligarh" },
          { label: "BOSSE", href: "/universities/10th-plus-two/bosse" },
        ],
      },
      {
        label: "Degree/PG",
        href: "",
        children: [
          { label: "Aligarh Muslim University", href: "/universities/degree-pg/aligarh-muslim-university" },
          { label: "Mizoram University", href: "/universities/degree-pg/mizoram-university" },
          { label: "Guru Kashi University", href: "/universities/degree-pg/guru-kashi-university" },
          { label: "Swami Vivekanand Subharti University", href: "/universities/degree-pg/swami-vivekanand-subharti-university" },
          { label: "Jain university", href: "https://www.jainuniversity.ac.in/" },
          { label: "GLA", href: "https://www.gla.ac.in/" },
          {
            label: "More",
            href: "",
            children: [
              { label: "Mangalyaan University", href: "https://www.mangalayatan.in/" },
              { label: "Suresh Gyan Vihar University", href: "/universities/degree-pg/suresh-gyan-vihar-university" },
              { label: "Manipal University", href: "https://www.manipal.edu/mu.html" },
              { label: "Amrita university", href: "https://www.amrita.edu/" },
            ],
          },
        ],
      },
          /*
          {
            label: "Study Materials",
            href: "",
            children: [
              { label: "NIOS", href: "/universities/study-materials/nios" },
              { label: "ANNAMALAI UNIVERSITY", href: "/universities/study-materials/annamalai-university" },
              { label: "BHARATHIYAR UNIVERSITY", href: "/universities/study-materials/bharathiyar-university" },
              { label: "SVSU", href: "/universities/study-materials/svsu" },
              { label: "SVSU Online", href: "/universities/study-materials/svsu-online" },
              { label: "SVU", href: "/universities/study-materials/svu" },
              { label: "AMU Online", href: "/universities/study-materials/amu-online" },
              { label: "Tutor Mark Assignment", href: "/universities/study-materials/tutor-mark-assignment" },
            ],
          },
          {
            label: "Examination",
            href: "",
            children: [
              { label: "Time Table For SSLC And Plus Two", href: "#" },
              { label: "Results", href: "#" },
            ],
          },
          */
    ],
  },
  { label: "Contact", href: "/contact" },
  /*
  {
    label: "Students",
    href: "",
    children: [
      { label: "Syllabus", href: "/students/syllabus" },
      { label: "News", href: "/students/news" },
    ],
  },
  */
];

/* ---------- Inline icons (no external icon package) ---------- */

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2a1 1 0 0 1 1-.3c1.1.4 2.3.6 3.5.6a1 1 0 0 1 1 1V19.5a1 1 0 0 1-1 1C9.9 20.5 3.5 14.1 3.5 6a1 1 0 0 1 1-1H7.6a1 1 0 0 1 1 1c0 1.2.2 2.4.6 3.5a1 1 0 0 1-.3 1l-2 1.3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 20c1.5-4.2 4.8-6.2 8-6.2s6.5 2 8 6.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" className={className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function renderNavIcon(label: string) {
  const norm = label.trim().toLowerCase();

  if (norm === "find university" || norm.includes("findyouruniversity")) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src="/images/tims_logo/FindYourUniversity_logo.png"
        alt=""
        className={styles.navIconImg}
      />
    );
  }

  if (norm === "home") {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </span>
    );
  }

  if (norm === "about") {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </span>
    );
  }

  if (norm === "directors") {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </span>
    );
  }

  if (norm === "gallery") {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </span>
    );
  }

  if (norm === "blog") {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </span>
    );
  }

  if (norm === "news") {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M9 12h6m-6 4h6" />
        </svg>
      </span>
    );
  }

  if (norm === "courses") {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      </span>
    );
  }

  if (norm.includes("sslc") || norm.includes("plus two")) {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </span>
    );
  }

  if (norm.includes("online degree")) {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </span>
    );
  }

  if (norm.includes("post graduation") || norm.includes("pg")) {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      </span>
    );
  }

  if (norm.includes("btech") || norm.includes("mtech")) {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </span>
    );
  }

  if (norm.includes("diploma")) {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </span>
    );
  }

  if (norm.includes("apprenticeship") || norm.includes("skill")) {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </span>
    );
  }

  if (norm === "service") {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </span>
    );
  }

  if (norm.includes("attestation")) {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </span>
    );
  }

  if (norm.includes("credit transfer")) {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      </span>
    );
  }

  if (norm.includes("universit")) {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="21" x2="21" y2="21" />
          <line x1="6" y1="18" x2="6" y2="11" />
          <line x1="10" y1="18" x2="10" y2="11" />
          <line x1="14" y1="18" x2="14" y2="11" />
          <line x1="18" y1="18" x2="18" y2="11" />
          <polygon points="12 3 2 8 22 8 12 3" />
        </svg>
      </span>
    );
  }

  if (norm === "contact") {
    return (
      <span className={styles.navIconSvg}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </span>
    );
  }

  return (
    <span className={styles.navIconSvg}>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    </span>
  );
}

/* ---------- Dropdown menus (desktop) ---------- */

function DropdownMenu({
  items,
  open,
  depth,
  onItemClick,
}: {
  items: NavLink[];
  open: boolean;
  depth: number;
  onItemClick?: () => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <ul
      className={`${depth === 0 ? styles.dropdown : styles.subDropdown} ${
        depth >= 2 ? styles.subDropdownLeft : ""
      } ${open ? (depth === 0 ? styles.dropdownOpen : styles.subDropdownOpen) : ""}`}
      role="menu"
    >
      {items.map((item) => (
        <li
          key={item.label}
          className={styles.dropdownItem}
          onMouseEnter={() => item.children && setHovered(item.label)}
          onMouseLeave={() => item.children && setHovered(null)}
        >
          <Link
            href={item.href || "#"}
            className={styles.dropdownLink}
            role="menuitem"
            aria-haspopup={item.children ? "true" : undefined}
            aria-expanded={item.children ? hovered === item.label : undefined}
            onClick={(e) => {
              if (item.children) {
                if (!item.href || item.href === "#") {
                  e.preventDefault();
                }
                setHovered((prev) => (prev === item.label ? null : item.label));
              } else if (onItemClick) {
                onItemClick();
              }
            }}
          >
            <span className={styles.dropdownLinkLabel}>
              {renderNavIcon(item.label)}
              <span>{item.label}</span>
            </span>
            {item.children && (
              <ChevronDownIcon className={styles.subChevron} />
            )}
          </Link>

          {item.children && (
            <DropdownMenu
              items={item.children}
              open={hovered === item.label}
              depth={depth + 1}
              onItemClick={onItemClick}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

/* ---------- Mobile drawer nav ---------- */

function MobileSubList({
  items,
  onNavigate,
}: {
  items: NavLink[];
  onNavigate: () => void;
}) {
  return (
    <ul className={styles.mobileSubList}>
      {items.map((item) => (
        <li key={item.label}>
          <Link href={item.href || "#"} onClick={onNavigate} className={styles.mobileLinkFlex}>
            {renderNavIcon(item.label)}
            <span>{item.label}</span>
          </Link>
          {item.children && (
            <MobileSubList items={item.children} onNavigate={onNavigate} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    };
  }, []);

  const handleLogoClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    logoClickTimer.current = setTimeout(() => {
      router.push("/");
    }, LOGO_CLICK_DELAY);
  };

  const handleLogoDoubleClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (logoClickTimer.current) {
      clearTimeout(logoClickTimer.current);
      logoClickTimer.current = null;
    }
    router.push("/admin");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen && !openDropdown) return;

    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen, openDropdown]);

  const isActive = (href: string) =>
    href !== "" &&
    href !== "#" &&
    (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  const isSectionActive = (item: NavLink): boolean =>
    isActive(item.href) || (item.children?.some(isSectionActive) ?? false);

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${styles.headerHero} ${scrolled ? styles.headerScrolled : ""}`}
    >
      <div className={styles.navWrap}>
        <div className={styles.mainNavCard}>
          <Link
            href="/"
            className={styles.logoLink}
            aria-label="TIMS Education home. Double-click to open the admin panel."
            onClick={handleLogoClick}
            onDoubleClick={handleLogoDoubleClick}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/tims_logo/logo.webp"
              alt="TIMS Education logo"
              className={styles.logoImage}
            />
          </Link>

          <nav className={styles.primaryNav} aria-label="Primary navigation">
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li
                  key={item.label}
                  className={styles.navItem}
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => item.children && setOpenDropdown(null)}
                >
                  <Link
                    href={item.href || "#"}
                    className={`${styles.navLink} ${isSectionActive(item) ? styles.navLinkActive : ""}`}
                    aria-haspopup={item.children ? "true" : undefined}
                    aria-expanded={item.children ? openDropdown === item.label : undefined}
                    onClick={(e) => {
                      if (item.children) {
                        if (!item.href || item.href === "#") {
                          e.preventDefault();
                        }
                        setOpenDropdown((prev) => (prev === item.label ? null : item.label));
                      } else {
                        setOpenDropdown(null);
                      }
                    }}
                  >
                    {renderNavIcon(item.label)}
                    <span>{item.label}</span>
                    {item.children && <ChevronDownIcon className={styles.chevron} />}
                  </Link>

                  {item.children && (
                    <DropdownMenu
                      items={item.children}
                      open={openDropdown === item.label}
                      depth={0}
                      onItemClick={() => setOpenDropdown(null)}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <a
              href="https://pypeerm.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.studentLoginBtn}
            >
              <UserIcon />
              <span>Student Login</span>
            </a>

            <a href="tel:+917736111588" className={styles.mobilePhoneButton} aria-label="Call TIMS Education">
              <PhoneIcon />
            </a>

            <button
              type="button"
              className={`${styles.mobileToggle} ${mobileOpen ? styles.mobileToggleOpen : ""}`}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      <nav
        className={`${styles.mobileDrawer} ${mobileOpen ? styles.mobileDrawerOpen : ""}`}
        aria-label="Mobile navigation"
      >
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`${isSectionActive(item) ? styles.mobileLinkActive : ""} ${styles.mobileLinkFlex}`}
              >
                {renderNavIcon(item.label)}
                <span>{item.label}</span>
              </Link>
              {item.children && (
                <MobileSubList
                  items={item.children}
                  onNavigate={() => setMobileOpen(false)}
                />
              )}
            </li>
          ))}
        </ul>

        <div className={styles.mobileDrawerFooter}>
          <a
            href="https://pypeerm.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileStudentLoginBtn}
            onClick={() => setMobileOpen(false)}
          >
            <UserIcon />
            <span>Student Login</span>
          </a>
          <a href="tel:+917736111588" className={styles.mobileDrawerPhone}>
            <PhoneIcon />
            <span>+91 7736 1115 88</span>
          </a>
        </div>
      </nav>

      {mobileOpen && <div className={styles.mobileScrim} aria-hidden="true" />}
    </header>
  );
}
