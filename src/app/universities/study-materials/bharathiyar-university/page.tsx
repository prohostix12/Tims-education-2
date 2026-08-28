import type { Metadata } from "next";
import BharathiyarBooksSection from "@/components/BharathiyarBooksSection/BharathiyarBooksSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Bharathiyar University Study Materials | TIMS Education",
  description: "UG and PG book study materials for Bharathiyar University courses.",
};

export default function BharathiyarUniversityPage() {
  return (
    <main>
      <PageHero title="Bharathiyar University" />
      <BharathiyarBooksSection />
    </main>
  );
}
