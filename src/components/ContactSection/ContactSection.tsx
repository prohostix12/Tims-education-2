"use client";

import type { FormEvent } from "react";
import styles from "./ContactSection.module.css";

type Office = {
  title: string;
  address: string;
  phone: string;
  phoneHref: string;
  email: string;
};

const offices: Office[] = [
  {
    title: "Head Office",
    address: "2nd Floor, Pamls Tower, near Central Bank, Thazhepalam, Tirur, Kerala 676101",
    phone: "+91 9961967777",
    phoneHref: "tel:+919961967777",
    email: "info@timseducation.com",
  },
  {
    title: "Edapal Office",
    address: "2nd floor Al madeela complex Calicut road Edappal 679576 MALAPPURAM DT Kerala",
    phone: "+91 9526387777",
    phoneHref: "tel:+919526387777",
    email: "info@timseducation.com",
  },
];

const socialLinks = [
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "X", href: "https://x.com", icon: "x" },
  { label: "Telegram", href: "https://telegram.org", icon: "telegram" },
] as const;

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 21.5s7-6.3 7-12.2a7 7 0 0 0-14 0c0 5.9 7 12.2 7 12.2Z"
        fill="#ED1C24"
      />
      <circle cx="12" cy="9.3" r="2.6" fill="#ffffff" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="12" height="18" rx="1" stroke="#ED1C24" strokeWidth="1.6" />
      <path d="M16 9h4v12h-4" stroke="#ED1C24" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 7h2M11 7h2M7 11h2M11 11h2M7 15h2M11 15h2" stroke="#ED1C24" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2a1 1 0 0 1 1-.3c1.1.4 2.3.6 3.5.6a1 1 0 0 1 1 1V19.5a1 1 0 0 1-1 1C9.9 20.5 3.5 14.1 3.5 6a1 1 0 0 1 1-1H7.6a1 1 0 0 1 1 1c0 1.2.2 2.4.6 3.5a1 1 0 0 1-.3 1l-2 1.3Z"
        fill="#ED1C24"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M3.5 5.5h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z"
        fill="#ED1C24"
      />
      <path d="m4 6.5 8 6 8-6" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="m3 12.5 17-8-3 16-6.5-4.5-3 3-.5-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
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

export default function ContactSection() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // UI only for now — no backend wiring.
  };

  return (
    <section className={styles.contact}>
      <p className={styles.intro}>
        We&rsquo;re here to help you pick the right course or answer any questions you may have. To get
        in touch with our team, use the TIMS Education contact information below. We&rsquo;ll help you
        figure out what to do next to have a bright future.
      </p>

      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.offices}>
            {offices.map((office) => (
              <div className={styles.officeCard} key={office.title}>
                <div className={styles.officeHeader}>
                  <span className={styles.officeIcon}>
                    <PinIcon />
                  </span>
                  <h2 className={styles.officeTitle}>{office.title}</h2>
                </div>

                <ul className={styles.officeDetails}>
                  <li>
                    <span className={styles.detailIcon}>
                      <BuildingIcon />
                    </span>
                    <span>{office.address}</span>
                  </li>
                  <li>
                    <span className={styles.detailIcon}>
                      <PhoneIcon />
                    </span>
                    <a href={office.phoneHref}>Phone: {office.phone}</a>
                  </li>
                  <li>
                    <span className={styles.detailIcon}>
                      <MailIcon />
                    </span>
                    <a href={`mailto:${office.email}`}>{office.email}</a>
                  </li>
                </ul>

                <div className={styles.socialRow}>
                  <span className={styles.socialLabel}>Social:</span>
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
            ))}
          </div>

          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Get In Touch</h2>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label htmlFor="contact-name" className={styles.label}>
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  className={styles.input}
                  autoComplete="name"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-email" className={styles.label}>
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className={styles.input}
                  autoComplete="email"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-phone" className={styles.label}>
                  Phone Number
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 00000 00000"
                  className={styles.input}
                  autoComplete="tel"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-preference" className={styles.label}>
                  Preference
                </label>
                <select id="contact-preference" name="preference" className={styles.select} defaultValue="">
                  <option value="" disabled>
                    Select a course
                  </option>
                  <option value="sslc-plus-two">SSLC / Plus Two</option>
                  <option value="online-degree">Online Degree</option>
                  <option value="post-graduation">Post Graduation</option>
                  <option value="btech-mtech">Btech / Mtech</option>
                  <option value="diploma">Diploma</option>
                </select>
              </div>

              <button type="submit" className={styles.submitButton}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
