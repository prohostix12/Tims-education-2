"use client";

import styles from "./StatsMarqueeSection.module.css";

type StatItem = {
  value: string;
  label: string;
};

const STATS_ITEMS: StatItem[] = [
  { value: "18+", label: "Years of Experience" },
  { value: "50,000+", label: "Enrolled Students" },
  { value: "100+", label: "Partner Universities" },
  { value: "90+", label: "Qualified Staff" },
  { value: "98%", label: "Student Satisfaction Rate" },
  { value: "15+", label: "Degree & Diploma Streams" },
];

export default function StatsMarqueeSection() {
  return (
    <section className={styles.section} aria-label="TIMS Statistics and Milestones">
      <div className={styles.container}>
        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeTrack}>
            {/* Set 1 */}
            {STATS_ITEMS.map((item, index) => (
              <div key={`stat-1-${index}`} className={styles.statBlock}>
                <span className={styles.statValue}>{item.value}</span>
                <span className={styles.statLabel}>{item.label}</span>
              </div>
            ))}
            {/* Set 2 (Seamless loop duplicate) */}
            {STATS_ITEMS.map((item, index) => (
              <div key={`stat-2-${index}`} className={styles.statBlock}>
                <span className={styles.statValue}>{item.value}</span>
                <span className={styles.statLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
