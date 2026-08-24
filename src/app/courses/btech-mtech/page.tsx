import type { Metadata } from "next";
import BtechMtechSection from "@/components/BtechMtechSection/BtechMtechSection";
import BtechDistanceSection from "@/components/BtechDistanceSection/BtechDistanceSection";

export const metadata: Metadata = {
  title: "B.Tech / M.Tech | TIMS Education",
  description: "B.Tech / M.Tech credit transfer scheme, branches, examination and fees.",
};

export default function BtechMtechPage() {
  return (
    <main>
      <BtechMtechSection />
      <BtechDistanceSection />
    </main>
  );
}
