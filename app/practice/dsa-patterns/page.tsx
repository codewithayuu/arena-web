import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 border-b border-white/10 px-4 py-5 text-white sm:flex-row sm:items-center sm:px-6">
          <div><h2 className="text-base font-semibold">Practice contest</h2><p className="mt-1 text-sm text-zinc-400">Build a timed problem set.</p></div>
          <Link href="/practice/contest-builder" className="inline-flex items-center gap-2 self-start border border-white/20 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/40 sm:self-auto">Build a set <ArrowRight size={15} /></Link>
        </div>
        <DsaPatternsView />
      </div>
      <Footer />
    </div>
  );
}
