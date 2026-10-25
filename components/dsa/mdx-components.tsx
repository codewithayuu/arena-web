import React from "react";
import Link from "next/link";
import { LessonHeader } from "./lesson-header";
import { LessonCard } from "./lesson-card";
import { DsaMindmap } from "./dsa-mindmap";
import { PatternsSheetCard } from "./patterns-sheet-card";
import { CompanyProblemsCard } from "./company-problems-card";
import { FeatureGrid, FeatureCard } from "./feature-card";
import { VideoPreviewCard } from "./video-preview-card";
import { LearningSteps } from "./learning-steps";
import { AuthorCard } from "./author-card";
import { InteractiveAnimation } from "./interactive-animation";
import { CodeCompiler } from "./code-compiler";
import { QuizCard } from "./quiz-card";
import { CommentsSection } from "./comments-section";
import { CourseRoadmapView } from "./course-roadmap-view";
import { CommunityView } from "./community-view";
import { DsaCodeBlock } from "./dsa-code-block";
import { ComplexityCard } from "./complexity-card";
import { IntroCard } from "./intro-card";
import { BigOSimulation } from "@/components/animations/dsa/big-o-simulation";

// Helper to create valid HTML id from heading children
function slugifyHeading(children: React.ReactNode): string {
  return extractTextNode(children)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Helper to extract raw text content from React node tree
function extractTextNode(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractTextNode).join(" ");
  if (React.isValidElement(node) && (node.props as any)?.children) {
    return extractTextNode((node.props as any).children);
  }
  return "";
}

export const dsaMdxComponents = {
  // Built-in HTML element replacements
  h1: ({
    children,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id || slugifyHeading(children);
    return (
      <h1
        id={headingId || undefined}
        className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4 mt-8 pt-4 border-t border-border first:mt-0 first:pt-0 first:border-0 scroll-mt-28"
        {...props}
      >
        {children}
      </h1>
    );
  },
  h2: ({
    children,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id || slugifyHeading(children);
    return (
      <h2
        id={headingId || undefined}
        className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3 mt-6 scroll-mt-28"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({
    children,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id || slugifyHeading(children);
    return (
      <h3
        id={headingId || undefined}
        className="text-lg font-bold text-foreground mb-2 mt-4 scroll-mt-28"
        {...props}
      >
        {children}
      </h3>
    );
  },
  p: ({
    children,
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={`text-sm sm:text-base text-foreground/90 leading-relaxed mb-4 ${className}`}
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({
    children,
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={`list-disc list-outside space-y-2 mb-4 text-foreground/90 text-sm sm:text-base pl-5 ${className}`}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({
    children,
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={`list-decimal list-outside space-y-2 mb-4 text-foreground/90 text-sm sm:text-base pl-5 ${className}`}
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({
    children,
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={`leading-relaxed ${className}`} {...props}>
      {children}
    </li>
  ),
  a: ({
    href = "",
    children,
    className = "",
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link
          href={href}
          className={`text-primary hover:underline font-semibold transition-colors ${className}`}
          {...props}
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-primary hover:underline font-semibold transition-colors ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  },
  blockquote: ({
    children,
    ...props
  }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => {
    const text = extractTextNode(children);
    if (text.includes("Time Complexity") || text.includes("Space Complexity")) {
      return <ComplexityCard>{children}</ComplexityCard>;
    }

    return (
      <blockquote
        className="my-4 border-l-4 border-primary pl-4 py-1 italic text-muted-foreground text-sm bg-muted/20 rounded-r-md"
        {...props}
      >
        {children}
      </blockquote>
    );
  },
  // Handle code blocks vs inline code
  pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => {
    if (React.isValidElement(children)) {
      const childProps = children.props as {
        className?: string;
        children?: string;
      };
      const className = childProps?.className || "";
      const match = /language-(\w+)/.exec(className);
      const language = match ? match[1] : "";
      const code =
        typeof childProps?.children === "string" ? childProps.children : "";
      return <DsaCodeBlock code={code} language={language} />;
    }
    return (
      <pre className="my-6 rounded-lg bg-[#0d1117] p-4 text-sm text-foreground overflow-x-auto">
        {children}
      </pre>
    );
  },
  code: ({
    children,
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {
    return (
      <code
        className={`rounded bg-[#14141f] px-1.5 py-0.5 font-mono text-xs sm:text-sm text-[#f4f3fc] border border-[#1e1e2e] font-medium ${className}`}
        {...props}
      >
        {children}
      </code>
    );
  },
  hr: () => <hr className="my-8 border-t border-border" />,

  // Table Components
  table: ({
    children,
    className = "",
    ...props
  }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-6">
      <div
        role="region"
        aria-label="Scrollable table. Swipe horizontally to view all columns."
        tabIndex={0}
        className="overflow-x-auto rounded-xl border border-border/80 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <table
          className={`min-w-full border-collapse text-left text-sm ${className}`}
          {...props}
        >
          {children}
        </table>
      </div>
      <p aria-hidden="true" className="mt-2 text-xs text-muted-foreground sm:hidden">
        Swipe horizontally to view more columns.
      </p>
    </div>
  ),
  thead: ({
    children,
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      className={`bg-muted text-foreground border-b border-border font-semibold ${className}`}
      {...props}
    >
      {children}
    </thead>
  ),
  tbody: ({
    children,
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody
      className={`divide-y divide-border bg-card text-card-foreground ${className}`}
      {...props}
    >
      {children}
    </tbody>
  ),
  tr: ({
    children,
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={`hover:bg-white/[0.03] transition-colors ${className}`}
      {...props}
    >
      {children}
    </tr>
  ),
  th: ({
    children,
    className = "",
    ...props
  }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={`px-3 sm:px-4 py-2.5 text-sm font-bold text-foreground border-r last:border-r-0 border-border/50 ${className}`}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({
    children,
    className = "",
    ...props
  }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={`px-3 sm:px-4 py-2.5 text-sm text-foreground/90 align-top border-r last:border-r-0 border-border/30 ${className}`}
      {...props}
    >
      {children}
    </td>
  ),

  // Custom Reusable Components
  LessonHeader,
  LessonCard,
  DsaMindmap,
  PatternsSheetCard,
  CompanyProblemsCard,
  FeatureGrid,
  FeatureCard,
  InteractiveAnimation,
  CodeCompiler,
  QuizCard,
  VideoPreviewCard,
  LearningSteps,
  AuthorCard,
  CommentsSection,
  CourseRoadmapView,
  CommunityView,
  DsaCodeBlock,
  CodeBlock: DsaCodeBlock,
  IntroCard,
  ComplexityCard,
  BigOSimulation,
};
