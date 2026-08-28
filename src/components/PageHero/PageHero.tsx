import styles from "./PageHero.module.css";

type PageHeroProps = {
  title: string;
  eyebrow?: string;
};

export default function PageHero({ title, eyebrow = "TIMS Education" }: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </section>
  );
}
