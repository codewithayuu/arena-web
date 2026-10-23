import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SystemDesignView } from "@/components/practice/system-design-view";

export const metadata: Metadata = {
  title: "System Design Practice | mindflare.tech",
  description:
    "Practice core system design calculations, Little's Law, Amdahl's Law, Availability, Consistent Hashing, and Rate Limiting with an interactive code editor.",
};

export default function SystemDesignPracticePage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1">
        <SystemDesignView />
      </div>
      <Footer />
    </div>
  );
}
