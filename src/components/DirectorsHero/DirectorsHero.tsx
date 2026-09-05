import styles from "./DirectorsHero.module.css";

export default function DirectorsHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.inner}>
        <span className={styles.eyebrow}>LEADERSHIP &amp; VISION · TIMS EDUCATION</span>

        <h1 className={styles.title}>
          Meet Our <span>Directors</span> &amp; Leadership
        </h1>

        <p className={styles.subtitle}>
          Guided by visionary founders and experienced academic directors dedicated to empowering students through accessible, recognised distance &amp; online education.
        </p>

        <div className={styles.featuresStrip}>
          <div className={styles.featureBadge}>
            <span className={styles.featureBadgeIcon}>🏛️</span>
            <span>18+ Years Academic Excellence</span>
          </div>
          <div className={styles.featureBadge}>
            <span className={styles.featureBadgeIcon}>🎓</span>
            <span>50,000+ Students Mentored</span>
          </div>
          <div className={styles.featureBadge}>
            <span className={styles.featureBadgeIcon}>🤝</span>
            <span>Recognised University Partners</span>
          </div>
        </div>
      </div>
    </section>
  );
}
