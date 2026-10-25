"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  RotateCcw,
  Check,
  Sparkles,
  Layers,
  Terminal,
  Cpu,
  Boxes,
  Code2,
  Workflow,
  Clock,
  BookOpen,
} from "lucide-react";
import { SpecularButton } from "@/components/reactbits/specular-button";

// ---------------------------------------------------------
// Graph Node and Decision Engine Types
// ---------------------------------------------------------

export interface GraphOption {
  id: string;
  label: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  nextNodeId: string;
  weights: {
    dsa?: number;
    cp?: number;
    sys?: number;
    lld?: number;
    conc?: number;
    beginner?: number;
    sprint?: number;
  };
}

export interface GraphNode {
  id: string;
  stepNumber: number;
  badge: string;
  title: string;
  subtitle: string;
  options: GraphOption[];
}

export interface RecommendedTrack {
  id: string;
  trackTitle: string;
  badge: string;
  matchScore: string;
  description: string;
  firstProblemTitle: string;
  firstProblemUrl: string;
  roadmapTitle: string;
  roadmapUrl: string;
  estimatedTime: string;
  keySkills: string[];
}

// ---------------------------------------------------------
// Pre-configured Outcome Tracks
// ---------------------------------------------------------

const OUTCOME_TRACKS: Record<string, RecommendedTrack> = {
  faang_high_yield: {
    id: "faang_high_yield",
    trackTitle: "FAANG Interview Fast-Track: 70+ Core Patterns",
    badge: "Interview Prep",
    matchScore: "99% Match",
    description:
      "The highest-yield preparation path for technical interviews at Google, Meta, Amazon, and Microsoft. Master 70 essential algorithmic patterns that unlock 95% of LeetCode medium and hard questions.",
    firstProblemTitle: "Two Sum & Two Pointers Invariants",
    firstProblemUrl: "/practice/dsa-patterns",
    roadmapTitle: "DSA Interview Roadmaps",
    roadmapUrl: "/roadmaps",
    estimatedTime: "8–12 Weeks",
    keySkills: ["Sliding Window", "Monotonic Stack", "Fast & Slow Pointers", "Interval Merges"],
  },
  faang_sprint: {
    id: "faang_sprint",
    trackTitle: "4-Week Rapid High-Yield DSA Sprint",
    badge: "Fast-Track Sprint",
    matchScore: "98% Match",
    description:
      "A concentrated 4-week sprint focusing exclusively on the top 25 high-frequency patterns asked in technical screening interviews. Ideal when you have an upcoming interview loop.",
    firstProblemTitle: "Move Zeroes - In-Place Partitioning",
    firstProblemUrl: "/practice/dsa-patterns",
    roadmapTitle: "16-Week & Sprint Roadmaps",
    roadmapUrl: "/roadmaps",
    estimatedTime: "4 Weeks",
    keySkills: ["Two Pointers", "Binary Search on Answer", "Hash Map Complements", "Top-K Elements"],
  },
  cp_grandmaster: {
    id: "cp_grandmaster",
    trackTitle: "ICPC & Competitive Programming Grandmaster Track",
    badge: "Contest Rating",
    matchScore: "99% Match",
    description:
      "Designed for Codeforces/CodeChef contestants aiming for Div 1 and ICPC regionals. Deep dives into Segment Trees with lazy propagation, Centroid Decomposition, and Advanced DP.",
    firstProblemTitle: "Range Queries & Segment Trees",
    firstProblemUrl: "/topic-list",
    roadmapTitle: "Official Competitive Programming Syllabus (PDF)",
    roadmapUrl: "/roadmaps",
    estimatedTime: "14–16 Weeks",
    keySkills: ["Segment Trees", "Centroid Decomp", "Tree DP", "Max Flow & DSU"],
  },
  cp_div2: {
    id: "cp_div2",
    trackTitle: "Codeforces Div 2 Contender Curriculum",
    badge: "Contest Rating",
    matchScore: "98% Match",
    description:
      "Bridge the gap from novice to rated Div 2 competitor. Master number theory, prime sieves, BFS/DFS graph traversals, and 2D dynamic programming tabulation.",
    firstProblemTitle: "Binary Search on Answer Predicates",
    firstProblemUrl: "/practice/dsa-patterns",
    roadmapTitle: "Curriculum Topic List",
    roadmapUrl: "/topic-list",
    estimatedTime: "10–12 Weeks",
    keySkills: ["Modular Arithmetic", "Graph Traversals", "2D DP", "Coordinate Compression"],
  },
  distributed_systems: {
    id: "distributed_systems",
    trackTitle: "Quantitative Distributed Systems Architecture",
    badge: "System Design",
    matchScore: "99% Match",
    description:
      "Solve quantitative distributed architecture problems with an in-browser Monaco editor: Little's Law, Amdahl's Law, Consistent Hashing, Availability 9s, and Rate Limiting algorithms.",
    firstProblemTitle: "Consistent Hashing & Token Bucket Limits",
    firstProblemUrl: "/practice/dsa-patterns",
    roadmapTitle: "System Design Career Roadmap",
    roadmapUrl: "/roadmaps",
    estimatedTime: "8–10 Weeks",
    keySkills: ["Little's Law", "Consistent Hashing", "CAP Theorem", "Token Bucket"],
  },
  concurrency_os: {
    id: "concurrency_os",
    trackTitle: "Multi-Threading, Concurrency & OS Primitives",
    badge: "Systems & OS",
    matchScore: "98% Match",
    description:
      "Master synchronization primitives, mutexes, semaphores, barriers, and deadlock prevention. Write and test real multi-threaded code under simulated race conditions.",
    firstProblemTitle: "Producer-Consumer Mutex Synchronization",
    firstProblemUrl: "/practice/dsa-patterns",
    roadmapTitle: "Concurrency Engineering Guide",
    roadmapUrl: "/roadmaps",
    estimatedTime: "6–8 Weeks",
    keySkills: ["Mutexes & Locks", "Semaphores", "Memory Barriers", "Race Conditions"],
  },
  lld_clean_code: {
    id: "lld_clean_code",
    trackTitle: "Low-Level Design (LLD) & Machine Coding",
    badge: "Clean Architecture",
    matchScore: "98% Match",
    description:
      "Implement extensible object-oriented systems and GoF design patterns (Strategy, Factory, Observer, Decorator) validated against real automated test suites.",
    firstProblemTitle: "Design LRU Cache with Clean OOD",
    firstProblemUrl: "/practice/dsa-patterns",
    roadmapTitle: "Low-Level Design Roadmaps",
    roadmapUrl: "/roadmaps",
    estimatedTime: "6–8 Weeks",
    keySkills: ["SOLID Principles", "GoF Design Patterns", "LRU Cache", "Class Schemas"],
  },
  foundations_intuition: {
    id: "foundations_intuition",
    trackTitle: "Zero-to-One Algorithmic Foundations & Intuition",
    badge: "Beginner Friendly",
    matchScore: "99% Match",
    description:
      "Build a rock-solid mental model of algorithms before writing code. Step-by-step visual pointer movements, time complexity intuition, and memory layout tracking.",
    firstProblemTitle: "Move Zeroes - In-Place Partitioning",
    firstProblemUrl: "/practice/dsa-patterns",
    roadmapTitle: "DSA Beginner-to-Intermediate Roadmap",
    roadmapUrl: "/roadmaps",
    estimatedTime: "6–8 Weeks",
    keySkills: ["Visual Pointer Tracking", "Big-O Asymptotics", "Recursion Trees", "Arrays & Maps"],
  },
};

