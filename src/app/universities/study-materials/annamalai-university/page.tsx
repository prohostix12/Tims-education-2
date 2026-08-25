import type { Metadata } from "next";
import AnnamalaiBooksSection from "@/components/AnnamalaiBooksSection/AnnamalaiBooksSection";

export const metadata: Metadata = {
  title: "Annamalai University Study Materials | TIMS Education",
  description: "UG and PG book study materials for Annamalai University courses.",
};

export default function AnnamalaiUniversityPage() {
  return (
    <main>
      <AnnamalaiBooksSection />
    </main>
  );
}
