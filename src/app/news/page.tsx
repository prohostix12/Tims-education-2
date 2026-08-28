import type { Metadata } from "next";
import NewsSection from "@/components/NewsSection/NewsSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "News | TIMS Education",
  description: "Announcements, results, and updates from TIMS Education.",
};

export default function NewsPage() {
  return (
    <main>
      <PageHero title="News" />
      <NewsSection />
    </main>
  );
}
