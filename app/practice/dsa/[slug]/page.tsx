import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPracticeProblemBySlug,
  getAllPracticeProblems,
  PRACTICE_PROBLEMS,
} from "@/lib/practice-problems";
import { ProblemWorkspace } from "@/components/practice/problem-workspace";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    list?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const problem = getPracticeProblemBySlug(slug) || PRACTICE_PROBLEMS[0];

  return {
    title: `${problem.title} | mindflare.tech Practice`,
    description: problem.description,
  };
}

export async function generateStaticParams() {
  const problems = getAllPracticeProblems();
  return problems.map((p) => ({
    slug: p.slug,
  }));
}

export default async function PracticeProblemPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { list } = await searchParams;

  const problem = getPracticeProblemBySlug(slug);
  if (!problem) {
    notFound();
  }

  return <ProblemWorkspace problem={problem} listParam={list || "am-300"} />;
}
