import type { Metadata } from "next";
import AttestationSection from "@/components/AttestationSection/AttestationSection";
import AttestationTrustSection from "@/components/AttestationTrustSection/AttestationTrustSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Certificate Attestation | TIMS Education",
  description: "Certificate attestation services for higher education, employment, business and migration.",
};

export default function AttestationPage() {
  return (
    <main>
      <PageHero title="Certificate Attestation" />
      <AttestationSection />
      <AttestationTrustSection />
    </main>
  );
}
