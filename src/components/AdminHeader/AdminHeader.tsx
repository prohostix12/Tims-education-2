"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "./AdminHeader.module.css";

type NavSingleItem = {
  label: string;
  href: string;
};

type NavDropdownGroup = {
  label: string;
  children: {
    label: string;
    href: string;
    description?: string;
  }[];
};

type NavItem = NavSingleItem | NavDropdownGroup;

const navStructure: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Content & Media",
    children: [
      { label: "Directors & Leadership", href: "/admin/directors", description: "Manage director profiles & photos" },
      { label: "Success Stories", href: "/admin/success-stories", description: "Manage Real Impact & Success cards" },
      { label: "News & Events", href: "/admin/news", description: "Manage announcements & marquee" },
      { label: "Site Pages", href: "/admin/pages", description: "Edit page content & metadata" },
      { label: "Media Gallery", href: "/admin/gallery", description: "Manage photos & event albums" },
    ],
  },
  {
    label: "Universities",
    href: "/admin/universities",
  },
  {
    label: "Leads & Feedback",
    children: [
      { label: "Student Enquiries", href: "/admin/enquiries", description: "View & track admission leads" },
      { label: "Contact Info & Messages", href: "/admin/contact", description: "Address & contact form data" },
      { label: "Student Reviews", href: "/admin/reviews", description: "Moderate testimonials & ratings" },
    ],
  },
  {
    label: "System & Settings",
    children: [
      { label: "User Accounts", href: "/admin/users", description: "Manage admin users & permissions" },
      { label: "Global Settings", href: "/admin/settings", description: "Site configuration & SEO" },
    ],
  },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const headerRef = useRef<HTMLHeadingElement | null>(null);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  // Handle click outside to close open dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isLinkActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const isGroupActive = (group: NavDropdownGroup) => {
    return group.children.some((child) => isLinkActive(child.href));
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={styles.inner}>
        <Link href="/admin" className={styles.brand}>
          <span className={styles.brandMark}>TIMS</span>
          <span className={styles.brandLabel}>Admin</span>
        </Link>

        <nav className={styles.nav} aria-label="Admin navigation">
          <ul className={styles.navList}>
            {navStructure.map((item) => {
              if ("href" in item) {
                const active = isLinkActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              const groupActive = isGroupActive(item);
              const isOpen = openDropdown === item.label;

              return (
                <li key={item.label} className={styles.dropdownContainer}>
                  <button
                    type="button"
                    className={`${styles.navLink} ${styles.dropdownTrigger} ${
                      groupActive ? styles.navLinkActive : ""
                    } ${isOpen ? styles.dropdownTriggerOpen : ""}`}
                    onClick={() => toggleDropdown(item.label)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    <span>{item.label}</span>
                    <svg
                      className={`${styles.chevron} ${isOpen ? styles.chevronRotated : ""}`}
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
                  </button>

                  {isOpen && (
                    <div className={styles.dropdownMenu} role="menu">
                      {item.children.map((child) => {
                        const childActive = isLinkActive(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`${styles.dropdownItem} ${childActive ? styles.dropdownItemActive : ""}`}
                            role="menuitem"
                          >
                            <span className={styles.dropdownItemLabel}>{child.label}</span>
                            {child.description && (
                              <span className={styles.dropdownItemDesc}>{child.description}</span>
                            )}
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

        <Link href="/" className={styles.viewSite}>
          View Site
        </Link>
      </div>
    </header>
  );
}
