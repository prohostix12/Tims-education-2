import type { Metadata } from "next";
import BtechMtechSection from "@/components/BtechMtechSection/BtechMtechSection";
import BtechDistanceSection from "@/components/BtechDistanceSection/BtechDistanceSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "B.Tech / M.Tech | TIMS Education",
  description: "B.Tech / M.Tech credit transfer scheme, branches, examination and fees.",
};

export default function BtechMtechPage() {
  return (
    <main>
      <PageHero title="B.Tech / M.Tech" />
      <BtechMtechSection />
      <BtechDistanceSection />
    </main>
  );
}
