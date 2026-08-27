import type { Metadata } from "next";
import SvsuOnlineSection from "@/components/SvsuOnlineSection/SvsuOnlineSection";

export const metadata: Metadata = {
  title: "SVSU Online Study Materials | TIMS Education",
  description: "Semester-wise UG and PG study materials for SVSU Online courses.",
};

export default function SvsuOnlineStudyMaterialsPage() {
  return (
    <main>
      <SvsuOnlineSection />
    </main>
  );
}
