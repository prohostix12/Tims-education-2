import type { Metadata } from "next";
import NewsSection from "@/components/NewsSection/NewsSection";

export const metadata: Metadata = {
  title: "News | TIMS Education",
  description: "Announcements, results, and updates from TIMS Education.",
};

export default function StudentsNewsPage() {
  return (
    <main>
      <NewsSection />
    </main>
  );
}
