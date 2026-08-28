import type { Metadata } from "next";
import AmuOnlineSection from "@/components/AmuOnlineSection/AmuOnlineSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "AMU Online Study Materials | TIMS Education",
  description: "Study materials for AMU Online UG and PG courses.",
};

export default function AmuOnlineStudyMaterialsPage() {
  return (
    <main>
      <PageHero title="AMU Online" />
      <AmuOnlineSection />
    </main>
  );
}
