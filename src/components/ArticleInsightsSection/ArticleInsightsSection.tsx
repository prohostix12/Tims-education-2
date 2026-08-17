import type { ReactNode } from "react";
import "./tims-article-insights.css";

function ImagePlaceholderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m4.5 17 4.8-5 3.4 3.6 2.4-2.6 4.4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return <strong className="tims-article-highlight">{children}</strong>;
}

function ArticleSection({
  eyebrow,
  title,
  reverse,
  alt,
  children,
}: {
  eyebrow: string;
  title: string;
  reverse?: boolean;
  alt?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`tims-article-section ${reverse ? "tims-article-section--reverse" : ""} ${
        alt ? "tims-article-section--alt" : ""
      }`}
    >
      <div className="tims-article-inner">
        <div className="tims-article-media">
          <div className="tims-article-media-placeholder">
            <ImagePlaceholderIcon />
            <span className="tims-article-media-hint">Image coming soon</span>
          </div>
        </div>

        <div className="tims-article-content">
          <span className="tims-article-eyebrow">{eyebrow}</span>
          <h2 className="tims-article-title">{title}</h2>
          {children}
          <span className="tims-article-cta" aria-disabled="true">
            Read More
          </span>
        </div>
      </div>
    </section>
  );
}

export default function ArticleInsightsSection() {
  return (
    <>
      <ArticleSection eyebrow="From the Blog" title="Insights &amp; Guidance for Smarter Distance Learning">
        <p className="tims-article-text">
          The TIMS Education blog section is a place where students can find practical advice
          and real experiences that make learning easier. Many readers come here looking for{" "}
          <Highlight>distance learning tips</Highlight>, and we try to share ideas that
          actually help in day-to-day study life. Whether someone is new to online education or
          returning after a break, the tips we provide come from real situations faced by
          learners.
        </p>
        <p className="tims-article-text">
          We also help people who aren&rsquo;t sure what to do next with their online degrees.
          This advice is straightforward, honest, and based on what students often ask us.
          Along with that, we regularly share <Highlight>course updates in Kerala</Highlight> so
          learners stay informed about new options and changes in the education field. You&rsquo;ll
          also find plenty of online degree guidance to help you move forward with clarity.
        </p>
      </ArticleSection>

      <ArticleSection
        eyebrow="Career Guidance"
        title="UGC-Approved Online MBA &amp; PG Courses in Calicut"
        reverse
        alt
      >
        <p className="tims-article-text">
          If you&rsquo;ve been thinking about getting an MBA or doing a postgraduate course but
          don&rsquo;t want to quit your job, an online program can make things much easier. In
          Calicut, <Highlight>UGC-approved online MBA and PG courses</Highlight> are becoming a
          popular choice for people who want to move ahead in their careers without putting
          everything else on hold.
        </p>
        <p className="tims-article-text">
          Online MBA programs usually offer specialisations like Finance, Marketing, Human
          Resources, and Operations, so whether you&rsquo;re working already or planning to
          shift into management, you can choose a field that matches your career goals. At TIMS
          Education, we help you choose the right university with{" "}
          <Highlight>100% personalised support</Highlight> through admissions and paperwork.
        </p>
      </ArticleSection>

      <ArticleSection
        eyebrow="Career Guidance"
        title="Top UGC-Approved Online MBA &amp; PG Courses in Malappuram"
      >
        <p className="tims-article-text">
          If you&rsquo;re living in Malappuram and thinking about doing an MBA or a
          postgraduate course but don&rsquo;t want to leave your job or travel far for classes,
          online programs can make things much simpler. Top{" "}
          <Highlight>UGC-approved online MBA &amp; PG courses in Malappuram</Highlight> give you
          the freedom to study from home while building your career at the same time.
        </p>
        <p className="tims-article-text">
          Many students in Malappuram now choose online MBA specialisations like Finance,
          Marketing, Human Resources, and Operations, along with{" "}
          <Highlight>PG courses in Commerce and Management</Highlight>. At TIMS Education,
          students get clear, straightforward guidance on choosing the right university and
          course at every step.
        </p>
      </ArticleSection>
    </>
  );
}
