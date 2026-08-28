import type { Metadata } from "next";
import BosseSection from "@/components/BosseSection/BosseSection";
import BosseHighlightsSection from "@/components/BosseHighlightsSection/BosseHighlightsSection";
import BosseStudyPaceSection from "@/components/BosseStudyPaceSection/BosseStudyPaceSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "BOSSE | TIMS Education",
  description: "Board of Open Schooling and Skill Education (BOSSE) at TIMS Education.",
};

export default function BossePage() {
  return (
    <main>
      <PageHero title="BOSSE" />
      <BosseSection />
      <BosseHighlightsSection />
      <BosseStudyPaceSection />
    </main>
  );
}
