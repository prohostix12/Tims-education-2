import type { Metadata } from "next";
import PostGraduationSection from "@/components/PostGraduationSection/PostGraduationSection";
import PgTrustedPathwaySection from "@/components/PgTrustedPathwaySection/PgTrustedPathwaySection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Post Graduation | TIMS Education",
  description: "Explore post graduation courses by department and their eligibility criteria.",
};

export default function PostGraduationPage() {
  return (
    <main>
      <PageHero title="Post Graduation" />
      <PostGraduationSection />
      <PgTrustedPathwaySection />
    </main>
  );
}
