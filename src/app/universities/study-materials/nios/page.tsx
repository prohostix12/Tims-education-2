import type { Metadata } from "next";
import StudyMaterialsNiosSection from "@/components/StudyMaterialsNiosSection/StudyMaterialsNiosSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "NIOS Study Materials | TIMS Education",
  description: "Study materials for the National Institute of Open Schooling (NIOS).",
};

export default function NiosStudyMaterialsPage() {
  return (
    <main>
      <PageHero title="NIOS" />
      <StudyMaterialsNiosSection />
    </main>
  );
}
