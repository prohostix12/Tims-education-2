import Hero from "@/components/Hero/Hero";
import NewAboutSection from "@/components/NewAboutSection/NewAboutSection";
import CoursesSection from "@/components/CoursesSection/CoursesSection";
import UniversitiesSection from "@/components/UniversitiesSection/UniversitiesSection";
import FindCourseSection from "@/components/FindCourseSection/FindCourseSection";
import TestimonialsSection from "@/components/TestimonialsSection/TestimonialsSection";
import PartnersSection from "@/components/PartnersSection/PartnersSection";
import DreamSection from "@/components/DreamSection/DreamSection";
import BlogSection from "@/components/BlogSection/BlogSection";
import DistanceEducationSection from "@/components/DistanceEducationSection/DistanceEducationSection";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <Hero />
      <NewAboutSection />
      <CoursesSection />
      <UniversitiesSection />
      <FindCourseSection />
      <PartnersSection />
      <TestimonialsSection />
      <DreamSection />
      <BlogSection />
      <DistanceEducationSection />
    </main>
  );
}
