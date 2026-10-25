"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { DsaSidebar } from "@/components/dsa/dsa-sidebar";
import { DsaToc } from "@/components/dsa/dsa-toc";
import { DsaMobileLearnNav } from "@/components/dsa/mobile-learn-nav";
import {
  DsaSidebarProvider,
  useDsaSidebar,
} from "@/components/dsa/dsa-sidebar-context";

function CourseLayoutContent({
  course,
  children,
}: {
  course: string;
  children: React.ReactNode;
}) {
  const { isCollapsed } = useDsaSidebar();

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
      {/* Top Banner & Navigation */}
      <Navbar />

      {/* Dynamic Collapsible Curriculum Sidebar for this specific course */}
      <DsaSidebar course={course} />

      {/* Main Layout aligned directly adjacent to sidebar */}
      <main
        className={`flex-1 w-full px-3 sm:px-4 lg:px-6 mt-20 sm:mt-24 transition-all duration-300 ease-in-out ${
          isCollapsed
            ? "md:ml-[78px] md:w-[calc(100%-78px)] desktop:ml-[78px] desktop:w-[calc(100%-78px)]"
            : "md:ml-[calc(min(290px,38vw)+20px)] md:w-[calc(100%-min(290px,38vw)-20px)] desktop:ml-[calc(min(290px,38vw)+20px)] desktop:w-[calc(100%-min(290px,38vw)-20px)]"
        }`}
      >
        <div className="flex items-start w-full transition-all duration-300 ease-in-out">
          {/* Main Content Area - centered within the reading viewport */}
          <div className="flex-1 min-w-0 flex justify-center px-2 sm:px-4 lg:px-6">
            <div
              className="w-full max-w-[880px] xl:max-w-[960px] mb-16 pb-20 transition-all duration-300 ease-in-out"
              data-focus-expand="true"
              data-content-area="true"
            >
              <DsaMobileLearnNav />
              {children}
            </div>
          </div>

          {/* Spacer Column in flow to reserve width for the fixed TOC and preserve middle centering */}
          <div className="hidden xl:block w-[260px] 2xl:w-[280px] shrink-0 pointer-events-none" aria-hidden="true" />
        </div>
      </main>

      {/* Right Rail Table of Contents - Fixed so it does not move with page scroll */}
      <aside className="hidden xl:block fixed top-24 bottom-14 right-3 sm:right-4 lg:right-6 2xl:right-8 w-[260px] 2xl:w-[280px] z-30 pointer-events-auto">
        <DsaToc />
      </aside>
    </div>
  );
}

export default function GenericCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const course = (params?.course as string) || "system-design";

  return (
    <DsaSidebarProvider>
      <CourseLayoutContent course={course}>{children}</CourseLayoutContent>
    </DsaSidebarProvider>
  );
}
