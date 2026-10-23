import dynamic from "next/dynamic";
import { Navbar } from "../components/navbar";
import { HeroElite } from "../components/home/hero-elite";
import { TechMarquee } from "../components/home/tech-marquee";
import { InteractiveBentoSection } from "../components/home/interactive-bento-section";
import { ManifestoSection } from "../components/home/manifesto-section";
import { Footer } from "../components/footer";

const MindflareBrandBanner = dynamic(
  () => import("../components/home/mindflare-brand-banner").then((m) => m.MindflareBrandBanner),
  { ssr: true }
);

export default function Home() {
  return (
    <div className="relative min-h-screen bg-transparent text-foreground selection:bg-[#FF1018]/30 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* 1. Elite AMOLED Hero Section */}
        <HeroElite />

        {/* 2. Hardware-accelerated Tech & Contest Marquee */}
        <TechMarquee />

        {/* 3. The Interactive Algorithmic Bento Section (Live Playable Simulators) */}
        <div style={{ contentVisibility: "auto", containIntrinsicSize: "0 900px" }}>
          <InteractiveBentoSection />
        </div>

        {/* 4. Minimalist Philosophy & Manifesto */}
        <div style={{ contentVisibility: "auto", containIntrinsicSize: "0 650px" }}>
          <ManifestoSection />
        </div>

        {/* 5. Animated Brand Mark with StrokeText */}
        <MindflareBrandBanner />
      </main>

      <Footer />
    </div>
  );
}
