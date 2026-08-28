import type { Metadata } from "next";
import SvsuOnlineSection from "@/components/SvsuOnlineSection/SvsuOnlineSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "SVSU Online Study Materials | TIMS Education",
  description: "Semester-wise UG and PG study materials for SVSU Online courses.",
};

export default function SvsuOnlineStudyMaterialsPage() {
  return (
    <main>
      <PageHero title="SVSU Online" />
      <SvsuOnlineSection />
    </main>
  );
}
