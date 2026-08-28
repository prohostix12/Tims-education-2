import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection/ContactSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Contact | TIMS Education",
  description: "Get in touch with TIMS Education — office locations, phone, email, and an enquiry form.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHero title="Contact" />
      <ContactSection />
    </main>
  );
}
