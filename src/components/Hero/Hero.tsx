"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";
import { useEnquiryForm } from "@/lib/useEnquiryForm";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { status, errorMessage, handleSubmit } = useEnquiryForm("home-hero");

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
      <video
        ref={videoRef}
        className={styles.bgVideo}
        src="/images/stories/Campus_video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>TRUSTED EDUCATION GUIDANCE · SINCE 2009</p>
          <h1 className={styles.title}>
            Find <span>The Right Course</span>
            <br />
            For Your Future
          </h1>
          <p className={styles.subtitle}>
            Explore 10th, Degree &amp; PG programs with expert guidance for admissions and university selection.
          </p>

          <div className={styles.actions}>
            <a href="https://findyouruniversity.com/" className={styles.primaryButton}>
              Find Your Best University
            </a>
            <Link href="#" className={styles.secondaryButton}>
              Explore Courses
            </Link>
          </div>

          <div className={styles.noticeContainer}>
            <div className={styles.paperNote}>
              {/* Red Push Pin */}
              <div className={styles.redPin} aria-hidden="true">
                <svg width="26" height="30" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 0C8.686 0 6 2.686 6 6C6 8.5 7.5 10.6 9.6 11.5L9 18H15L14.4 11.5C16.5 10.6 18 8.5 18 6C18 2.686 15.314 0 12 0Z"
                    fill="#dc2626"
                  />
                  <path
                    d="M10.5 6C10.5 5.17 11.17 4.5 12 4.5C12.83 4.5 13.5 5.17 13.5 6"
                    stroke="#fca5a5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path d="M12 18V28" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="12" cy="6" r="3" fill="#ef4444" />
                </svg>
              </div>

              {/* Header with Ringing Bell Icon */}
              <div className={styles.noticeHeader}>
                <div className={styles.noticeTitleGroup}>
                  <div className={styles.bellWrapper}>
                    <svg
                      width="18"
                      height="18"
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
                  <h3 className={styles.noticeHeading}>Latest News &amp; Events</h3>
                </div>
                <span className={styles.newTag}>Live Updates</span>
              </div>

              {/* Sample Notifications & News List */}
              <ul className={styles.noticeList}>
                <li className={styles.noticeItem}>
                  <span className={styles.bulletDot} />
                  <div className={styles.noticeContent}>
                    <span className={styles.noticeDate}>ADMISSIONS</span>
                    <strong>2026 Admissions Open:</strong> Enrolling now for SSLC, Plus Two, Degree &amp; PG Courses.
                  </div>
                </li>
                <li className={styles.noticeItem}>
                  <span className={styles.bulletDot} />
                  <div className={styles.noticeContent}>
                    <span className={styles.noticeDate}>SPOT DRIVE</span>
                    <strong>University Counseling Day:</strong> Free 1-on-1 university selection &amp; spot registration.
                  </div>
                </li>
                <li className={styles.noticeItem}>
                  <span className={styles.bulletDot} />
                  <div className={styles.noticeContent}>
                    <span className={styles.noticeDate}>SCHOLARSHIP</span>
                    <strong>Fee Waiver Scheme:</strong> Early applicants receive up to 30% tuition fee discounts.
                  </div>
                </li>
              </ul>
            </div>
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
    </section>
  );
}