// ---------------------------------------------------------
// Directed Acyclic Graph (DAG) Decision Nodes
// ---------------------------------------------------------

const DECISION_GRAPH: Record<string, GraphNode> = {
  // ROOT NODE: Primary Learning Objective
  root: {
    id: "root",
    stepNumber: 1,
    badge: "Step 1 • Primary Objective",
    title: "What is your main engineering objective?",
    subtitle: "Select the goal you want to achieve first",
    options: [
      {
        id: "goal_faang",
        label: "Crack FAANG & Tier-1 Tech Interviews",
        description: "Master high-frequency LeetCode patterns, live whiteboards, and problem-solving reflexes.",
        icon: Workflow,
        nextNodeId: "node_faang_timeline",
        weights: { dsa: 5, sprint: 3 },
      },
      {
        id: "goal_cp",
        label: "ICPC & Competitive Programming Contests",
        description: "Climb Codeforces/CodeChef ratings, master math, advanced trees, and graph algorithms.",
        icon: Terminal,
        nextNodeId: "node_cp_level",
        weights: { cp: 5 },
      },
      {
        id: "goal_systems",
        label: "System Design, Architecture & Concurrency",
        description: "Distributed systems, quantitative latency math, concurrency primitives, and clean LLD.",
        icon: Cpu,
        nextNodeId: "node_systems_layer",
        weights: { sys: 5, lld: 3, conc: 3 },
      },
      {
        id: "goal_foundations",
        label: "Master Core Algorithmic Foundations",
        description: "Build strong visual intuition and mental models for data structures from the ground up.",
        icon: Boxes,
        nextNodeId: "node_language_pref",
        weights: { beginner: 5, dsa: 3 },
      },
    ],
  },

  // BRANCH A: FAANG Timeline Calibration
  node_faang_timeline: {
    id: "node_faang_timeline",
    stepNumber: 2,
    badge: "Step 2 • Timeline Calibration",
    title: "What is your preparation timeline?",
    subtitle: "We calibrate pattern coverage based on your available prep window",
    options: [
      {
        id: "time_sprint",
        label: "Under 4–6 Weeks (Urgent Sprint)",
        description: "Focus on the top 25 high-frequency patterns that yield 80% of interview results quickly.",
        nextNodeId: "node_language_pref",
        weights: { sprint: 5, dsa: 4 },
      },
      {
        id: "time_comprehensive",
        label: "8–16 Weeks (Comprehensive Preparation)",
        description: "Master algorithmic patterns, edge-case proofs, and timed problem-solving practice.",
        nextNodeId: "node_language_pref",
        weights: { dsa: 5, sys: 2 },
      },
    ],
  },

  // BRANCH B: Competitive Programming Rating
  node_cp_level: {
    id: "node_cp_level",
    stepNumber: 2,
    badge: "Step 2 • Contest Calibration",
    title: "What is your current contest experience?",
    subtitle: "Select the rating tier you are targeting",
    options: [
      {
        id: "cp_novice",
        label: "Div 3 / Div 4 (Building Foundations)",
        description: "Working on basic math, number theory, binary search, and standard BFS/DFS traversals.",
        nextNodeId: "node_language_pref",
        weights: { cp: 3, dsa: 3 },
      },
      {
        id: "cp_elite",
        label: "Div 1 / Div 2 & ICPC Finalist Track",
        description: "Targeting Segment Trees, Fenwick, DP on trees, centroid decomposition, and flow networks.",
        nextNodeId: "node_language_pref",
        weights: { cp: 6 },
      },
    ],
  },

  // BRANCH C: Systems Architectural Layer
  node_systems_layer: {
    id: "node_systems_layer",
    stepNumber: 2,
    badge: "Step 2 • Domain Specialization",
    title: "Which architectural layer do you want to master?",
    subtitle: "Select your primary engineering focus area",
    options: [
      {
        id: "sys_distributed_focus",
        label: "High-Level Distributed Systems (HLD)",
        description: "Little's Law, CAP theorem, consistent hashing, database sharding, and latency models.",
        nextNodeId: "node_language_pref",
        weights: { sys: 5 },
      },
      {
        id: "sys_concurrency_focus",
        label: "Multi-Threading & OS Concurrency",
        description: "Mutexes, semaphores, race conditions, atomic operations, and memory barriers.",
        nextNodeId: "node_language_pref",
        weights: { conc: 5 },
      },
      {
        id: "sys_lld_focus",
        label: "Low-Level Design (LLD) & Machine Coding",
        description: "Clean architecture, SOLID principles, GoF patterns, and real object-oriented schemas.",
        nextNodeId: "node_language_pref",
        weights: { lld: 5 },
      },
    ],
  },

  // TERMINAL INPUT NODE: Programming Language Preference
  node_language_pref: {
    id: "node_language_pref",
    stepNumber: 3,
    badge: "Step 3 • Environment Preference",
    title: "Which programming language do you prefer?",
    subtitle: "We format boilerplate solutions and test harnesses to your syntax",
    options: [
      {
        id: "lang_cpp",
        label: "C++ (STL & Speed)",
        description: "Industry gold standard for competitive programming and ultra-low latency.",
        nextNodeId: "TERMINAL",
        weights: { cp: 1, dsa: 1 },
      },
      {
        id: "lang_python",
        label: "Python (Concise Syntax)",
        description: "Fast prototyping and clean readability, widely popular in technical interviews.",
        nextNodeId: "TERMINAL",
        weights: { dsa: 1 },
      },
      {
        id: "lang_java",
        label: "Java (Enterprise & Strict Types)",
        description: "Strongly typed and object-oriented, favored in backend and LLD rounds.",
        nextNodeId: "TERMINAL",
        weights: { lld: 1, sys: 1 },
      },
      {
        id: "lang_ts",
        label: "TypeScript / JavaScript",
        description: "Modern web standard, ideal for full-stack and frontend engineering roles.",
        nextNodeId: "TERMINAL",
        weights: { dsa: 1 },
      },
    ],
  },
};

