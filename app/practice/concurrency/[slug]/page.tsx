import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPracticeProblemBySlug } from '@/lib/practice-problems';
import { ProblemWorkspace } from '@/components/practice/problem-workspace';
import { CONCURRENCY_PROBLEMS } from '@/lib/concurrency-problems';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const problem = getPracticeProblemBySlug(slug) || CONCURRENCY_PROBLEMS[0];

  return {
    title: `${problem.title} | Concurrency Practice`,
    description: problem.description,
  };
}

export async function generateStaticParams() {
  return CONCURRENCY_PROBLEMS.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ConcurrencyProblemPage({ params }: PageProps) {
  const { slug } = await params;
  const problem = getPracticeProblemBySlug(slug);

  if (!problem) {
    notFound();
  }

  return <ProblemWorkspace problem={problem} listParam="concurrency" />;
}
