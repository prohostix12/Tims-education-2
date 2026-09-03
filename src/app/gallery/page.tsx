import type { Metadata } from "next";
import PageHero from "@/components/PageHero/PageHero";
import GallerySection from "@/components/GallerySection/GallerySection";

export const metadata: Metadata = {
  title: "Gallery | TIMS Education",
  description: "Browse photo galleries, event highlights, convocation ceremonies, and campus life at TIMS Education.",
};

export default function GalleryPage() {
  return (
    <main>
      <PageHero title="Gallery" />
      <GallerySection />
    </main>
  );
}
