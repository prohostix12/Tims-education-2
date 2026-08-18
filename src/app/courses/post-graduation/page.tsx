import type { Metadata } from "next";
import PostGraduationSection from "@/components/PostGraduationSection/PostGraduationSection";
import PgTrustedPathwaySection from "@/components/PgTrustedPathwaySection/PgTrustedPathwaySection";

export const metadata: Metadata = {
  title: "Post Graduation | TIMS Education",
  description: "Explore post graduation courses by department and their eligibility criteria.",
};

export default function PostGraduationPage() {
  return (
    <main>
      <PostGraduationSection />
      <PgTrustedPathwaySection />
    </main>
  );
}
