"use client";

import { ChevronDown, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { DsaToc } from "@/components/dsa/dsa-toc";
import { useDsaSidebar } from "@/components/dsa/dsa-sidebar-context";

export function DsaMobileLearnNav() {
  const { mobileOpen, toggleMobileOpen } = useDsaSidebar();
  const pathname = usePathname();
  const isLessonPage = (pathname?.split("/").filter(Boolean).length ?? 0) >= 3;

  return (
    <div role="group" aria-label="Lesson navigation" className={`mb-5 grid gap-2 md:hidden desktop:hidden ${isLessonPage ? "grid-cols-2" : "grid-cols-1"}`}>
      <button
        type="button"
        onClick={toggleMobileOpen}
        aria-controls="dsa-course-sidebar"
        aria-expanded={mobileOpen}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
        <span>Course menu</span>
      </button>

      {isLessonPage && <details className="group relative min-w-0">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
          <span>On this page</span>
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-72 overflow-hidden rounded-xl border border-border bg-background p-3 shadow-xl">
          <DsaToc compact />
        </div>
      </details>}
    </div>
  );
}
