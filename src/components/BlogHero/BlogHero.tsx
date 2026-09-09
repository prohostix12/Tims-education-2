import Link from "next/link";
import styles from "./BlogHero.module.css";
import type { BlogPost } from "@/data/blogData";

type BlogHeroProps = {
  post: BlogPost;
};

export default function BlogHero({ post }: BlogHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/blog" className={styles.breadcrumbLink}>
            Blog
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{post.category}</span>
        </nav>

        {/* Category Pill */}
        <div className={styles.categoryBadge}>{post.category}</div>

        {/* Title */}
        <h1 className={styles.title}>{post.title}</h1>

        {/* Subtitle */}
        {post.subtitle && <p className={styles.subtitle}>{post.subtitle}</p>}

        {/* Meta details */}
        <div className={styles.metaRow}>
          <div className={styles.authorBadge}>
            <div className={styles.authorAvatar}>
              {post.author.charAt(0)}
            </div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{post.author}</span>
              {post.authorRole && (
                <span className={styles.authorRole}>{post.authorRole}</span>
              )}
            </div>
          </div>

          <div className={styles.metaDivider} aria-hidden="true" />

          <div className={styles.metaItem}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <span>{post.dateString}</span>
          </div>

          <div className={styles.metaDivider} aria-hidden="true" />

          <div className={styles.metaItem}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
