"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminHeader.module.css";

const adminNavItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Enquiries", href: "/admin/enquiries" },
  { label: "Reviews", href: "/admin/reviews" },
  { label: "Pages", href: "/admin/pages" },
  { label: "Users", href: "/admin/users" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminHeader() {
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/admin" className={styles.brand}>
          <span className={styles.brandMark}>TIMS</span>
          <span className={styles.brandLabel}>Admin</span>
        </Link>

        <nav className={styles.nav} aria-label="Admin navigation">
          <ul className={styles.navList}>
            {adminNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/" className={styles.viewSite}>
          View Site
        </Link>
      </div>
    </header>
  );
}
