import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PersonalizedRoadmapBuilder } from "@/components/roadmaps/personalized-roadmap-builder";

export const metadata: Metadata = {
  title: "Build a Personalized Roadmap | Mindflare Arena",
  description: "Create a learning plan around your goals and available time.",
};

export default function CreateRoadmapPage() {
  return <div className="min-h-screen bg-[#08080a] text-white"><Navbar /><PersonalizedRoadmapBuilder /><Footer /></div>;
}
