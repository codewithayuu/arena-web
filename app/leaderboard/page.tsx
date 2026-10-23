import type { Metadata } from "next";
import { LeaderboardView } from "@/components/topic-list/leaderboard-view";

export const metadata: Metadata = {
  title: "Aura Leaderboard | Mindflare",
  description: "Compare learner activity, completed topics and problems, and server-calculated Aura.",
};

export default function LeaderboardPage() {
  return <LeaderboardView />;
}
