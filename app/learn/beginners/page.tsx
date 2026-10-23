import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BeginnersView } from "@/components/beginners/beginners-view";
import {
  getBeginnersStats,
  getTracksOverview,
  getAllPOTDProblems,
  getSystemDesignQuestions,
  getAIConcepts,
  getCompaniesOverview,
} from "@/lib/beginners-server";

export const metadata: Metadata = {
  title: "Beginners Learning Hub | Mindflare Arena",
  description:
    "Structured video curriculum across DSA, System Design, AI and SQL, daily POTD tracker, architectural case studies, and company-wise interview problem sheets.",
};

export default function BeginnersPage() {
  const stats = getBeginnersStats();
  const tracks = getTracksOverview();
  const { problems: initialPOTD } = getAllPOTDProblems();
  const systemDesignQuestions = getSystemDesignQuestions();
  const aiConcepts = getAIConcepts();
  const companies = getCompaniesOverview();

  return (
    <div className="relative min-h-screen bg-transparent text-foreground flex flex-col selection:bg-[#FF1018]/30 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <BeginnersView
          stats={stats}
          tracks={tracks}
          initialPOTD={initialPOTD.slice(0, 50)}
          systemDesignQuestions={systemDesignQuestions}
          aiConcepts={aiConcepts}
          companies={companies}
        />
      </main>
      <Footer />
    </div>
  );
}
