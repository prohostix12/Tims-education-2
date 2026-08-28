import type { Metadata } from "next";
import JamiaUrduSection from "@/components/JamiaUrduSection/JamiaUrduSection";
import JamiaUrduHeritageSection from "@/components/JamiaUrduHeritageSection/JamiaUrduHeritageSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Jamia Urdu Aligarh | TIMS Education",
  description: "Jamia Urdu Aligarh — pioneering Urdu education and culture, COBSE approved.",
};

export default function JamiaUrduAligarhPage() {
  return (
    <main>
      <PageHero title="Jamia Urdu Aligarh" />
      <JamiaUrduSection />
      <JamiaUrduHeritageSection />
    </main>
  );
}
