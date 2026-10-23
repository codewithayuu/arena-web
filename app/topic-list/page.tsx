import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TopicListView } from "@/components/topic-list/topic-list-view";

export const metadata: Metadata = {
  title: "The God List | Mindflare",
  description:
    "A comprehensive list of competitive programming topics, tutorials, and problems curated across all difficulty levels.",
};

export default function TopicListPage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 sm:pt-28">
        <TopicListView />
      </div>
      <Footer />
    </div>
  );
}
