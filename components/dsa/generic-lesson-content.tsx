"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Sparkles,
  Play,
  FileCode2,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { DsaLesson, getAdjacentLessons } from "@/lib/dsa-curriculum";

interface GenericLessonContentProps {
  lesson: DsaLesson;
  moduleTitle: string;
  bookMode?: boolean;
}

export function GenericLessonContent({
  lesson,
  moduleTitle,
  bookMode = false,
}: GenericLessonContentProps) {
  const { prev, next } = getAdjacentLessons(lesson.slug);

  return (
    <article className={`w-full mx-auto ${bookMode ? "max-w-4xl rounded-2xl border border-zinc-800 bg-[#070709] px-5 py-8 shadow-2xl sm:px-10" : ""}`}>
      {/* Breadcrumbs */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/learn/dsa/course-introduction"
          className="hover:text-foreground"
        >
          DSA
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate max-w-[150px]">{moduleTitle}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {lesson.title}
        </span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
            {moduleTitle}
          </span>
          {lesson.isFree && (
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-500/10 text-cyan-400 border border-red-500/20">
              Free Lesson
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          {lesson.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>10 min read & practice</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <FileCode2 className="h-3.5 w-3.5" />
            <span>Interactive Playground</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <div className="rounded-xl border border-border/80 text-card-foreground shadow-sm p-6 sm:p-8 bg-card space-y-6">
        <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Lesson Overview
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">
              Mindflare Curriculum
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Welcome to{" "}
            <strong className="text-foreground font-semibold">
              {lesson.title}
            </strong>
            , part of the{" "}
            <strong className="text-foreground font-semibold">
              {moduleTitle}
            </strong>{" "}
            module. Here you will learn the core pattern, understand
            step-by-step visualizations, and practice solving variations.
          </p>
        </div>

        {/* Practice & Visualizer Area */}
        <div className="rounded-xl border border-border bg-zinc-950 p-6 text-zinc-100 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-mono text-zinc-400">
              Interactive Practice Playground
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-cyan-400 font-mono">
                Ready
              </span>
            </div>
          </div>

          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Play className="h-6 w-6 ml-0.5 fill-current" />
            </div>
            <h4 className="text-base font-bold text-white">
              {lesson.title} Visualization & Sandbox
            </h4>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Follow along with interactive animations, step through test
              inputs, and compile your solution.
            </p>
          </div>
        </div>

        {/* Navigation to Prev / Next */}
        <div className="pt-6 border-t border-border flex items-center justify-between gap-4 flex-wrap">
          {prev ? (
            <Link
              href={prev.href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors"
            >
              <span>← Previous: {prev.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={next.href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm ml-auto"
            >
              <span>Next: {next.title} →</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </article>
  );
}
