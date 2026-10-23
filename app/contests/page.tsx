import { Metadata } from "next";
import { ContestComingSoon } from "@/components/contest/ContestComingSoon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mindflare Arena — Coming Soon",
  description: "Official competitive programming rounds coming soon.",
};

export default function ContestDirectory() {
  return <ContestComingSoon text="Coming soon" />;
}
