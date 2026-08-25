import type { Metadata } from "next";
import StudyMaterialsNiosSection from "@/components/StudyMaterialsNiosSection/StudyMaterialsNiosSection";

export const metadata: Metadata = {
  title: "NIOS Study Materials | TIMS Education",
  description: "Study materials for the National Institute of Open Schooling (NIOS).",
};

export default function NiosStudyMaterialsPage() {
  return (
    <main>
      <StudyMaterialsNiosSection />
    </main>
  );
}
