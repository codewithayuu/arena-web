import { Metadata } from "next";
import { ContestComingSoon } from "@/components/contest/ContestComingSoon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mindflare — Courses (Coming Soon)",
  description: "Comprehensive courses and structured computer science curriculum coming soon.",
};

export default function CoursesPage() {
  return <ContestComingSoon text="Coming soon" />;
}
