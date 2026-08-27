import type { Metadata } from "next";
import SyllabusSection from "@/components/SyllabusSection/SyllabusSection";

export const metadata: Metadata = {
  title: "Syllabus | TIMS Education",
  description: "University-wise syllabus and course details for TIMS Education students.",
};

export default function SyllabusPage() {
  return (
    <main>
      <SyllabusSection />
    </main>
  );
}
