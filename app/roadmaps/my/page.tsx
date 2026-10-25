import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { MemberRoadmaps } from "@/components/roadmaps/member-roadmaps";

export const metadata: Metadata = { title: "Saved Roadmaps | Mindflare Arena" };

export default function MyRoadmapsPage() {
  return <div className="min-h-screen bg-background text-foreground"><Navbar /><MemberRoadmaps /><Footer /></div>;
}
