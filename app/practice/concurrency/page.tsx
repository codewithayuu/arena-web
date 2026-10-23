import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ConcurrencyView } from "@/components/practice/concurrency-view";

export const metadata: Metadata = {
  title: "Concurrency Practice | mindflare.tech",
  description:
    "Practice multi-threading, semaphores, synchronization barriers, and concurrency interview problems with an interactive code editor.",
};

export default function ConcurrencyPracticePage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1">
        <ConcurrencyView />
      </div>
      <Footer />
    </div>
  );
}
