import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  ExternalLink,
  CircleCheck,
  Clock,
  ArrowRight,
  AnimateIcon,
} from "@/components/animate-ui/icons";
import { FileText } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Web Development & Competitive Programming Roadmaps | Mindflare",
  description:
    "Explore and download the Web Development Roadmap and Competitive Programming Syllabus in high-resolution PDF format with interactive practice tracks.",
};

interface Roadmap {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  badge: string;
  description: string;
  image: string;
  imageAlt: string;
  pdfUrl: string;
  fileName: string;
  practiceHref: string;
  practiceLabel: string;
  milestones: string[];
  keyTopics: string[];
}

const ROADMAPS: Roadmap[] = [
  {
    id: "web-development-roadmap",
    title: "Complete Web Developer Roadmap",
    subtitle:
      "A guided path from web fundamentals to building complete scalable applications",
    duration: "Self-paced",
    badge: "Web Development",
    description:
      "Follow the roadmap through the core technologies and practical skills used to design, build, and ship modern production web applications.",
    image: "/images/web-dev-roadmap.png",
    imageAlt: "The Complete Web Developer Roadmap cover",
    pdfUrl: "/roadmaps/Mindflare-Web-Developer-Roadmap.pdf",
    fileName: "Mindflare-Web-Developer-Roadmap.pdf",
    practiceHref: "/topic-list",
    practiceLabel: "Explore Learning Topics",
    milestones: [
      "Start with HTML, CSS, and the fundamental architecture of the web",
      "Build dynamic reactive interfaces with JavaScript and modern frontend tooling",
      "Connect applications to robust APIs, scalable servers, and relational databases",
      "Master cloud deployment, CI/CD pipelines, and production release workflows",
    ],
    keyTopics: [
      "HTML",
      "CSS",
      "JavaScript",
      "Frontend",
      "Backend",
      "Deployment",
    ],
  },
  {
    id: "competitive-programming-roadmap",
    title: "Competitive Programming Syllabus",
    subtitle:
      "A structured syllabus for algorithmic problem solving and high-stakes contest preparation",
    duration: "Self-paced",
    badge: "Competitive Programming",
    description:
      "Use the syllabus to build a rock-solid foundation in data structures, mathematical fundamentals, and algorithms, then progress toward solving national and global contest problems.",
    image: "/images/icpc-syllabus.png",
    imageAlt: "Competitive Programming Syllabus cover",
    pdfUrl: "/roadmaps/Competitive-Programming-Syllabus.pdf",
    fileName: "Competitive-Programming-Syllabus.pdf",
    practiceHref: "/practice/dsa-patterns",
    practiceLabel: "Practice DSA Patterns",
    milestones: [
      "Strengthen C++ STL, asymptotic complexity analysis, and mathematical foundations",
      "Master core linear & non-linear data structures, binary search, and number theory",
      "Develop deep problem-solving skills across graphs, trees, strings, and dynamic programming",
      "Apply mental models through regular timed contest practice and advanced heuristics",
    ],
    keyTopics: [
      "C++",
      "Data Structures",
      "Algorithms",
      "Graphs",
      "Strings",
      "Dynamic Programming",
    ],
  },
];

