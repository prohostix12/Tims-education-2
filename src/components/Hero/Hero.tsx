"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import { useEnquiryForm } from "@/lib/useEnquiryForm";

type MarqueeNewsItem = {
  id: string;
  tag: string;
  title: string;
  description: string;
  link?: string;
};

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { status, errorMessage, handleSubmit } = useEnquiryForm("home-hero");
  const [newsItems, setNewsItems] = useState<MarqueeNewsItem[]>([]);

  useEffect(() => {
    async function loadMarqueeItems() {
      try {
        const res = await fetch("/api/news-events?marquee=true");
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          setNewsItems(
            data.items.map((item: any) => ({
              id: item.id,
              tag: item.tag || "UPDATE",
              title: item.title || "",
              description: item.description || "",
              link: item.link || "/students/news",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load marquee news items:", err);
      }
    }
    loadMarqueeItems();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Setting `.muted` as a DOM property (not just the JSX attribute) is
    // what makes autoplay reliable across browsers — without it some
    // browsers silently block playback and the video just sits on its
    // first frame, looking like a static image.
    video.muted = true;
    video.defaultMuted = true;

    let cancelled = false;

    const play = () => {
      const result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(() => {
          // Autoplay was rejected (strict browser policy / low-power mode).
          // The retries below (readiness events + first user interaction)
          // pick it back up.
        });
      }
    };

    // The initial attempt can fire before the browser has actually buffered
    // enough of the video — retry once it reports it's ready to play.
    const onReady = () => {
      if (!cancelled) play();
    };
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);

    play();

    // Re-trigger whenever the tab regains visibility so the loop never
    // stalls after backgrounding.
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") play();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Last-resort fallback: some browsers block autoplay entirely until the
    // user has interacted with the page at least once.
    const onFirstInteraction = () => {
      if (video.paused) play();
    };
    const interactionEvents: (keyof DocumentEventMap)[] = ["pointerdown", "keydown", "touchstart", "scroll"];
    interactionEvents.forEach((eventName) =>
      document.addEventListener(eventName, onFirstInteraction, { once: true, passive: true }),
    );

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      interactionEvents.forEach((eventName) => document.removeEventListener(eventName, onFirstInteraction));
    };
  }, []);

  return (
    <section className={styles.hero}>
      {/* <video
        ref={videoRef}
        className={styles.bgVideo}
        src="/images/stories/Campus_video1.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      /> */}
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} aria-hidden="true" />
            <span>YOUR NEXT ACADEMIC STEP STARTS HERE</span>
          </div>
          <h1 className={styles.title}>
            Learn Without Limits.
            <br />
            <span className={styles.titleTeal}>Build the Future You Want.</span>
          </h1>
          <p className={styles.subtitle}>
            Explore 10th &amp; Plus Two, degree, postgraduate, diploma and skill programs with expert guidance to help you choose the right course and university.
          </p>

          <div className={styles.actions}>
            <a href="https://findyouruniversity.com/" className={styles.primaryButton}>
              Explore Programs &rarr;
            </a>
            <a href="#hero-name" className={styles.secondaryButton}>
              Talk to an Advisor
            </a>
          </div>
        </div>

        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Make Your Enquiry</h2>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="hero-name" className={styles.label}>
                Name
              </label>
              <input
                id="hero-name"
                name="name"
                type="text"
                placeholder="Your full name"
                className={styles.input}
                autoComplete="name"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="hero-email" className={styles.label}>
                Email
              </label>
              <input
                id="hero-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className={styles.input}
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="hero-phone" className={styles.label}>
                Phone Number
              </label>
              <input
                id="hero-phone"
                name="phone"
                type="tel"
                placeholder="+91 00000 00000"
                className={styles.input}
                autoComplete="tel"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="hero-preference" className={styles.label}>
                Preference
              </label>
              <select id="hero-preference" name="preference" className={styles.select} defaultValue="">
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

            <button type="submit" className={styles.submitButton} disabled={status === "submitting"}>
              {status === "submitting" ? "Sending..." : "Enquire Now"}
            </button>

            {status === "success" && (
              <p className={styles.formStatusSuccess}>Thanks! We&rsquo;ll get in touch with you shortly.</p>
            )}
            {status === "error" && <p className={styles.formStatusError}>{errorMessage}</p>}
          </form>
        </div>
      </div>

      {/* Marquee News & Events Bar */}
      <div className={styles.marqueeSection}>
        <div className={styles.marqueeHeader}>
          <div className={styles.bellWrapper}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.bellIcon}
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className={styles.bellBadge} />
          </div>
          <span className={styles.marqueeTitle}>Latest Updates</span>
          <span className={styles.liveTag}>LIVE</span>
        </div>

        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeTrack}>
            {/* Set 1 */}
            {newsItems.map((item) => (
              <Link href={item.link || "/students/news"} key={`news-1-${item.id}`} className={styles.marqueeItem}>
                <span className={styles.marqueeDateTag}>{item.tag}</span>
                <strong className={styles.marqueeItemTitle}>{item.title}:</strong>
                <span className={styles.marqueeItemDesc}>{item.description}</span>
                <span className={styles.marqueeDivider}>•</span>
              </Link>
            ))}
            {/* Set 2 (duplication for continuous loop) */}
            {newsItems.map((item) => (
              <Link href={item.link || "/students/news"} key={`news-2-${item.id}`} className={styles.marqueeItem}>
                <span className={styles.marqueeDateTag}>{item.tag}</span>
                <strong className={styles.marqueeItemTitle}>{item.title}:</strong>
                <span className={styles.marqueeItemDesc}>{item.description}</span>
                <span className={styles.marqueeDivider}>•</span>
              </Link>
            ))}
          </div>
        </div>

        <Link href="/students/news" className={styles.viewAllLink}>
          View All
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
