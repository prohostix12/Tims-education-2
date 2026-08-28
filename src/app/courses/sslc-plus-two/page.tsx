import type { Metadata } from "next";
import SslcPlusTwoSection from "@/components/SslcPlusTwoSection/SslcPlusTwoSection";
import AdmissionStreamsSection from "@/components/AdmissionStreamsSection/AdmissionStreamsSection";
import CertificateValueSection from "@/components/AdmissionStreamsSection/CertificateValueSection";
import CourseLevelsSection from "@/components/AdmissionStreamsSection/CourseLevelsSection";
import AdditionalFacilitySection from "@/components/AdditionalFacilitySection/AdditionalFacilitySection";
import TimsSupportSection from "@/components/TimsSupportSection/TimsSupportSection";
import SslcDistanceEducationSection from "@/components/SslcDistanceEducationSection/SslcDistanceEducationSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "SSLC / Plus Two | TIMS Education",
  description: "About the NIOS SSLC / Plus Two open schooling programme at TIMS Education.",
};

export default function SslcPlusTwoPage() {
  return (
    <main>
      <PageHero title="SSLC / Plus Two" />
      <SslcPlusTwoSection />
      <AdmissionStreamsSection />
      <CertificateValueSection />
      <CourseLevelsSection />
      <AdditionalFacilitySection />
      <TimsSupportSection />
      <SslcDistanceEducationSection />
    </main>
  );
}
