import type { Metadata } from "next";
import DirectorsSection from "@/components/DirectorsSection/DirectorsSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Directors | TIMS Education",
  description: "Meet the directors and leadership team of TIMS Education.",
};

export default function DirectorsPage() {
  return (
    <main>
      <PageHero title="Directors" />
      <DirectorsSection />
    </main>
  );
}
