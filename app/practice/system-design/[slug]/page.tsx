import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPracticeProblemBySlug } from '@/lib/practice-problems';
import { ProblemWorkspace } from '@/components/practice/problem-workspace';
import { SYSTEM_DESIGN_PROBLEMS } from '@/lib/system-design-problems';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const problem = getPracticeProblemBySlug(slug) || SYSTEM_DESIGN_PROBLEMS[0];

  return {
    title: `${problem.title} | System Design Practice`,
    description: problem.description,
  };
}

export async function generateStaticParams() {
  return SYSTEM_DESIGN_PROBLEMS.map((p) => ({
    slug: p.slug,
  }));
}

export default async function SystemDesignProblemPage({ params }: PageProps) {
  const { slug } = await params;
  const problem = getPracticeProblemBySlug(slug);

  if (!problem) {
    notFound();
  }

  return <ProblemWorkspace problem={problem} listParam="system-design" />;
}
