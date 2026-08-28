import type { Metadata } from "next";
import CreditTransferSection from "@/components/CreditTransferSection/CreditTransferSection";
import CreditTransferProcessSection from "@/components/CreditTransferProcessSection/CreditTransferProcessSection";
import CreditTransferRestartSection from "@/components/CreditTransferRestartSection/CreditTransferRestartSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Credit Transfer | TIMS Education",
  description: "Credit Transfer Services at TIMS Education — recognize prior learning and continue your academic journey.",
};

export default function CreditTransferPage() {
  return (
    <main>
      <PageHero title="Credit Transfer" />
      <CreditTransferSection />
      <CreditTransferProcessSection />
      <CreditTransferRestartSection />
    </main>
  );
}
