import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PracticeContestSession } from "@/components/practice/practice-contest-session";

export const metadata: Metadata = { title: "Practice Session | Mindflare Arena" };
type PageProps = { params: Promise<{ sessionId: string }> };

export default async function PracticeContestSessionPage({ params }: PageProps) {
  const { sessionId } = await params;
  return <div className="min-h-screen bg-[#08080a] text-white"><Navbar /><PracticeContestSession sessionId={sessionId} /><Footer /></div>;
}
