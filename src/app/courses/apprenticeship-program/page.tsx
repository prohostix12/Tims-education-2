import type { Metadata } from "next";
import ApprenticeshipSection from "@/components/ApprenticeshipSection/ApprenticeshipSection";
import ApprenticeshipFormSection from "@/components/ApprenticeshipFormSection/ApprenticeshipFormSection";

export const metadata: Metadata = {
  title: "Apprenticeship Program | TIMS Education",
  description: "Employee Apprenticeship-Based Learning Program (EALP) at TIMS Education.",
};

export default function ApprenticeshipProgramPage() {
  return (
    <main>
      <ApprenticeshipSection />
      <ApprenticeshipFormSection />
    </main>
  );
}
