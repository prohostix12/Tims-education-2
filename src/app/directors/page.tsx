import type { Metadata } from "next";
import DirectorsSection from "@/components/DirectorsSection/DirectorsSection";

export const metadata: Metadata = {
  title: "Directors | TIMS Education",
  description: "Meet the directors and leadership team of TIMS Education.",
};

export default function DirectorsPage() {
  return (
    <main>
      <DirectorsSection />
    </main>
  );
}