export default function RoadmapsPage() {
  return (
    <div className="isolate min-h-screen bg-background text-foreground flex flex-col relative selection:bg-primary/20 selection:text-primary-foreground overflow-x-hidden">
      {/* Dynamic Mathematical Frosted Glass Atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* 1. Overhead Luminous Zenith Bloom (White frosted glass refraction) */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[650px] opacity-85"
          style={{
            background: `radial-gradient(
              ellipse 60% 45% at 50% 0%,
              rgba(255, 255, 255, 0.16) 0%,
              rgba(255, 255, 255, 0.08) 25%,
              rgba(255, 255, 255, 0.02) 55%,
              transparent 75%
            )`,
          }}
        />

        {/* 2. Soft Mindflare Red Accent Caustic Bloom (Subsurface Scattering on left edge) */}
        <div
          className="absolute top-[18%] -left-[200px] w-[900px] h-[900px] opacity-35"
          style={{
            background: `radial-gradient(
              circle at 40% 40%,
              rgba(232, 48, 64, 0.15) 0%,
              rgba(232, 48, 64, 0.05) 35%,
              rgba(232, 48, 64, 0.01) 60%,
              transparent 75%
            )`,
          }}
        />

        {/* 3. Mid-Right Cool Atmospheric Diffuse Glow */}
        <div
          className="absolute top-[42%] -right-[250px] w-[1000px] h-[1000px] opacity-30"
          style={{
            background: `radial-gradient(
              circle at 60% 50%,
              rgba(255, 255, 255, 0.07) 0%,
              rgba(255, 255, 255, 0.02) 40%,
              transparent 70%
            )`,
          }}
        />

        {/* 4. Lower Ambient Foundation Bloom */}
        <div
          className="absolute bottom-[-10%] left-[20%] w-[1100px] h-[600px] opacity-25"
          style={{
            background: `radial-gradient(
              ellipse 70% 50% at 50% 60%,
              rgba(255, 255, 255, 0.05) 0%,
              rgba(255, 255, 255, 0.015) 50%,
              transparent 80%
            )`,
          }}
        />

        {/* 5. Mathematical Gaussian Vignette & Optical Depth Falloff */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 90% 65% at 50% 25%, transparent 25%, color-mix(in srgb, var(--background) 45%, transparent) 65%, var(--background) 100%),
              linear-gradient(180deg, color-mix(in srgb, var(--foreground) 2%, transparent) 0%, transparent 35%, color-mix(in srgb, var(--background) 75%, transparent) 100%)
            `,
          }}
        />

        {/* 6. Physical Micro-Grain Tactile Layer (Zero-GPU, pure SVG turbulence) */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Navbar />

      {/* Main Container positioned cleanly below floating navbar */}
      <main className="relative z-10 flex-1 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Learning paths</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Choose your next path
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Explore a curated path or build one around your goals.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/roadmaps/create" className="inline-flex items-center gap-2 border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Build your roadmap <ArrowRight size={16} />
            </Link>
            <Link href="/roadmaps/my" className="inline-flex items-center border border-input bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              Saved roadmaps
            </Link>
          </div>
        </div>

        {/* Roadmap Cards List */}
        <div className="space-y-10 sm:space-y-12">
          {ROADMAPS.map((roadmap, idx) => {
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={roadmap.id}
                className="group overflow-hidden border border-border bg-card text-card-foreground transition-colors duration-300 hover:border-foreground/30"
              >
                <div
                  className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"}`}
                >
                  {/* Roadmap Visual Image Box */}
                  <div className="relative flex w-full flex-col items-center justify-between overflow-hidden border-b border-border bg-muted p-6 sm:p-8 md:w-5/12 md:border-b-0 md:border-r">
                    <div className="w-full flex items-center justify-between mb-4 z-10">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock size={14} />{roadmap.duration}</span>
                      <span className="text-xs text-muted-foreground">PDF</span>
                    </div>

                    {/* Image Preview with Hover Zoom */}
                    <div className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-background shadow-lg transition-all duration-500 group-hover:border-primary/40 aspect-video sm:aspect-[16/10]">
                      <Image
                        src={roadmap.image}
                        alt={roadmap.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 600px"
                        className="object-cover object-left origin-left group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* PDF Quick Download Pill */}
                    <div className="z-10 mt-5 flex w-full items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-primary" />
                        <span className="max-w-[180px] truncate font-mono text-foreground sm:max-w-[220px]">
                          {roadmap.fileName}
                        </span>
                      </span>
                      <AnimateIcon animateOnHover asChild>
                        <a
                          href={roadmap.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/preview flex cursor-pointer items-center gap-1 font-medium text-primary transition-colors hover:text-primary/80"
                        >
                          <span>Preview PDF</span>
                          <ExternalLink size={12} className="size-3" />
                        </a>
                      </AnimateIcon>
                    </div>
                  </div>

                  {/* Roadmap Details & Milestones Area */}
                  <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">{roadmap.badge}</p>
                      <h2 className="mb-2 text-xl font-bold leading-tight text-foreground sm:text-2xl">
                        {roadmap.title}
                      </h2>
                      <p className="mb-3 text-xs text-muted-foreground sm:text-sm">
                        {roadmap.subtitle}
                      </p>

                      <p className="mb-5 text-xs leading-relaxed text-foreground sm:text-sm">
                        {roadmap.description}
                      </p>

                      {/* Milestones Checklist */}
                      <div className="space-y-2.5 mb-6">
                        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Key Curriculum Stages
                        </h3>
                        {roadmap.milestones.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="group/milestone flex cursor-default items-start gap-2.5 text-xs text-foreground sm:text-sm"
                          >
                            <CircleCheck
                              size={16}
                              animateOnHover
                              className="mt-0.5 size-4 shrink-0 text-primary"
                            />
                            <span className="leading-relaxed">{m}</span>
                          </div>
                        ))}
                      </div>

                      {/* Key Topics Badges with Real Language Icons */}
                      <p className="mb-7 text-xs text-muted-foreground">{roadmap.keyTopics.join(" · ")}</p>
                    </div>

                    {/* Action Buttons: Red Primary Download, Dark Glass Secondary, Subtle Link */}
                    <div className="flex flex-col items-stretch gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
                      {/* Download PDF (Brand Red Action) */}
                      <AnimateIcon animateOnHover asChild>
                        <a
                          href={roadmap.pdfUrl}
                          download={roadmap.fileName}
                          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 sm:text-sm"
                        >
                          <Download size={16} className="size-4" />
                          <span>Download PDF Roadmap</span>
                        </a>
                      </AnimateIcon>

                      {/* View PDF in Browser */}
                      <AnimateIcon animateOnHover asChild>
                        <a
                          href={roadmap.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-medium text-foreground transition-all hover:bg-muted sm:text-sm"
                        >
                          <ExternalLink size={16} className="size-4" />
                          <span>View in Browser</span>
                        </a>
                      </AnimateIcon>

                      {/* Go to Interactive Practice */}
                      <AnimateIcon animateOnHover asChild>
                        <Link
                          href={roadmap.practiceHref}
                          className="group/link inline-flex cursor-pointer items-center justify-center gap-1.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:ml-auto sm:text-sm"
                        >
                          <span>{roadmap.practiceLabel}</span>
                          <ArrowRight size={14} className="size-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </AnimateIcon>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-y border-border py-6 sm:flex-row sm:items-center">
          <div><h2 className="text-lg font-semibold text-foreground">Practice what you learn</h2><p className="mt-1 text-sm text-muted-foreground">Build a timed practice set.</p></div>
          <Link href="/practice/contest-builder" className="inline-flex items-center gap-2 border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">Create practice set <ArrowRight size={15} /></Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
