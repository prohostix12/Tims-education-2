import type { Metadata } from "next";
import AmuOnlineSection from "@/components/AmuOnlineSection/AmuOnlineSection";

export const metadata: Metadata = {
  title: "AMU Online Study Materials | TIMS Education",
  description: "Study materials for AMU Online UG and PG courses.",
};

export default function AmuOnlineStudyMaterialsPage() {
  return (
    <main>
      <AmuOnlineSection />
    </main>
  );
}
