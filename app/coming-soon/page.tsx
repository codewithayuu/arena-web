import { Metadata } from "next";
import { ContestComingSoon } from "@/components/contest/ContestComingSoon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mindflare — Coming Soon",
  description: "This simulation library is currently under development. Coming soon.",
};

export default function ComingSoonPage() {
  return <ContestComingSoon text="Coming soon" />;
}
