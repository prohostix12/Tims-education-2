import type { Metadata } from "next";
import BlogArchiveSection from "@/components/BlogArchiveSection/BlogArchiveSection";
import ArticleInsightsSection from "@/components/ArticleInsightsSection/ArticleInsightsSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Blog | TIMS Education",
  description: "News, guides, and announcements from TIMS Education.",
};

export default function BlogPage() {
  return (
    <main>
      <PageHero title="Blog" />
      <BlogArchiveSection />
      <ArticleInsightsSection />
    </main>
  );
}
