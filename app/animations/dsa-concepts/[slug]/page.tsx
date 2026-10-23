import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SimulationViewerShell } from "@/components/animations/simulation-viewer-shell";
import {
  ALL_ANIMATIONS,
  getAnimationBySlug,
  getAnimationSection,
} from "@/lib/dsa-animations-data";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const card = getAnimationBySlug(slug);
  const section = getAnimationSection(slug);

  if (card) {
    return {
      title: `${card.title} Animation | mindflare.tech`,
      description: `Interactive step-by-step visual simulation of ${card.title} (${section?.category || "DSA Concepts"}).`,
    };
  }

  return {
    title: "DSA Concept Animation | mindflare.tech",
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return ALL_ANIMATIONS.slice(0, 40).map((a) => ({
    slug: a.slug,
  }));
}

export default async function AnimationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const card = getAnimationBySlug(slug);

  if (!card) {
    notFound();
  }

  return <SimulationViewerShell slug={slug} />;
}
