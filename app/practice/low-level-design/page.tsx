import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LowLevelDesignView } from "@/components/practice/low-level-design-view";

export const metadata: Metadata = {
  title: "Low-Level Design Practice | mindflare.tech",
  description:
    "Practice Object-Oriented Design (OOD), design patterns, cache architectures, and LLD interview problems with an interactive code editor.",
};

export default function LowLevelDesignPracticePage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1">
        <LowLevelDesignView />
      </div>
      <Footer />
    </div>
  );
}
