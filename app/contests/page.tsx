import type { Metadata } from "next";
import { ContestComingSoon } from "@/components/contest/ContestComingSoon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mindflare Arena — Contests Coming Soon",
  description: "Mindflare Arena contests are coming soon.",
};

export default function ContestsPage() {
  return <ContestComingSoon text="Coming soon" />;
}
