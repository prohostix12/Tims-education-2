import type { Metadata } from "next";
import SvuBooksSection from "@/components/SvuBooksSection/SvuBooksSection";

export const metadata: Metadata = {
  title: "SVU Study Materials | TIMS Education",
  description: "Study materials for SVU UG and PG courses.",
};

export default function SvuStudyMaterialsPage() {
  return (
    <main>
      <SvuBooksSection />
    </main>
  );
}
