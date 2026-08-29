"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

const exploreLinks = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "News", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Terms and Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

const universityLinks = [
  { label: "Guru Kashi University", href: "#" },
  { label: "Andhra University", href: "#" },
  { label: "Swami Vivekanand Subharti University", href: "#" },
  { label: "Mizoram University", href: "#" },
  { label: "Aligarh Muslim University", href: "#" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "X", href: "https://x.com", icon: "x" },
  { label: "Telegram", href: "https://telegram.org", icon: "telegram" },
] as const;

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
      <path
        d="M3.5 5.5h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="m3 6 9 7 9-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2a1 1 0 0 1 1-.3c1.1.4 2.3.6 3.5.6a1 1 0 0 1 1 1V19.5a1 1 0 0 1-1 1C9.9 20.5 3.5 14.1 3.5 6a1 1 0 0 1 1-1H7.6a1 1 0 0 1 1 1c0 1.2.2 2.4.6 3.5a1 1 0 0 1-.3 1l-2 1.3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.419h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.886-9.885 9.886m0-18.001C6.262 3.799 1.488 8.574 1.486 14.474c0 2.01.523 3.974 1.518 5.7L1.1 23.9l3.867-1.014c1.666.909 3.548 1.388 5.462 1.389h.005c5.875 0 10.65-4.774 10.652-10.675 0-2.847-1.108-5.524-3.12-7.535C15.952 4.053 13.273 2.943 10.42 2.943z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.3v5.4l4.8-2.7-4.8-2.7Z" fill="currentColor" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
      <path d="M4 4l16 16M20 4 4 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <path
        d="m3 12.5 17-8-3 16-6.5-4.5-3 3-.5-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  x: XIcon,
  telegram: TelegramIcon,
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandRow}>
          <Link href="/" className={styles.logoLink} aria-label="TIMS Education home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/tims_logo/logo.webp"
              alt="TIMS Education logo"
              className={styles.logoImage}
            />
          </Link>

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

        <hr className={styles.divider} />

        <div className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Company</h3>
            <p className={styles.companyText}>
              TIMS ( Tirur Institute of Management Studies) is an educational institution. It
              was established in 2009 with the sole purpose of providing education accessible
              to every section of society, ... <Link href="#" className={styles.readMore}>[Read More]</Link>
            </p>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Explore</h3>
            <ul>
              {exploreLinks.map((link, index) => (
                <li key={link.label}>
                  <Link href={link.href} className={index === 0 ? styles.activeLink : undefined}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Universities</h3>
            <ul>
              {universityLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Head Office</h3>
            <ul className={styles.contactList}>
              <li>
                <a href="#" className={styles.contactRow}>
                  <MailIcon />
                  <span>info@timseducation.com</span>
                </a>
              </li>
              <li>
                <a href="#" className={styles.contactRow}>
                  <PhoneIcon />
                  <span>+91 9961967777</span>
                </a>
              </li>
              <li className={styles.address}>
                2nd Floor, Pamls Tower, near Central Bank, Thazhepalam, Tirur, Kerala 676101
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Edapal Office</h3>
            <ul className={styles.contactList}>
              <li>
                <a href="#" className={styles.contactRow}>
                  <MailIcon />
                  <span>info@timseducation.com</span>
                </a>
              </li>
              <li>
                <a href="#" className={styles.contactRow}>
                  <PhoneIcon />
                  <span>+91 9526387777</span>
                </a>
              </li>
              <li className={styles.address}>
                2nd floor Al madeela complex Calicut road Edappal 679576 MALAPPURAM DT Kerala
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomInner}>
          <p className={styles.copyright}>&copy; {year} TIMS Education. All rights reserved.</p>
        </div>
      </div>

      <a
        href="https://wa.me/919961967777"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.contactBubble}
        aria-label="Contact us on WhatsApp"
      >
        <span className={styles.contactBubbleIcon}>
          <WhatsappIcon />
        </span>
        <span className={styles.contactBubbleLabel}>Contact us</span>
      </a>

      <button
        type="button"
        className={styles.scrollTopButton}
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUpIcon />
      </button>
    </footer>
  );
}
