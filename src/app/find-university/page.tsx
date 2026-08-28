import type { Metadata } from "next";
import FindUniversitySection from "@/components/FindUniversitySection/FindUniversitySection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Find University | TIMS Education",
  description: "Key information from Find Your University — courses, universities, and contact details.",
};

export default function FindUniversityPage() {
  return (
    <main>
      <PageHero title="Find University" />
      <FindUniversitySection />
    </main>
  );
}
