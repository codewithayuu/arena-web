import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CompanyProblemsCard() {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-xl border border-border bg-muted/10 space-y-3">
      <h2
        id="company-wise-problems"
        className="text-xl sm:text-2xl font-bold tracking-tight text-foreground scroll-mt-28"
      >
        Company-Wise Problems
      </h2>
      <p className="text-sm text-foreground/90 leading-relaxed">
        Target problems commonly asked by specific tech companies including
        Google, Amazon, Meta, Microsoft, Apple, Netflix, and Uber. Practice
        questions filtered by recency and interview frequency.
      </p>
      <div className="pt-2">
        <Link
          href="/practice/company"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted font-medium text-xs sm:text-sm transition-colors text-foreground"
        >
          <span>Explore Company-Wise Problems</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
