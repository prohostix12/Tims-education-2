"use client";

import { useState, useEffect } from "react";
import styles from "./ShareButtons.module.css";

type ShareButtonsProps = {
  title: string;
};

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleCopy = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(currentUrl);

  return (
    <div className={styles.shareContainer}>
      <span className={styles.shareLabel}>Share Article:</span>
      <div className={styles.buttonRow}>
        <button
          type="button"
          className={`${styles.shareButton} ${copied ? styles.copied : ""}`}
          onClick={handleCopy}
          title="Copy Link"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
            <path
              d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </button>

        <a
          href={currentUrl ? `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}` : "#"}
          target={currentUrl ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className={`${styles.shareButton} ${styles.whatsapp}`}
          title="Share on WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.83a8.17 8.17 0 0 1-5.82 2.41c-1.47 0-2.92-.39-4.18-1.14l-.3-.18-3.11.82.83-3.03-.2-.31a8.21 8.21 0 0 1-1.27-4.4c0-4.54 3.7-8.24 8.23-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.15.16-.25.24-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.6.19 1.15.16 1.59.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
          </svg>
          <span>WhatsApp</span>
        </a>

        <a
          href={currentUrl ? `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` : "#"}
          target={currentUrl ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className={`${styles.shareButton} ${styles.twitter}`}
          title="Share on X"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Share</span>
        </a>
      </div>
    </div>
  );
}

