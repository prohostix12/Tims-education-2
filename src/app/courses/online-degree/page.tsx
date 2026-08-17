import type { Metadata } from "next";
import OnlineDegreeSection from "@/components/OnlineDegreeSection/OnlineDegreeSection";
import CareerAdvanceSection from "@/components/CareerAdvanceSection/CareerAdvanceSection";

export const metadata: Metadata = {
  title: "Online Degree | TIMS Education",
  description: "Explore online degree courses by department and their eligibility criteria.",
};

export default function OnlineDegreePage() {
  return (
    <main>
      <OnlineDegreeSection />
      <CareerAdvanceSection />
    </main>
  );
}
