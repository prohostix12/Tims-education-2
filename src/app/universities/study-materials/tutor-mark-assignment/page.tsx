import type { Metadata } from "next";
import TutorMarkAssignmentSection from "@/components/TutorMarkAssignmentSection/TutorMarkAssignmentSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Tutor Mark Assignment (TMA) | TIMS Education",
  description: "Tutor Mark Assignment (TMA) downloads for TIMS Education students.",
};

export default function TutorMarkAssignmentPage() {
  return (
    <main>
      <PageHero title="Tutor Mark Assignment" />
      <TutorMarkAssignmentSection />
    </main>
  );
}
