import type { Metadata } from "next";
import AttestationSection from "@/components/AttestationSection/AttestationSection";
import AttestationTrustSection from "@/components/AttestationTrustSection/AttestationTrustSection";

export const metadata: Metadata = {
  title: "Certificate Attestation | TIMS Education",
  description: "Certificate attestation services for higher education, employment, business and migration.",
};

export default function AttestationPage() {
  return (
    <main>
      <AttestationSection />
      <AttestationTrustSection />
    </main>
  );
}
