import type { Metadata } from "next";
import MizoramSection from "@/components/MizoramSection/MizoramSection";
import MizoramOnlineDegreeSection from "@/components/MizoramOnlineDegreeSection/MizoramOnlineDegreeSection";
import MizoramProgramsSection from "@/components/MizoramProgramsSection/MizoramProgramsSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Mizoram University | TIMS Education",
  description: "Mizoram University — a central university offering online degree and diploma programs.",
};

export default function MizoramUniversityPage() {
  return (
    <main>
      <PageHero title="Mizoram University" />
      <MizoramSection />
      <MizoramOnlineDegreeSection />
      <MizoramProgramsSection />
    </main>
  );
}
