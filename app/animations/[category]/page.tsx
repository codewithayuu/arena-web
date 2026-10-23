import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContestComingSoon } from "@/components/contest/ContestComingSoon";

const UPCOMING_CATEGORIES: Record<string, { title: string; description: string }> = {
  "system-design": {
    title: "System Design",
    description: "Visual walkthroughs for distributed systems, caches, databases, and service architecture.",
  },
  sql: {
    title: "SQL & Databases",
    description: "Interactive explanations of query plans, indexes, joins, and transaction behavior.",
  },
  concurrency: {
    title: "Concurrency & OS",
    description: "Step through synchronization, scheduling, memory, and concurrent programming concepts.",
  },
  "ai-ml": {
    title: "AI & Machine Learning",
    description: "Visual explorations of neural networks, attention, transformers, and model training.",
  },
};

type PageProps = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return Object.keys(UPCOMING_CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const content = UPCOMING_CATEGORIES[category];
  if (!content) return { title: "Animation collection not found | Mindflare" };
  return {
    title: `${content.title} Animations Coming Soon | Mindflare`,
    description: content.description,
  };
}

export default async function AnimationComingSoonPage({ params }: PageProps) {
  const { category } = await params;
  const content = UPCOMING_CATEGORIES[category];
  if (!content) notFound();

  return <ContestComingSoon text="Coming soon" />;
}
