import { Metadata } from "next";
import { ContestComingSoon } from "@/components/contest/ContestComingSoon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mindflare Arena — Coming Soon",
  description: "Official contest arena coming soon.",
};

export default function ExaminationEntry() {
  return <ContestComingSoon text="Coming soon" />;
}
