import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DsaPatternsView } from "@/components/practice/dsa-patterns-view";

export const metadata: Metadata = {
  title: "Master DSA Patterns | Mindflare Arena",
  description:
    "Practice coding interview problems organized by the patterns most commonly tested in interviews at top tech companies.",
};

export default function DsaPatternsPage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20">
        <DsaPatternsView />
      </div>
      <Footer />
    </div>
  );
}
