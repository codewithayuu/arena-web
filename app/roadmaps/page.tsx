import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  ExternalLink,
  CircleCheck,
  Clock,
  Sparkles,
  ArrowRight,
  AnimateIcon,
} from "@/components/animate-ui/icons";
import { BookOpen, FileText, Code2, Layers, Cpu, Compass } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LanguageIcon } from "@/components/dsa/language-icons";

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

function renderTopicIcon(topic: string) {
  const t = topic.toLowerCase();
  if (t === "c++" || t === "cpp") {
    return <LanguageIcon language="cpp" className="w-3.5 h-3.5 shrink-0" />;
  }
  if (t === "javascript" || t === "js") {
    return <LanguageIcon language="javascript" className="w-3.5 h-3.5 shrink-0" />;
  }
  if (t === "html") {
    return <Code2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
  }
  if (t === "css") {
    return <Code2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
  }
  if (t.includes("data") || t.includes("structure")) {
    return <Layers className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
  }
  if (t.includes("algorithm")) {
    return <Cpu className="w-3.5 h-3.5 text-red-400 shrink-0" />;
  }
  return <Compass className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
}

export default function RoadmapsPage() {
  return (
    <div className="isolate min-h-screen bg-[#08080a] text-white flex flex-col relative selection:bg-red-500/20 selection:text-white overflow-x-hidden">
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
              radial-gradient(ellipse 90% 65% at 50% 25%, transparent 25%, rgba(8, 8, 10, 0.45) 65%, #08080a 100%),
              linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 35%, rgba(4, 4, 6, 0.75) 100%)
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-4 shadow-[0_0_16px_rgba(232,48,64,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e83040] animate-pulse" />
            <Sparkles size={14} animateOnHover className="size-3.5 text-[#e83040]" />
            Structured Learning Paths
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Web Development &amp; Competitive Programming
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Follow a proven visual path with milestone checklists, key topics, and high-resolution downloadable PDF curriculum guides.
          </p>

          {/* Quick Stats Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs sm:text-sm text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="w-4 h-4 text-[#e83040]" />
              <span className="text-zinc-300">2 Complete Roadmaps</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Download size={16} animateOnHover className="size-4 text-[#e83040]" />
              <span className="text-zinc-300">Free PDF Downloads</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles size={16} animateOnHover className="size-4 text-[#e83040]" />
              <span className="text-zinc-300">Integrated Interactive Practice</span>
            </span>
          </div>
        </div>

        {/* Roadmap Cards List */}
        <div className="space-y-10 sm:space-y-12">
          {ROADMAPS.map((roadmap, idx) => {
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={roadmap.id}
                className="rounded-3xl border border-white/[0.08] bg-[#0c0c10]/75 backdrop-blur-xl overflow-hidden hover:border-red-500/40 transition-all duration-300 shadow-2xl group hover:shadow-[0_0_30px_rgba(232,48,64,0.12)]"
              >
                <div
                  className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"}`}
                >
                  {/* Roadmap Visual Image Box */}
                  <div className="w-full md:w-5/12 bg-white/[0.02] backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between items-center relative overflow-hidden border-b md:border-b-0 md:border-r border-white/[0.08]">
                    <div className="w-full flex items-center justify-between mb-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-white/5 text-zinc-300 border border-white/10">
                        <Clock size={14} animateOnHover className="size-3.5 text-zinc-400" />
                        {roadmap.duration}
                      </span>
                      <span className="text-xs font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/5">
                        PDF Format
                      </span>
                    </div>

                    {/* Image Preview with Hover Zoom */}
                    <div className="relative w-full aspect-video sm:aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black flex items-center justify-center group-hover:border-red-500/40 transition-all duration-500">
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
                    <div className="w-full mt-5 flex items-center justify-between text-xs text-zinc-400 z-10">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#e83040]" />
                        <span className="font-mono text-zinc-300 truncate max-w-[180px] sm:max-w-[220px]">
                          {roadmap.fileName}
                        </span>
                      </span>
                      <AnimateIcon animateOnHover asChild>
                        <a
                          href={roadmap.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-400 hover:text-red-300 flex items-center gap-1 font-medium group/preview cursor-pointer transition-colors"
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
                      {/* Badge & Title */}
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-3 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e83040]" />
                        {roadmap.badge}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                        {roadmap.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-400 mb-4">
                        {roadmap.subtitle}
                      </p>

                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                        {roadmap.description}
                      </p>

                      {/* Milestones Checklist */}
                      <div className="space-y-2.5 mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                          Key Curriculum Stages
                        </h3>
                        {roadmap.milestones.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 group/milestone cursor-default"
                          >
                            <CircleCheck
                              size={16}
                              animateOnHover
                              className="size-4 text-emerald-400 shrink-0 mt-0.5 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                            />
                            <span className="leading-relaxed">{m}</span>
                          </div>
                        ))}
                      </div>

                      {/* Key Topics Badges with Real Language Icons */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {roadmap.keyTopics.map((topic) => (
                          <span
                            key={topic}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 text-zinc-200 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all shadow-xs"
                          >
                            {renderTopicIcon(topic)}
                            <span>{topic}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons: Red Primary Download, Dark Glass Secondary, Subtle Link */}
                    <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {/* Download PDF (Brand Red Action) */}
                      <AnimateIcon animateOnHover asChild>
                        <a
                          href={roadmap.pdfUrl}
                          download={roadmap.fileName}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#e83040] hover:bg-[#d02535] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-red-500/25 active:scale-95 cursor-pointer"
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
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 text-xs sm:text-sm font-medium border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                        >
                          <ExternalLink size={16} className="size-4" />
                          <span>View in Browser</span>
                        </a>
                      </AnimateIcon>

                      {/* Go to Interactive Practice */}
                      <AnimateIcon animateOnHover asChild>
                        <Link
                          href={roadmap.practiceHref}
                          className="sm:ml-auto inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm text-zinc-400 hover:text-white font-medium py-2 transition-colors cursor-pointer group/link"
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

        {/* Bottom Banner with Subtle Glow */}
        <div className="mt-16 rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#0c0c10]/90 to-[#08080a]/90 backdrop-blur-xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,48,64,0.12),transparent_70%)] pointer-events-none" />

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/10 text-[#e83040] border border-red-500/20 mb-4 shadow-[0_0_16px_rgba(232,48,64,0.25)] relative z-10">
            <Sparkles size={24} animateOnHover className="size-6 text-[#e83040]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 relative z-10">
            Ready to test your intuition with real code?
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto mb-6 leading-relaxed relative z-10">
            Choose a roadmap above, then jump into the Practice Arena to master algorithms, system design, and concurrency with live execution.
          </p>

          <div className="relative z-10">
            <AnimateIcon animateOnHover asChild>
              <Link
                href="/practice/dsa-patterns"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e83040] hover:bg-[#d02535] text-white text-sm font-semibold transition-all shadow-lg shadow-red-500/30 active:scale-95 cursor-pointer"
              >
                <span>Explore Practice Hub</span>
                <ArrowRight size={16} className="size-4" />
              </Link>
            </AnimateIcon>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
