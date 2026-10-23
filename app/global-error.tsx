"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { FuzzyText } from "@/components/FuzzyText/FuzzyText";
import "./styles.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global arena layout crash:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#08080a] text-white flex flex-col items-center justify-center text-center px-4 font-sans selection:bg-[#FF1018]/30 selection:text-white">
        <main className="flex flex-col items-center justify-center max-w-xl mx-auto py-12">
          {/* Circuit Breaker Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#FF1018]/10 text-[#FF4D52] border border-[#FF1018]/25 mb-4 shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF1018] animate-pulse" />
            <span>CRITICAL FAULT // GLOBAL CATCH</span>
          </div>

          {/* Animated Fuzzy 500 Display */}
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
              fontSize="clamp(5rem, 16vw, 10rem)"
              fontWeight={900}
            >
              500
            </FuzzyText>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            System Level Exception
          </h1>

          <p className="text-zinc-400 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            The application experienced a critical layout crash. You can reload the page or return to the main dashboard.
          </p>

          <div className="flex items-center justify-center gap-3 w-full">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FF1018] hover:bg-[#E00C14] text-white font-medium text-sm shadow-lg shadow-[#FF1018]/25 transition-all duration-200 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Arena</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 hover:text-white font-medium text-sm transition-all duration-200"
            >
              Home Hub
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
