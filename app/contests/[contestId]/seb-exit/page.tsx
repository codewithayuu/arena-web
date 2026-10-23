import { Metadata } from "next";
import { ContestComingSoon } from "@/components/contest/ContestComingSoon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mindflare Arena — Coming Soon",
};

export default function ExaminationExit() {
  return <ContestComingSoon text="Coming soon" />;
}
