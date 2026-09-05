import type { Metadata } from "next";
import DirectorsSection from "@/components/DirectorsSection/DirectorsSection";
import DirectorsHero from "@/components/DirectorsHero/DirectorsHero";

export const metadata: Metadata = {
  title: "Directors & Leadership | TIMS Education",
  description: "Meet the directors, founders, and leadership team of TIMS Education.",
};

export default function DirectorsPage() {
  return (
    <main>
      <DirectorsHero />
      <DirectorsSection />
    </main>
  );
}
