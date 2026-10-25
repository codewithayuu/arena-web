"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  CalendarDays,
  ExternalLink,
  BookOpen,
  Code2,
  Video,
  Layers,
  Sparkles,
  ArrowRight,
  Play,
  Maximize2,
} from "lucide-react";
import { InteractiveAnimation } from "./interactive-animation";
import { CodeCompiler } from "./code-compiler";
import { QuizCard } from "./quiz-card";
import { CommentsSection } from "./comments-section";

export function CourseIntroContent() {
  return (
    <article className="w-full mx-auto px-2 sm:px-4 lg:px-0">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          Course Introduction
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>5 min read</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Updated September 25, 2026</span>
          </span>
        </div>
      </header>

      {/* Main Card Content */}
      <div className="rounded-lg border border-border/80 text-card-foreground shadow-sm p-5 sm:p-6 bg-background">
        {/* Intro Lead */}
        <p className="text-base sm:text-lg text-foreground/90 leading-[1.75] mb-4">
          Welcome to an interactive course designed to help you master{" "}
          <strong className="font-bold text-foreground">
            Data Structures and Algorithms
          </strong>{" "}
          from scratch.
        </p>

        {/* DSA Mindmap SVG Banner */}
        <div className="mt-6 overflow-hidden">
          <Image
            src="/images/dsa-mindmap.svg"
            alt="Data Structures and Algorithms Mindmap"
            width={1280}
            height={720}
            className="w-full h-auto"
            priority
          />
        </div>
        <div
          className="mt-2 mb-6 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground"
          aria-hidden="true"
        >
          <Maximize2 className="h-3 w-3" />
          <span>Fullscreen</span>
        </div>

        <p className="text-sm sm:text-base text-foreground/90 leading-relaxed mb-8">
          This course covers the fundamental concepts, problem-solving patterns,
          and interview problems you need to succeed in technical coding
          interviews at top tech companies.
        </p>

        {/* SECTION: Additional Resources */}
        <div className="my-8 pt-6 border-t border-border">
          <h1
            id="additional-resources"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4 scroll-mt-28"
          >
            Additional Resources
          </h1>
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-6">
            We also provide dedicated resources to help you practice curated
            problems by pattern, prepare for company-specific interviews, and
            simulate realistic coding interviews with AI-powered feedback.
          </p>

          {/* DSA Patterns Sheet */}
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
              commonly tested in interviews. Use the sheet to track your
              progress, identify weak areas, and strengthen pattern-recognition
              skills.
            </p>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Choose a practice roadmap based on your preparation timeline:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                <li className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    Mindflare 75:
                  </span>
                  <span className="text-muted-foreground">
                    Less than 1 month
                  </span>
                </li>
                <li className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    Mindflare 150:
                  </span>
                  <span className="text-muted-foreground">1–3 months</span>
                </li>
                <li className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    Mindflare 300:
                  </span>
                  <span className="text-muted-foreground">3–6 months</span>
                </li>
                <li className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    Mindflare 600:
                  </span>
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

          {/* Company-Wise Problems */}
          <div className="my-6 p-5 sm:p-6 rounded-xl border border-border bg-muted/10 space-y-3">
            <h2
              id="company-wise-problems"
              className="text-xl sm:text-2xl font-bold tracking-tight text-foreground scroll-mt-28"
            >
              Company-Wise Problems
            </h2>
            <p className="text-sm text-foreground/90 leading-relaxed">
              Target problems commonly asked by specific tech companies
              including Google, Amazon, Meta, Microsoft, Apple, Netflix, and
              Uber. Practice questions filtered by recency and interview
              frequency.
            </p>
            <div className="pt-2">
              <Link
                href="/practice/dsa-patterns"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted font-medium text-xs sm:text-sm transition-colors text-foreground"
              >
                <span>Explore Company-Wise Problems</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* SECTION: What's Inside This Course */}
        <div className="my-8 pt-6 border-t border-border">
          <h1
            id="what-s-inside-this-course"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4 scroll-mt-28"
          >
            What&apos;s Inside This Course
          </h1>

          {/* 1. A Structured Roadmap */}
          <div className="my-6 space-y-4">
            <h2
              id="1-a-structured-roadmap"
              className="text-xl sm:text-2xl font-bold tracking-tight text-foreground scroll-mt-28"
            >
              1. A Structured Roadmap
            </h2>
            <p className="text-sm text-foreground/90 leading-relaxed">
              A carefully sequenced learning path covering everything from basic
              arrays and strings up through advanced graphs, dynamic
              programming, and system design patterns.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Layers className="h-4 w-4" />
                  <h3 id="75-problem-solving-patterns">
                    75+ Problem-Solving Patterns
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Master two pointers, sliding window, prefix sums, binary
                  search variants, monotonic stack, tree traversals, and dynamic
                  programming state transitions.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Code2 className="h-4 w-4" />
                  <h3 id="600-interview-problems">600+ Interview Problems</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Carefully selected interview problems from LeetCode,
                  HackerRank, and top tech interview rounds with detailed
                  step-by-step visual solutions.
                </p>
              </div>
            </div>
          </div>

          {/* 2. 600+ Interactive Animations */}
          <div className="my-10 space-y-4">
            <h2
              id="2-600-interactive-animations"
              className="text-xl sm:text-2xl font-bold tracking-tight text-foreground scroll-mt-28"
            >
              2. 600+ Interactive Animations
            </h2>
            <p className="text-sm text-foreground/90 leading-relaxed">
              Instead of static diagrams or walls of text, see how pointers
              move, arrays update, and trees transform step-by-step.
            </p>

            <div>
              <h3
                id="example-move-zeroes"
                className="text-lg font-bold text-foreground mb-1 scroll-mt-28"
              >
                Example : Move Zeroes
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Given an integer array{" "}
                <code className="text-primary font-mono">nums</code>, move all
                0&apos;s to the end of it while maintaining the relative order
                of the non-zero elements.
              </p>

              {/* The Interactive Move Zeroes Animation Player */}
              <InteractiveAnimation />
            </div>
          </div>

          {/* 3. In-built Compiler */}
          <div className="my-10 space-y-4">
            <h2
              id="3-in-built-compiler"
              className="text-xl sm:text-2xl font-bold tracking-tight text-foreground scroll-mt-28"
            >
              3. In-built Compiler
            </h2>
            <p className="text-sm text-foreground/90 leading-relaxed">
              Write, compile, run, and test code right inside each lesson.
              Choose your preferred language, run test cases, and get immediate
              feedback.
            </p>

            <div>
              <h3
                id="example-trapping-rain-water"
                className="text-lg font-bold text-foreground mb-1 scroll-mt-28"
              >
                Example: Trapping Rain Water
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Solve one of the most famous hard interview problems directly in
                the browser.
              </p>

              {/* The In-built Trapping Rain Water Compiler */}
              <CodeCompiler />
            </div>
          </div>

          {/* 4. Chapter Quizzes */}
          <div className="my-10 space-y-4">
            <h2
              id="4-chapter-quizzes"
              className="text-xl sm:text-2xl font-bold tracking-tight text-foreground scroll-mt-28"
            >
              4. Chapter Quizzes
            </h2>
            <p className="text-sm text-foreground/90 leading-relaxed">
              Test your understanding of time and space complexities, edge
              cases, and pattern recognition with instant interactive quizzes.
            </p>

            <QuizCard />
          </div>

          {/* 5. Expanding Video Library */}
          <div className="my-10 space-y-4">
            <h2
              id="5-expanding-video-library"
              className="text-xl sm:text-2xl font-bold tracking-tight text-foreground scroll-mt-28"
            >
              5. Expanding Video Library
            </h2>
            <p className="text-sm text-foreground/90 leading-relaxed">
              The course also includes a growing library of video lessons
              covering complex algorithms, interview breakdowns, and code
              walkthroughs.
            </p>

            {/* Video preview card */}
            <div className="relative rounded-xl border border-border bg-zinc-950 overflow-hidden shadow-lg group cursor-pointer aspect-video max-w-2xl mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 flex flex-col items-center gap-3 text-center p-4">
                <div className="w-16 h-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <Play className="h-7 w-7 ml-1 fill-current" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    Video Explanation: Two Pointers & Sliding Window Masterclass
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1">
                    Duration: 18 mins · 1080p Full HD
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: How to Get the Most From This Course */}
        <div className="my-10 pt-6 border-t border-border space-y-4">
          <h1
            id="how-to-get-the-most-from-this-course"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4 scroll-mt-28"
          >
            How to Get the Most From This Course
          </h1>

          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
            Whether you are learning DSA for the first time, returning after a
            long break, or preparing for upcoming coding interviews, this course
            gives you a structured and practical path forward.
          </p>

          <p className="text-sm font-semibold text-foreground">
            For every topic, follow this 7-step learning process:
          </p>

          <ol className="space-y-2.5 text-xs sm:text-sm text-foreground/90 list-decimal list-inside pl-2">
            <li className="leading-relaxed">
              <strong className="text-foreground">
                Learn the underlying concept
              </strong>{" "}
              thoroughly before jumping into code.
            </li>
            <li className="leading-relaxed">
              <strong className="text-foreground">Take the chapter quiz</strong>{" "}
              to verify comprehension.
            </li>
            <li className="leading-relaxed">
              <strong className="text-foreground">
                Study the common problem-solving patterns
              </strong>{" "}
              and recognizing clues.
            </li>
            <li className="leading-relaxed">
              <strong className="text-foreground">
                Solve a few problems without looking at the solution
              </strong>{" "}
              first.
            </li>
            <li className="leading-relaxed">
              <strong className="text-foreground">Compare your approach</strong>{" "}
              with the optimized visual solution.
            </li>
            <li className="leading-relaxed">
              <strong className="text-foreground">
                Review the time and space complexity
              </strong>{" "}
              trade-offs.
            </li>
            <li className="leading-relaxed">
              <strong className="text-foreground">
                Revisit difficult problems
              </strong>{" "}
              during periodic spaced repetition revision.
            </li>
          </ol>
        </div>

        {/* Comments Section */}
        <CommentsSection />
      </div>
    </article>
  );
}
