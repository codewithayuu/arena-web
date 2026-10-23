import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function PatternsSheetCard() {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-xl border border-border bg-muted/10 space-y-4">
      <h2
        id="dsa-patterns-sheet"
        className="text-xl sm:text-2xl font-bold tracking-tight text-primary scroll-mt-28"
      >
        <Link
          href="/practice/dsa-patterns"
          className="hover:underline flex items-center gap-2"
        >
          <span>DSA Patterns Sheet</span>
          <ExternalLink className="h-4 w-4" />
        </Link>
      </h2>

      <p className="text-sm text-foreground/90 leading-relaxed">
        Practice coding interview problems organized by the patterns most
        commonly tested in interviews. Use the sheet to track your progress,
        identify weak areas, and strengthen pattern-recognition skills.
      </p>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Choose a practice roadmap based on your preparation timeline:
        </span>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
          <li className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center justify-between">
            <span className="font-bold text-foreground">Mindflare 75:</span>
            <span className="text-muted-foreground">Less than 1 month</span>
          </li>
          <li className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center justify-between">
            <span className="font-bold text-foreground">Mindflare 150:</span>
            <span className="text-muted-foreground">1–3 months</span>
          </li>
          <li className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center justify-between">
            <span className="font-bold text-foreground">Mindflare 300:</span>
            <span className="text-muted-foreground">3–6 months</span>
          </li>
          <li className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center justify-between">
            <span className="font-bold text-foreground">Mindflare 600:</span>
            <span className="text-muted-foreground">6+ months</span>
          </li>
        </ul>
      </div>

      <div className="pt-2 flex justify-start">
        <Link
          href="/practice/dsa-patterns"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span>Explore DSA Patterns Sheet</span>
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
