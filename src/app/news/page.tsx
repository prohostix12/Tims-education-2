import type { Metadata } from "next";
import NewsSection from "@/components/NewsSection/NewsSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "News & Events | TIMS Education",
  description: "Announcements, events, results, and updates from TIMS Education.",
};

export default function NewsPage() {
  return (
    <main>
      <PageHero title="News & Events" />
      <NewsSection />
    </main>
  );
}
