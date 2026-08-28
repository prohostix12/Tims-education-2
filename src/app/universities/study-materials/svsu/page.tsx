import type { Metadata } from "next";
import SvsuBooksSection from "@/components/SvsuBooksSection/SvsuBooksSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "SVSU Study Materials | TIMS Education",
  description: "Study materials for Swami Vivekanand Subharti University (SVSU) UG and PG courses.",
};

export default function SvsuStudyMaterialsPage() {
  return (
    <main>
      <PageHero title="SVSU" />
      <SvsuBooksSection />
    </main>
  );
}
