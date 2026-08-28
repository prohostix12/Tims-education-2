import type { Metadata } from "next";
import SvsuHeroSection from "@/components/SvsuHeroSection/SvsuHeroSection";
import SvsuAboutSection from "@/components/SvsuAboutSection/SvsuAboutSection";
import SvsuCdoeSection from "@/components/SvsuCdoeSection/SvsuCdoeSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Swami Vivekanand Subharti University | TIMS Education",
  description: "Swami Vivekanand Subharti University (SVSU) and its Centre for Distance and Online Education.",
};

export default function SvsuPage() {
  return (
    <main>
      <PageHero title="Swami Vivekanand Subharti University" />
      <SvsuHeroSection />
      <SvsuAboutSection />
      <SvsuCdoeSection />
    </main>
  );
}