// ---------------------------------------------------------
// Component Implementation
// ---------------------------------------------------------

export function FindTrackQuiz() {
  const [currentNodeId, setCurrentNodeId] = useState<string>("root");
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<boolean>(false);

  const currentNode = DECISION_GRAPH[currentNodeId] || DECISION_GRAPH.root;

  const handleSelectOption = (option: GraphOption) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [currentNodeId]: option.id,
    }));

    if (option.nextNodeId === "TERMINAL") {
      setCompleted(true);
    } else {
      setPathHistory((prev) => [...prev, currentNodeId]);
      setCurrentNodeId(option.nextNodeId);
    }
  };

  const handleBack = () => {
    if (pathHistory.length === 0) return;
    const previousNodeId = pathHistory[pathHistory.length - 1];
    setPathHistory((prev) => prev.slice(0, prev.length - 1));
    setCurrentNodeId(previousNodeId);
  };

  const handleReset = () => {
    setCurrentNodeId("root");
    setPathHistory([]);
    setSelectedChoices({});
    setCompleted(false);
  };

  // -------------------------------------------------------
  // Tree / DAG Evaluation Algorithm
  // -------------------------------------------------------
  const resolveRecommendation = (): RecommendedTrack => {
    const rootChoice = selectedChoices.root;
    const timelineChoice = selectedChoices.node_faang_timeline;
    const cpChoice = selectedChoices.node_cp_level;
    const systemsChoice = selectedChoices.node_systems_layer;

    // Direct Tree Branch Traversal
    if (rootChoice === "goal_faang") {
      if (timelineChoice === "time_sprint") {
        return OUTCOME_TRACKS.faang_sprint;
      }
      return OUTCOME_TRACKS.faang_high_yield;
    }

    if (rootChoice === "goal_cp") {
      if (cpChoice === "cp_elite") {
        return OUTCOME_TRACKS.cp_grandmaster;
      }
      return OUTCOME_TRACKS.cp_div2;
    }

    if (rootChoice === "goal_systems") {
      if (systemsChoice === "sys_concurrency_focus") {
        return OUTCOME_TRACKS.concurrency_os;
      }
      if (systemsChoice === "sys_lld_focus") {
        return OUTCOME_TRACKS.lld_clean_code;
      }
      return OUTCOME_TRACKS.distributed_systems;
    }

    if (rootChoice === "goal_foundations") {
      return OUTCOME_TRACKS.foundations_intuition;
    }

    // Default robust fallback to FAANG high yield
    return OUTCOME_TRACKS.faang_high_yield;
  };

  const totalSteps = 3;
  const currentStep = currentNode.stepNumber;
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <section className="w-full py-24 md:py-32 lg:py-36 relative overflow-hidden bg-transparent">
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-80 bg-[#FF1018]/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container px-4 md:px-6 mx-auto relative z-10 max-w-4xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1018]/10 border border-[#FF1018]/25">
            <Compass className="w-3.5 h-3.5 text-[#FF1018]" />
            <span className="text-xs font-bold tracking-wider uppercase text-[#FF3B41]">
              DECISION ENGINE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F4F3FC] tracking-tight leading-tight">
            Find Your Ideal Learning Track
          </h2>

          <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed">
            Answer 3 adaptive questions calibrated by our decision graph to discover your customized engineering pathway.
          </p>
        </div>

        {/* Quiz Container Card */}
        <div className="max-w-2xl mx-auto rounded-2xl bg-[#09090E] border border-[#1E1E2E] shadow-2xl p-6 sm:p-8">
          {!completed ? (
            <div>
              {/* Progress Bar & Step Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span className="text-[#FF3B41] font-semibold">{currentNode.badge}</span>
                  <span className="text-zinc-500">{currentStep} of {totalSteps}</span>
                </div>
                <div className="w-full h-1.5 bg-[#000000] rounded-full overflow-hidden border border-[#1E1E2E]">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF1018] to-[#FF3B41] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Question Title & Subtitle */}
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-[#F4F3FC] mb-1.5">
                  {currentNode.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#94a3b8]">
                  {currentNode.subtitle}
                </p>
              </div>

              {/* Adaptive Options List */}
              <div className="space-y-3 mb-6">
                {currentNode.options.map((opt) => {
                  const isSelected = selectedChoices[currentNodeId] === opt.id;
                  const Icon = opt.icon;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
                        isSelected
                          ? "bg-[#14141F] border-[#FF1018] shadow-md shadow-[#FF1018]/15"
                          : "bg-[#000000] border-[#1E1E2E] hover:border-[#FF1018]/40 hover:bg-[#14141F]"
                      }`}
                    >
                      {/* Left Radio indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? "bg-[#FF1018] border-[#FF1018] text-white"
                            : "border-zinc-700 bg-transparent group-hover:border-zinc-500"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      {/* Content */}
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          {Icon && <Icon className="w-4 h-4 text-[#FF1018]" />}
                          <h4 className={`text-sm font-bold ${isSelected ? "text-white" : "text-zinc-200"}`}>
                            {opt.label}
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Back navigation */}
              {pathHistory.length > 0 && (
                <div className="pt-2 border-t border-[#1E1E2E] flex justify-start">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-[#14141F] transition-colors cursor-pointer"
                  >
                    &larr; Back to previous step
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Graph Traversal Result Card */
            <div>
              {(() => {
                const rec = resolveRecommendation();

                return (
                  <div className="space-y-6">
                    {/* Header badge */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF1018]/15 border border-[#FF1018]/30 text-[#FF3B41] text-xs font-mono font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF1018]" />
                        <span>{rec.matchScore}</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake Calibration</span>
                      </button>
                    </div>

                    {/* Recommendation Title */}
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                        {rec.badge}
                      </span>
                      <h3 className="text-2xl font-extrabold text-[#F4F3FC] mt-1">
                        {rec.trackTitle}
                      </h3>
                      <p className="text-sm text-[#94a3b8] mt-2 leading-relaxed">
                        {rec.description}
                      </p>
                    </div>

                    {/* Key Skills Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {rec.keySkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#000000] border border-[#1E1E2E] text-zinc-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Highlights */}
                    <div className="space-y-3 p-4 rounded-xl bg-[#000000] border border-[#1E1E2E]">
                      <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#1E1E2E]/60">
                        <span className="text-zinc-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Estimated Duration:</span>
                        </span>
                        <span className="font-mono font-bold text-white">{rec.estimatedTime}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#1E1E2E]/60">
                        <span className="text-zinc-400 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Recommended Starting Problem:</span>
                        </span>
                        <Link
                          href={rec.firstProblemUrl}
                          className="font-medium text-[#FF3B41] hover:underline"
                        >
                          {rec.firstProblemTitle} &rarr;
                        </Link>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1.5">
                        <span className="text-zinc-400 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Curated Roadmap:</span>
                        </span>
                        <Link
                          href={rec.roadmapUrl}
                          className="font-medium text-white hover:underline"
                        >
                          {rec.roadmapTitle} &rarr;
                        </Link>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Link href={rec.firstProblemUrl} className="flex-1 flex justify-center">
                        <SpecularButton
                          size="md"
                          radius={14}
                          lineColor="#FF3B41"
                          tint="#FF1018"
                          tintOpacity={0.16}
                          glow={1.2}
                          className="w-full"
                        >
                          <span>Start This Track Now</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </SpecularButton>
                      </Link>

                      <Link
                        href="/roadmaps"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#14141F] hover:bg-[#1E1E2E] text-zinc-300 hover:text-white border border-[#1E1E2E] font-semibold text-sm transition-colors text-center"
                      >
                        <span>View All Roadmaps</span>
                      </Link>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
