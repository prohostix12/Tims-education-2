import type { Metadata } from "next";
import SyllabusSection from "@/components/SyllabusSection/SyllabusSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Syllabus | TIMS Education",
  description: "University-wise syllabus and course details for TIMS Education students.",
};

export default function SyllabusPage() {
  return (
    <main>
      <PageHero title="Syllabus" />
      <SyllabusSection />
    </main>
  );
}
