"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./AdminHeader.module.css";

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function ContentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function CoursesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function UniversityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function LeadsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}



function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ChevronIcon({ rotated }: { rotated?: boolean }) {
  return (
    <svg
      className={`${styles.chevron} ${rotated ? styles.chevronRotated : ""}`}
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SslcIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M10 8h6M10 12h6" />
    </svg>
  );
}

type NavSingleItem = {
  label: string;
  href: string;
  icon: React.ComponentType;
};

type NavDropdownGroup = {
  label: string;
  icon: React.ComponentType;
  children: {
    label: string;
    href: string;
    description?: string;
  }[];
};

type NavItem = NavSingleItem | NavDropdownGroup;

const navStructure: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: DashboardIcon },
  {
    label: "Content & Media",
    icon: ContentIcon,
    children: [
      { label: "Blog Posts", href: "/admin/blog", description: "Manage articles & news content" },
      { label: "Student Video Reels", href: "/admin/video-stories", description: "Manage Student Success Video Reels" },
      { label: "Distance Education Video", href: "/admin/distance-education", description: "Manage Distance Education section video" },
      { label: "Directors & Leadership", href: "/admin/directors", description: "Manage director profiles & photos" },
      { label: "Our Team Members", href: "/admin/team-members", description: "Manage staff & team member profiles" },
      { label: "Success Stories", href: "/admin/success-stories", description: "Manage Real Impact cards" },
      { label: "News & Events", href: "/admin/news", description: "Manage announcements & marquee" },
      { label: "FAQ", href: "/admin/faq", description: "Manage frequently asked questions" },
      { label: "Site Pages", href: "/admin/pages", description: "Edit page content & metadata" },
      { label: "Media Gallery", href: "/admin/gallery", description: "Manage photos & event albums" },
    ],
  },
  {
    label: "SSLC & Plus Two",
    icon: SslcIcon,
    children: [
      { label: "Content Cards", href: "/admin/courses/sslc-plus-two", description: "Manage Admission, On Demand & Course Structure cards" },
      { label: "Verified Documents & Recognitions", href: "/admin/courses/sslc-plus-two/verified-documents", description: "Manage NIOS & SSLC recognition PDF documents" },
    ],
  },
  {
    label: "Courses",
    icon: CoursesIcon,
    children: [
      { label: "All Courses", href: "/admin/courses", description: "Overview of all course categories" },
      { label: "Online Degree", href: "/admin/courses/online-degree", description: "UGC Approved Online Degree programs" },
      { label: "Post graduation", href: "/admin/courses/post-graduation", description: "Postgraduate & Masters programs" },
      { label: "B-Tech/M-Tech", href: "/admin/courses/btech-mtech", description: "Engineering & Technology degrees" },
      { label: "Diploma", href: "/admin/courses/diploma", description: "Polytechnic & Executive diplomas" },
      { label: "Apprenticeship", href: "/admin/courses/apprenticeship", description: "Industry apprenticeship & training" },
    ],
  },
  {
    label: "Universities",
    href: "/admin/universities",
    icon: UniversityIcon,
  },
  {
    label: "Leads & Feedback",
    icon: LeadsIcon,
    children: [
      { label: "Student Enquiries", href: "/admin/enquiries", description: "View & track admission leads" },
      { label: "Contact Info & Messages", href: "/admin/contact", description: "Address & contact form data" },
      { label: "Student Reviews", href: "/admin/reviews", description: "Moderate testimonials & ratings" },
    ],
  },
  {
    label: "System & Settings",
    icon: SettingsIcon,
    children: [
      { label: "User Accounts", href: "/admin/users", description: "Manage admin users & permissions" },
      { label: "Global Settings", href: "/admin/settings", description: "Site configuration & SEO" },
    ],
  },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isLinkActive = (href: string) => {
    if (href === "/admin" || href === "/admin/courses") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isGroupActive = (group: NavDropdownGroup) => {
    return group.children.some((child) => isLinkActive(child.href));
  };

  // Automatically expand active group on route change
  useEffect(() => {
    setMobileOpen(false);
    navStructure.forEach((item) => {
      if ("children" in item && isGroupActive(item)) {
        setOpenGroups((prev) => ({ ...prev, [item.label]: true }));
      }
    });
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className={styles.mobileHeader}>
        <Link href="/admin" className={styles.brand}>
          <span className={styles.brandMark}>TIMS</span>
          <span className={styles.brandLabel}>Admin</span>
        </Link>
        <button
          type="button"
          className={styles.mobileToggleBtn}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} />
      )}

      {/* Vertical Sidebar */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarMobileOpen : ""}`}>
        <div className={styles.sidebarTop}>
          <Link href="/admin" className={styles.brand}>
            <span className={styles.brandMark}>TIMS</span>
            <span className={styles.brandLabel}>Admin</span>
          </Link>
        </div>

        <div className={styles.menuSection}>
          <span className={styles.sectionTitle}>MENU UTAMA</span>

          <nav className={styles.nav} aria-label="Admin navigation">
            <ul className={styles.navList}>
              {navStructure.map((item) => {
                const IconComponent = item.icon;

                if ("href" in item) {
                  const active = isLinkActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                      >
                        <div className={styles.navLinkLeft}>
                          <span className={styles.navIcon}>
                            <IconComponent />
                          </span>
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    </li>
                  );
                }

                const groupActive = isGroupActive(item);
                const isOpen = Boolean(openGroups[item.label]);

                return (
                  <li key={item.label} className={styles.groupContainer}>
                    <button
                      type="button"
                      className={`${styles.navLink} ${styles.groupTrigger} ${
                        groupActive ? styles.navLinkGroupActive : ""
                      }`}
                      onClick={() => toggleGroup(item.label)}
                      aria-expanded={isOpen}
                    >
                      <div className={styles.navLinkLeft}>
                        <span className={styles.navIcon}>
                          <IconComponent />
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <ChevronIcon rotated={isOpen} />
                    </button>

                    {isOpen && (
                      <div className={styles.subList}>
                        {item.children.map((child) => {
                          const childActive = isLinkActive(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`${styles.subLink} ${
                                childActive ? styles.subLinkActive : ""
                              }`}
                            >
                              <span className={styles.subLinkTitle}>{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className={styles.sidebarFooter}>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            <span>Sign Out</span>
            <LogoutIcon />
          </button>
        </div>
      </aside>
    </>
  );
}
