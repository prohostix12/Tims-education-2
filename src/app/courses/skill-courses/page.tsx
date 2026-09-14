import type { Metadata } from "next";
import SkillCoursesSection from "@/components/SkillCoursesSection/SkillCoursesSection";
import PageHero from "@/components/PageHero/PageHero";

export const metadata: Metadata = {
  title: "Skill Courses | TIMS Education",
  description: "Job-oriented short-term and professional skill development courses at TIMS Education.",
};

export default function SkillCoursesPage() {
  return (
    <main>
      <PageHero title="Skill Courses" />
      <SkillCoursesSection />
    </main>
  );
}
