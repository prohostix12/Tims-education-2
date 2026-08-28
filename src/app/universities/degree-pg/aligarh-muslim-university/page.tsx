import type { Metadata } from "next";
import AmuSection from "@/components/AmuSection/AmuSection";
import AmuStickyNotesSection from "@/components/AmuStickyNotesSection/AmuStickyNotesSection";
import AmuCdoeSection from "@/components/AmuCdoeSection/AmuCdoeSection";
import AmuOnlineProgramsSection from "@/components/AmuOnlineProgramsSection/AmuOnlineProgramsSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Aligarh Muslim University | TIMS Education",
  description: "Aligarh Muslim University (AMU) and its Centre for Distance and Online Education (CDOE).",
};

export default function AligarhMuslimUniversityPage() {
  return (
    <main>
      <PageHero title="Aligarh Muslim University" />
      <AmuSection />
      <AmuStickyNotesSection />
      <AmuCdoeSection />
      <AmuOnlineProgramsSection />
    </main>
  );
}
