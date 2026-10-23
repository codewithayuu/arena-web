import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ALL_DSA_PROBLEMS,
  getProblemBySlug,
} from "@/lib/dsa-problems-data";
import { ProblemSimulationLoader } from "@/components/animations/problems/problem-simulation-loader";

interface ProblemPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProblemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);

  if (!problem) {
    return {
      title: "Problem Animation Not Found",
    };
  }

  return {
    title: `${problem.title} Animation | Mindflare Arena`,
    description: problem.description,
  };
}

export async function generateStaticParams() {
  return ALL_DSA_PROBLEMS.slice(0, 50).map((p) => ({
    slug: p.slug,
  }));
}

export default async function DsaProblemAnimationPage({
  params,
}: ProblemPageProps) {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);

  if (!problem) {
    notFound();
  }

  return (
    <ProblemSimulationLoader
      slug={slug}
      title={problem.title}
      category={problem.category}
      difficulty={problem.difficulty}
      description={problem.description}
    />
  );
}
