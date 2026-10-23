import React from "react";
import { Metadata } from "next";
import { DsaConceptsGallery } from "@/components/animations/dsa-concepts-gallery";
import { ANIMATIONS_PAGE_META } from "@/lib/dsa-animations-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: `${ANIMATIONS_PAGE_META.title} | Mindflare.tech`,
  description: ANIMATIONS_PAGE_META.subtitle,
};

export default function DsaConceptsPage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 sm:pt-28 pb-16">
        <DsaConceptsGallery />
      </div>
      <Footer />
    </div>
  );
}
