import type { Metadata } from "next";
import BlogArchiveSection from "@/components/BlogArchiveSection/BlogArchiveSection";
import ArticleInsightsSection from "@/components/ArticleInsightsSection/ArticleInsightsSection";

export const metadata: Metadata = {
  title: "Blog | TIMS Education",
  description: "News, guides, and announcements from TIMS Education.",
};

export default function BlogPage() {
  return (
    <main>
      <BlogArchiveSection />
      <ArticleInsightsSection />
    </main>
  );
}
