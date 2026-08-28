import type { Metadata } from "next";
import SgvuSection from "@/components/SgvuSection/SgvuSection";
import SgvuCdoeSection from "@/components/SgvuCdoeSection/SgvuCdoeSection";
import SgvuFeesSection from "@/components/SgvuFeesSection/SgvuFeesSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Suresh Gyan Vihar University | TIMS Education",
  description: "Suresh Gyan Vihar University (SGVU) and its Centre for Distance and Online Education.",
};

export default function SureshGyanViharUniversityPage() {
  return (
    <main>
      <PageHero title="Suresh Gyan Vihar University" />
      <SgvuSection />
      <SgvuCdoeSection />
      <SgvuFeesSection />
    </main>
  );
}
