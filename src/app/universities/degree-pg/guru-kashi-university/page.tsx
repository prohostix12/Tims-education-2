import type { Metadata } from "next";
import GuruKashiSection from "@/components/GuruKashiSection/GuruKashiSection";

export const metadata: Metadata = {
  title: "Guru Kashi University | TIMS Education",
  description: "TIMS Education is proudly affiliated with Guru Kashi University.",
};

export default function GuruKashiUniversityPage() {
  return (
    <main>
      <GuruKashiSection />
    </main>
  );
}
