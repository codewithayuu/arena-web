import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Aura Leaderboard | Mindflare",
  description: "Compare learner activity, completed topics and problems, and server-calculated Aura.",
};

export default function LeaderboardPage() {
  return redirect('/coming-soon');
}
