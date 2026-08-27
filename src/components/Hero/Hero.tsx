"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { FormEvent } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // UI only for now — no backend wiring.
  };

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
        src="/images/tims_logo/hero-bg.mp4"
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
          <p className={styles.eyebrow}>Learning Without Boundaries</p>
          <h1 className={styles.title}>
            Shape Your Future With <span>The Right Course</span>, The Right University
          </h1>
          <p className={styles.subtitle}>
            TIMS Education guides students through admissions, counselling, and university
            placements — with expert support at every step of the journey.
          </p>

          <div className={styles.actions}>
            <a href="https://findyouruniversity.com/" className={styles.primaryButton}>
              Find Your Best University
            </a>
            <Link href="#" className={styles.secondaryButton}>
              Explore Courses
            </Link>
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

            <button type="submit" className={styles.submitButton}>
              Enquire Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
