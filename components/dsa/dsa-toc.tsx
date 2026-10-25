"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
  ProgressTrack,
  ProgressIndicator,
} from "@/components/animate-ui/progress";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

const DEFAULT_TOCS: Record<string, TocItem[]> = {
  "course-introduction": [
    { id: "additional-resources", title: "Additional Resources", level: 1 },
    {
      id: "dsa-patterns-sheet",
      title: "DSA Patterns Sheet",
      level: 2,
    },
    { id: "company-wise-problems", title: "Company-Wise Problems", level: 2 },
    {
      id: "what-s-inside-this-course",
      title: "What's Inside This Course",
      level: 1,
    },
    {
      id: "1-a-structured-roadmap",
      title: "1. A Structured Roadmap",
      level: 2,
    },
    {
      id: "2-600-interactive-animations",
      title: "2. 600+ Interactive Animations",
      level: 2,
    },
    { id: "3-in-built-compiler", title: "3. In-built Compiler", level: 2 },
    { id: "4-chapter-quizzes", title: "4. Chapter Quizzes", level: 2 },
    {
      id: "5-expanding-video-library",
      title: "5. Expanding Video Library",
      level: 2,
    },
    {
      id: "how-to-get-the-most-from-this-course",
      title: "How to Get the Most From This Course",
      level: 1,
    },
  ],
  "course-roadmap": [
    {
      id: "recommended-study-approach",
      title: "Recommended Study Approach",
      level: 1,
    },
    { id: "dsa-patterns-sheet-free-", title: "DSA Patterns Sheet", level: 2 },
  ],
  "join-community": [
    { id: "discord-community", title: "Discord Community", level: 1 },
    { id: "Mindflare-newsletter", title: "Newsletter", level: 1 },
    { id: "more-ways-to-engage", title: "More Ways to Engage", level: 1 },
  ],
};

export function DsaToc({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const slug = pathname?.split("/").pop() || "";
  const [tocItems, setTocItems] = useState<TocItem[]>(DEFAULT_TOCS[slug] || []);
  const [activeId, setActiveId] = useState<string>("");
  const [readingProgress, setReadingProgress] = useState(0);

  // Dynamically discover headings in the article or use defaults
  useEffect(() => {
    const discoverHeadings = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const elements = article.querySelectorAll("h1[id], h2[id]");
      if (elements.length > 0) {
        const found: TocItem[] = [];
        elements.forEach((el) => {
          const id = el.id;
          const title = (el.textContent || "").replace(/^#\s*/, "").trim();
          if (id && title && id !== "lesson-header") {
            const level = el.tagName.toLowerCase() === "h1" ? 1 : 2;
            found.push({ id, title, level });
          }
        });
        if (found.length > 0) {
          setTocItems(found);
          setActiveId((prev) => (!prev && found[0] ? found[0].id : prev));
          return;
        }
      }

      // Fallback to predefined TOC
      if (DEFAULT_TOCS[slug]) {
        setTocItems(DEFAULT_TOCS[slug]);
        setActiveId((prev) =>
          !prev && DEFAULT_TOCS[slug]?.[0] ? DEFAULT_TOCS[slug][0].id : prev,
        );
      }
    };

    // Small delay to ensure MDX content is mounted in DOM
    const timer = setTimeout(discoverHeadings, 150);
    return () => clearTimeout(timer);
  }, [pathname, slug]);

  // Scroll spy & reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0 && !compact) {
        const currentProgress = Math.min(
          100,
          Math.max(0, Math.round((window.scrollY / totalScroll) * 100)),
        );
        setReadingProgress(currentProgress);
      }

      const scrollPosition = window.scrollY + 130;
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const item = tocItems[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveId(item.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems, compact]);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      if (compact) e.currentTarget.closest("details")?.removeAttribute("open");
      setActiveId(id);
    }
  };

  return (
    <div
      className={compact ? "w-full" : "w-full h-full"}
      data-focus-hideable={compact ? undefined : "true"}
      data-right-sidebar={compact ? undefined : "true"}
    >
      <div className={compact ? "max-h-60 overflow-y-auto custom-scrollbar" : "h-full max-h-[calc(100vh-8.5rem)] custom-scrollbar overflow-y-auto py-2"}>
        {/* TOC Navigation */}
        <div className="w-full">
          <nav aria-label="Page sections" className={compact ? "py-2 pl-3" : "pl-2 2xl:pl-4 py-2"}>
            {/* Reading Progress */}
            {!compact && (
              <div className="mb-4 pr-4">
                <Progress value={readingProgress} className="w-full">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-medium">
                    <ProgressLabel className="text-xs font-medium text-muted-foreground">
                      Reading Progress
                    </ProgressLabel>
                    <div className="flex items-center tabular-nums font-mono text-xs">
                      <ProgressValue transition={{ stiffness: 80, damping: 20 }} />
                      <span>%</span>
                    </div>
                  </div>
                  <ProgressTrack className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <ProgressIndicator className="bg-gradient-to-r from-black via-red-500 to-black h-full rounded-full shadow-[0_0_12px_rgba(239,68,68,0.35)]" />
                  </ProgressTrack>
                </Progress>
              </div>
            )}

            {tocItems.length > 0 && (
              <>
                {!compact && (
                  <h2 className="text-xs font-bold text-muted-foreground mb-2.5">
                    On this page
                  </h2>
                )}

                <ul className={compact ? "space-y-1 text-sm" : "space-y-1 text-xs"}>
                  {tocItems.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <li
                        key={item.id}
                        className={`relative transition-colors ${
                          item.level === 2 ? "ml-3" : "font-medium"
                        } ${
                          isActive
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-3.5 bg-primary rounded-full" />
                        )}
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => scrollToSection(e, item.id)}
                          className={compact ? "block min-h-11 py-2 leading-snug transition-colors" : "block py-1 leading-snug transition-colors"}
                        >
                          {item.title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
            {compact && tocItems.length === 0 && (
              <p className="px-1 py-2 text-sm text-muted-foreground">No section headings on this page.</p>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
