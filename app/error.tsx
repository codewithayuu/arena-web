"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, ArrowLeft, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FuzzyText } from "@/components/FuzzyText/FuzzyText";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log exception context safely for dev debugging
    console.error("Arena runtime exception:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen bg-transparent text-foreground flex flex-col selection:bg-[#FF1018]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 max-w-4xl mx-auto w-full">
        {/* Circuit Breaker Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#FF1018]/10 text-[#FF4D52] border border-[#FF1018]/25 mb-4 shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5 text-[#FF1018] animate-pulse" />
          <span>RUNTIME EXCEPTION // CIRCUIT BREAKER</span>
        </div>

        {/* Animated Fuzzy Error Display */}
        <div className="py-2 select-none flex items-center justify-center">
          <FuzzyText
            colorSplit={0}
            trigger="hover"
            direction="horizontal"
            baseIntensity={0.2}
            hoverIntensity={0.5}
            fuzzRange={30}
            sliceSize={1}
            fps={60}
            transitionDuration={0}
            intro={true}
            introDuration={1400}
            letterSpacing={0}
            enableHover={true}
            clickEffect={false}
            glitchMode={false}
            glitchInterval={2000}
            glitchDuration={200}
            color="#ffffff"
            fontSize="clamp(4.5rem, 14vw, 10rem)"
            fontWeight={900}
          >
            ERROR
          </FuzzyText>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          Something Went Wrong in the Arena
        </h1>

        <p className="text-zinc-400 max-w-lg mx-auto mb-10 text-sm sm:text-base leading-relaxed">
          The application encountered an unexpected runtime failure while processing this view. 
          Your drafts and local progress remain preserved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 w-full max-w-md">
          <button
            type="button"
            onClick={() => reset()}
            className="group flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FF1018] hover:bg-[#E00C14] text-white font-medium text-sm shadow-lg shadow-[#FF1018]/25 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 hover:text-white font-medium text-sm backdrop-blur-md transition-all duration-200 active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
            <span>Arena Home</span>
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs font-mono text-zinc-600">
            Reference code: {error.digest}
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
