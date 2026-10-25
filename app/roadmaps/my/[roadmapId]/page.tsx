import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { MemberRoadmapDetail } from "@/components/roadmaps/member-roadmap-detail";

export const metadata: Metadata = { title: "Your Roadmap | Mindflare Arena" };
type PageProps = { params: Promise<{ roadmapId: string }> };

export default async function MemberRoadmapPage({ params }: PageProps) {
  const { roadmapId } = await params;
  return <div className="min-h-screen bg-background text-foreground"><Navbar /><MemberRoadmapDetail roadmapId={roadmapId} /><Footer /></div>;
}
