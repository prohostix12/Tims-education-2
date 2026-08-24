import type { Metadata } from "next";
import NiosIntroSection from "@/components/NiosIntroSection/NiosIntroSection";
import NiosOverviewSection from "@/components/NiosOverviewSection/NiosOverviewSection";

export const metadata: Metadata = {
  title: "National Institute of Open Schooling | TIMS Education",
  description: "About the National Institute of Open Schooling (NIOS) and its programmes.",
};

export default function NiosPage() {
  return (
    <main>
      <NiosIntroSection />
      <NiosOverviewSection />
    </main>
  );
}
