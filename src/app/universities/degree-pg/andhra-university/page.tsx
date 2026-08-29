import type { Metadata } from "next";
import PageHero from "@/components/PageHero/PageHero";
import FindUniversitySection from "@/components/FindUniversitySection/FindUniversitySection";

export const metadata: Metadata = {
  title: "Andhra University | TIMS Education",
  description: "Andhra University distance and online degree programs in affiliation with TIMS Education.",
};

export default function AndhraUniversityPage() {
  return (
    <main>
      <PageHero title="Andhra University" />
      <FindUniversitySection />
    </main>
  );
}
