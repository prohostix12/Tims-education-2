import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.inner}>
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
    </section>
  );
}
