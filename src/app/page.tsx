import Hero from "@/components/Hero/Hero";
import NewAboutSection from "@/components/NewAboutSection/NewAboutSection";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <Hero />
      <NewAboutSection />
      <div className={styles.hero}>
        <h2 className={styles.title}>More content coming soon</h2>
        <p className={styles.subtitle}>
          Courses, universities, and services sections will go here.
        </p>
      </div>
    </main>
  );
}
