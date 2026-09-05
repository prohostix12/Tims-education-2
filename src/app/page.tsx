import Hero from "@/components/Hero/Hero";
import SuccessStoriesSection from "@/components/SuccessStoriesSection/SuccessStoriesSection";
// import NewAboutSection from "@/components/NewAboutSection/NewAboutSection";
import CoursesSection from "@/components/CoursesSection/CoursesSection";
import UniversitiesSection from "@/components/UniversitiesSection/UniversitiesSection";
import DirectorsSection from "@/components/DirectorsSection/DirectorsSection";
import FindCourseSection from "@/components/FindCourseSection/FindCourseSection";
import TestimonialsSection from "@/components/TestimonialsSection/TestimonialsSection";
import PartnersSection from "@/components/PartnersSection/PartnersSection";
import DreamSection from "@/components/DreamSection/DreamSection";
import BlogSection from "@/components/BlogSection/BlogSection";
import DistanceEducationSection from "@/components/DistanceEducationSection/DistanceEducationSection";
import HomeGallerySection from "@/components/HomeGallerySection/HomeGallerySection";

export default function Home() {
  return (
    <main>
      <Hero />
      <SuccessStoriesSection />
      {/* <NewAboutSection /> */}
      <CoursesSection />
      <UniversitiesSection />
      <DirectorsSection />
      <FindCourseSection />
      <PartnersSection />
      <TestimonialsSection />
      <DreamSection />
      <BlogSection />
      <DistanceEducationSection />
      <HomeGallerySection />
    </main>
  );
}
