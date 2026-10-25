import { Metadata } from "next";
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mindflare — Courses (Coming Soon)",
  description: "Comprehensive courses and structured computer science curriculum coming soon.",
};

export default function CoursesPage() {
  return redirect("/coming-soon");
}
