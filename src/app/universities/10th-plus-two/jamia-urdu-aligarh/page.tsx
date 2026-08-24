import type { Metadata } from "next";
import JamiaUrduSection from "@/components/JamiaUrduSection/JamiaUrduSection";
import JamiaUrduHeritageSection from "@/components/JamiaUrduHeritageSection/JamiaUrduHeritageSection";

export const metadata: Metadata = {
  title: "Jamia Urdu Aligarh | TIMS Education",
  description: "Jamia Urdu Aligarh — pioneering Urdu education and culture, COBSE approved.",
};

export default function JamiaUrduAligarhPage() {
  return (
    <main>
      <JamiaUrduSection />
      <JamiaUrduHeritageSection />
    </main>
  );
}
