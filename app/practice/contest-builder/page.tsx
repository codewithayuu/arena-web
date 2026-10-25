import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PracticeContestBuilder } from "@/components/practice/practice-contest-builder";

export const metadata: Metadata = {
  title: "Practice Contest Builder | Mindflare Arena",
  description: "Create a personal, timed set from Mindflare's practice catalog.",
};

export default function PracticeContestBuilderPage() {
  return <div className="min-h-screen bg-[#08080a] text-white"><Navbar /><PracticeContestBuilder /><Footer /></div>;
}
