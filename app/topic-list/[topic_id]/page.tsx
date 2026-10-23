import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  getTopicById,
  getProblemsByTopicId,
  ALL_TOPICS,
  getTopicDifficultyColor,
  getTopicDifficultyTitle,
} from "@/lib/topic-list-data";
import { TopicDetailView } from "@/components/topic-list/topic-detail-view";

interface PageProps {
  params: Promise<{
    topic_id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { topic_id } = await params;
  const topic = getTopicById(topic_id);

  if (topic) {
    return {
      title: `${topic.topic_title} — Topic List | Mindflare`,
      description:
        topic.topic_desc ||
        `Master ${topic.topic_title} with curated practice problems, tutorials, and competitive programming resources on Mindflare.`,
    };
  }

  return {
    title: "Topic Details | Mindflare",
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return ALL_TOPICS.slice(0, 50).map((t) => ({
    topic_id: t.topic_id,
  }));
}

export default async function TopicDetailPage({ params }: PageProps) {
  const { topic_id } = await params;
  const topic = getTopicById(topic_id);

  if (!topic) {
    notFound();
  }

  const problems = getProblemsByTopicId(topic_id);

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 sm:pt-28">
        <TopicDetailView topic={topic} initialProblems={problems} />
      </div>
      <Footer />
    </div>
  );
}
