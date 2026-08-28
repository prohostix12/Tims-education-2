import type { Metadata } from "next";
import OnlineDegreeSection from "@/components/OnlineDegreeSection/OnlineDegreeSection";
import CareerAdvanceSection from "@/components/CareerAdvanceSection/CareerAdvanceSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Online Degree | TIMS Education",
  description: "Explore online degree courses by department and their eligibility criteria.",
};

export default function OnlineDegreePage() {
  return (
    <main>
      <PageHero title="Online Degree" />
      <OnlineDegreeSection />
      <CareerAdvanceSection />
    </main>
  );
}
