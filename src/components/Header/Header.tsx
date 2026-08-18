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
  {
    label: "Courses",
    href: "/courses",
    children: [
      { label: "SSLC / PLUS TWO", href: "/courses/sslc-plus-two" },
      { label: "Online Degree", href: "/courses/online-degree" },
      { label: "Post Graduation", href: "/courses/post-graduation" },
      { label: "Btech / Mtech", href: "#" },
      { label: "Diploma", href: "#" },
      { label: "Apprenticeship Program", href: "#" },
      { label: "Skill Courses", href: "#" },
    ],
  },
  {
    label: "Service",
    href: "/service",
    children: [
      { label: "Attestation", href: "#" },
      { label: "Credit Transfer", href: "#" },
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
          { label: "National Institute of Open Schooling", href: "#" },
          { label: "Jamia Urdu Aligarh", href: "#" },
          { label: "BOSSE", href: "#" },
        ],
      },
      {
        label: "Degree/PG",
        href: "#",
        children: [
          { label: "Aligarh Muslim University", href: "#" },
          { label: "Mizoram University", href: "#" },
          { label: "Guru Kashi University", href: "#" },
          { label: "Swami Vivekanand Subharti University", href: "#" },
          { label: "Jain university", href: "#" },
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

/** Existing social URLs carried over from the previous header — no new URLs invented. */
const socialLinks: { label: string; href: string; icon: "facebook" | "instagram" | "youtube" | "linkedin" }[] = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
];

/* ---------- Inline icons (no external icon package) ---------- */

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
      <path
        d="M3.5 5.5h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="m3 6 9 7 9-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
      <path
        d="M12 21.5s7-6.4 7-12A7 7 0 0 0 5 9.5c0 5.6 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2a1 1 0 0 1 1-.3c1.1.4 2.3.6 3.5.6a1 1 0 0 1 1 1V19.5a1 1 0 0 1-1 1C9.9 20.5 3.5 14.1 3.5 6a1 1 0 0 1 1-1H7.6a1 1 0 0 1 1 1c0 1.2.2 2.4.6 3.5a1 1 0 0 1-.3 1l-2 1.3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
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

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
      <path d="M4 12h16M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M14.5 8.5H16V5.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.5H7.3v3.3h2.5V22h3.3v-6.7h2.5l.4-3.3h-2.9V9.9c0-1 .3-1.4 1.4-1.4Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3.5 9h3v11.5h-3V9Zm6.4 0h2.87v1.57h.04c.4-.75 1.38-1.55 2.85-1.55 3.05 0 3.61 2 3.61 4.6v6.88h-3v-6.1c0-1.46-.03-3.33-2.03-3.33-2.04 0-2.35 1.6-2.35 3.24v6.19h-3V9Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.3v5.4l4.8-2.7-4.8-2.7Z" fill="currentColor" />
    </svg>
  );
}

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
};

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
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.topBarLeft}>
            <a href="mailto:info@timseducation.com" className={styles.topBarItem}>
              <MailIcon />
              <span>info@timseducation.com</span>
            </a>
            <span className={styles.topBarDivider} aria-hidden="true" />
            <span className={styles.topBarItem}>
              <PinIcon />
              <span>Kerala, India</span>
            </span>
          </div>

          <div className={styles.topBarRight}>
            <span className={styles.followLabel}>Follow Us:</span>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={styles.socialIcon}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

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
            <div className={styles.ctaGroup}>
              <a href="tel:+917736111588" className={styles.phoneInline}>
                <span className={styles.phoneIcon}>
                  <PhoneIcon />
                </span>
                <span className={styles.phoneNumber}>+91 7736 1115 88</span>
              </a>

              <Link href="#" className={`${styles.enquireButton} ${styles.enquireButtonHeader}`}>
                <span>Enquire Now</span>
                <ArrowRightIcon />
              </Link>
            </div>

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
          <Link
            href="#"
            className={styles.enquireButton}
            onClick={() => setMobileOpen(false)}
          >
            <span>Enquire Now</span>
            <ArrowRightIcon />
          </Link>
        </div>
      </nav>

      {mobileOpen && <div className={styles.mobileScrim} aria-hidden="true" />}
    </header>
  );
}
