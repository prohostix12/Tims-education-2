"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

type NavLink = {
  label: string;
  href: string;
  children?: NavLink[];
};

const navItems: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Directors", href: "/directors" },
      { label: "Blog", href: "/blog" },
      { label: "News", href: "/news" },
    ],
  },
  { label: "Find University", href: "/find-university" },
  {
    label: "Courses",
    href: "/courses",
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
  {
    label: "Service",
    href: "/service",
    children: [
      { label: "Attestation", href: "/service/attestation" },
      { label: "Credit Transfer", href: "/service/credit-transfer" },
    ],
  },
  {
    label: "Universities",
    href: "/universities",
    children: [
      {
        label: "10th/Plus Two",
        href: "#",
        children: [
          { label: "National Institute of Open Schooling", href: "/universities/10th-plus-two/national-institute-of-open-schooling" },
          { label: "Jamia Urdu Aligarh", href: "/universities/10th-plus-two/jamia-urdu-aligarh" },
          { label: "BOSSE", href: "/universities/10th-plus-two/bosse" },
        ],
      },
      {
        label: "Degree/PG",
        href: "#",
        children: [
          { label: "Aligarh Muslim University", href: "/universities/degree-pg/aligarh-muslim-university" },
          { label: "Mizoram University", href: "/universities/degree-pg/mizoram-university" },
          { label: "Guru Kashi University", href: "/universities/degree-pg/guru-kashi-university" },
          { label: "Swami Vivekanand Subharti University", href: "/universities/degree-pg/swami-vivekanand-subharti-university" },
          { label: "Jain university", href: "https://www.jainuniversity.ac.in/" },
          { label: "GLA", href: "#" },
          {
            label: "More",
            href: "#",
            children: [
              { label: "Mangalyaan University", href: "#" },
              { label: "Suresh Gyan Vihar University", href: "#" },
              { label: "Manipal University", href: "#" },
              { label: "Amrita university", href: "#" },
            ],
          },
        ],
      },
      {
        label: "Study Materials",
        href: "#",
        children: [
          { label: "NIOS", href: "#" },
          { label: "ANNAMALAI UNIVERSITY", href: "#" },
          { label: "BHARATHIYAR UNIVERSITY", href: "#" },
          { label: "SVSU", href: "#" },
          { label: "SVSU Online", href: "#" },
          { label: "SVU", href: "#" },
          { label: "AMU Online", href: "#" },
          { label: "Tutor Mark Assignment", href: "#" },
        ],
      },
      {
        label: "Examination",
        href: "#",
        children: [
          { label: "Time Table For SSLC And Plus Two", href: "#" },
          { label: "Results", href: "#" },
        ],
      },
    ],
  },
  {
    label: "Students",
    href: "/students",
    children: [
      { label: "Syllabus", href: "#" },
      { label: "News", href: "#" },
    ],
  },
  { label: "Contact", href: "/contact" },
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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m20 20-4.3-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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

/* ---------- Dropdown menus (desktop) ---------- */

function DropdownMenu({
  items,
  open,
  depth,
}: {
  items: NavLink[];
  open: boolean;
  depth: number;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <ul
      className={`${depth === 0 ? styles.dropdown : styles.subDropdown} ${
        open ? (depth === 0 ? styles.dropdownOpen : styles.subDropdownOpen) : ""
      }`}
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
            href={item.href}
            className={styles.dropdownLink}
            role="menuitem"
            aria-haspopup={item.children ? "true" : undefined}
            aria-expanded={item.children ? hovered === item.label : undefined}
          >
            {item.label}
            {item.children && (
              <ChevronDownIcon className={styles.subChevron} />
            )}
          </Link>

          {item.children && (
            <DropdownMenu
              items={item.children}
              open={hovered === item.label}
              depth={depth + 1}
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
          <Link href={item.href} onClick={onNavigate}>
            {item.label}
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href !== "#" && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}
    >
      <div className={styles.navWrap}>
        <div className={styles.mainNavCard}>
          <Link href="/" className={styles.logoLink} aria-label="TIMS Education home">
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
                    href={item.href}
                    className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ""}`}
                    aria-haspopup={item.children ? "true" : undefined}
                    aria-expanded={item.children ? openDropdown === item.label : undefined}
                  >
                    {item.label}
                    {item.children && <ChevronDownIcon className={styles.chevron} />}
                  </Link>

                  {item.children && (
                    <DropdownMenu
                      items={item.children}
                      open={openDropdown === item.label}
                      depth={0}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <a href="tel:+917736111588" className={styles.phoneBlock}>
              <span className={styles.phoneIcon}>
                <PhoneIcon />
              </span>
              <span className={styles.phoneText}>
                <span className={styles.phoneLabel}>Call anytime</span>
                <span className={styles.phoneNumber}>+91 7736 1115 88</span>
              </span>
            </a>

            <button type="button" className={styles.searchButton} aria-label="Search">
              <SearchIcon />
            </button>

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
                className={isActive(item.href) ? styles.mobileLinkActive : ""}
              >
                {item.label}
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
