import type { Metadata } from "next";
import DiplomaSection from "@/components/DiplomaSection/DiplomaSection";
import DiplomaDistanceSection from "@/components/DiplomaDistanceSection/DiplomaDistanceSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Diploma | TIMS Education",
  description: "Diploma and Diploma in Engineering courses offered by TIMS Education.",
};

export default function DiplomaPage() {
  return (
    <main>
      <PageHero title="Diploma" />
      <DiplomaSection />
      <DiplomaDistanceSection />
    </main>
  );
}
