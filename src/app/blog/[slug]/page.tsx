import type { Metadata } from "next";
import Link from "next/link";
import { fetchBlogPostBySlugFromDb, fetchRelatedPostsFromDb } from "@/lib/blogDb";
import BlogHero from "@/components/BlogHero/BlogHero";
import ShareButtons from "@/components/ShareButtons/ShareButtons";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostBySlugFromDb(slug);

  if (!post) {
    return {
      title: "Post Not Found | TIMS Education",
    };
  }

  return {
    title: `${post.title} | TIMS Education Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlugFromDb(slug);

  if (!post) {
    return (
      <main className={styles.notFoundContainer}>
        <div className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Article Not Found</h1>
          <p className={styles.notFoundText}>
            The blog article you are looking for does not exist or may have been moved.
          </p>
          <Link href="/blog" className={styles.backButton}>
            ← Back to Blog Section
          </Link>
        </div>
      </main>
    );
  }

  const relatedPosts = await fetchRelatedPostsFromDb(post.slug, 2);


  return (
    <main className={styles.pageWrapper}>
      {/* Hero Section */}
      <BlogHero post={post} />

      {/* Main Content Layout */}
      <div className={styles.container}>
        <div className={styles.layoutGrid}>
          {/* Main Article Content */}
          <article className={styles.articleBody}>
            {/* Featured Image */}
            {Boolean(post.image) && (
              <div className={styles.featuredImageWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt={post.title} className={styles.featuredImage} />
                <span className={styles.imageOverlayBadge}>{post.category}</span>
              </div>
            )}


            {/* Intro Paragraph */}
            <p className={styles.introText}>{post.content.intro}</p>

            {/* Key Takeaways Box */}
            {post.content.keyTakeaways && post.content.keyTakeaways.length > 0 && (
              <div className={styles.takeawaysCard}>
                <div className={styles.takeawaysHeader}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                    <path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Key Article Highlights</span>
                </div>
                <ul className={styles.takeawaysList}>
                  {post.content.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx}>{takeaway}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Content Sections */}
            {post.content.sections.map((section, index) => (
              <section className={styles.articleSection} key={index}>
                <h2 className={styles.sectionHeading}>{section.heading}</h2>
                {section.body.map((paragraph, pIdx) => (
                  <p key={pIdx} className={styles.paragraphText}>
                    {paragraph}
                  </p>
                ))}

                {section.quote && (
                  <blockquote className={styles.quoteBlock}>
                    <p>“{section.quote}”</p>
                  </blockquote>
                )}
              </section>
            ))}

            {/* Conclusion */}
            <div className={styles.conclusionBox}>
              <h3 className={styles.conclusionHeading}>Final Thoughts</h3>
              <p className={styles.paragraphText}>{post.content.conclusion}</p>
            </div>

            {/* Article Tags */}
            <div className={styles.tagsRow}>
              <span className={styles.tagsLabel}>Tags:</span>
              <div className={styles.tagsList}>
                {post.tags.map((tag) => (
                  <span className={styles.tagItem} key={tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share Component */}
            <ShareButtons title={post.title} />

            {/* Author Card */}
            <div className={styles.authorCard}>
              <div className={styles.authorAvatarLarge}>{post.author.charAt(0)}</div>
              <div className={styles.authorDetails}>
                <h4 className={styles.authorCardName}>{post.author}</h4>
                <p className={styles.authorCardRole}>{post.authorRole || "TIMS Education Academic Team"}</p>
                <p className={styles.authorBio}>
                  Dedicated to delivering verified news, UGC university updates, and guidance for distance and online education learners across Kerala and beyond.
                </p>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Academic Guidance Card */}
            <div className={styles.guidanceCard}>
              <span className={styles.guidanceBadge}>TIMS Support</span>
              <h3 className={styles.guidanceTitle}>Planning to Start Your Higher Education?</h3>
              <p className={styles.guidanceText}>
                Get free 1-on-1 counseling from our experts for UGC-DEB approved distance & online degree programs.
              </p>
              <a href="tel:+919072611800" className={styles.guidanceCta}>
                Call Academic Counselor
              </a>
              <Link href="/contact" className={styles.guidanceSecondaryCta}>
                Request Callback
              </Link>
            </div>

            {/* Related Posts */}
            <div className={styles.relatedWidget}>
              <h3 className={styles.widgetTitle}>Related Articles</h3>
              <div className={styles.relatedList}>
                {relatedPosts.map((rel) => (
                  <Link href={`/blog/${rel.slug}`} key={rel.slug} className={styles.relatedCard}>
                    <div className={styles.relatedMedia}>
                      {Boolean(rel.image) ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={rel.image} alt={rel.title} className={styles.relatedImage} />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: "#ff5a4e",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "0.85rem",
                          }}
                        >
                          {(rel.category || "TIMS").charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className={styles.relatedInfo}>
                      <span className={styles.relatedCategory}>{rel.category}</span>
                      <h4 className={styles.relatedTitle}>{rel.title}</h4>
                      <span className={styles.relatedDate}>{rel.dateString}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
