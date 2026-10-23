'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  AnimateIcon,
  ArrowRight,
  Play,
  Layers,
  Terminal,
  CircuitBoard,
  Disc3,
  RefreshCw,
  Sparkles,
} from '@/components/animate-ui/icons';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Badge from '@/components/smoothui/badge';
import { MotionCarousel } from '@/components/animate-ui/motion-carousel';
import { type EmblaOptionsType } from 'embla-carousel';

export interface AnimationCategory {
  title: string;
  slug: string;
  description: string;
  count: string;
  icon: any;
  cardImage?: string;
  href: string;
  featured: boolean;
}

const ANIMATION_CATEGORIES: AnimationCategory[] = [
  {
    title: 'DSA Concepts',
    slug: 'dsa-concepts',
    description: 'Core data structures and algorithms: arrays, trees, graphs, heaps, sorting, and searching.',
    count: '140 animations',
    icon: Layers,
    cardImage: '/images/cards/DSA Concepts Tech Poster.png',
    href: '/animations/dsa-concepts',
    featured: true,
  },
  {
    title: 'DSA Problems',
    slug: 'dsa',
    description: 'Step-by-step interactive animations for top interview coding problems and patterns.',
    count: '80+ problems',
    icon: Terminal,
    cardImage: '/images/cards/Futuristic DSA Problems Banner.png',
    href: '/animations/dsa',
    featured: true,
  },
  {
    title: 'System Design',
    slug: 'system-design',
    description: 'Distributed architectures, caches, load balancers, messaging queues, and databases.',
    count: 'Coming Soon',
    icon: CircuitBoard,
    cardImage: '/images/cards/System Design Network Diagram.png',
    href: '/coming-soon',
    featured: false,
  },
  {
    title: 'SQL & Databases',
    slug: 'sql',
    description: 'B-Tree indexes, join strategies, transactions, ACID locks, and execution engines.',
    count: 'Coming Soon',
    icon: Disc3,
    cardImage: '/images/cards/SQL & Databases_ Isometric Tech Dashboard.png',
    href: '/coming-soon',
    featured: false,
  },
  {
    title: 'Concurrency & OS',
    slug: 'concurrency',
    description: 'Mutexes, semaphores, thread pools, deadlock detection, and memory models.',
    count: 'Coming Soon',
    icon: RefreshCw,
    cardImage: '/images/cards/Concurrency & OS Tech Diagram.png',
    href: '/coming-soon',
    featured: false,
  },
  {
    title: 'AI & Machine Learning',
    slug: 'ai-ml',
    description: 'Neural network forward/backward pass, transformers, attention heads, and embeddings.',
    count: 'Coming Soon',
    icon: Sparkles,
    href: '/coming-soon',
    featured: false,
  },
];

const FEATURED_TRACKS = ANIMATION_CATEGORIES.filter((c) => Boolean(c.cardImage));
const FEATURED_SLIDES = Array.from(Array(FEATURED_TRACKS.length).keys());
const CAROUSEL_OPTIONS: EmblaOptionsType = { loop: true };

export default function AnimationsPage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-14">
          {/* Hero Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-center">
              Interactive Simulations &amp; Visuals
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
              Master complex computer science concepts visually with authentic step-by-step
              interactive simulations, code synchronization, and operation cost breakdowns.
            </p>
          </div>

          {/* Featured Motion Carousel Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play size={16} animateOnHover className="size-4 text-[#e83040]" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Featured Animation Tracks
                </h2>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                Drag or use arrows to navigate
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black p-3 sm:p-6 shadow-2xl relative overflow-hidden">
              <MotionCarousel
                slides={FEATURED_SLIDES}
                options={CAROUSEL_OPTIONS}
                className="[--slide-height:15rem] sm:[--slide-height:20rem] md:[--slide-height:25rem] lg:[--slide-height:27.5rem] [--slide-spacing:1.5rem] [--slide-size:90%] sm:[--slide-size:80%] md:[--slide-size:68%] lg:[--slide-size:64%]"
                renderSlide={(index, isActive) => {
                  const cat = FEATURED_TRACKS[index];
                  const Icon = cat.icon;

                  return (
                    <AnimateIcon animateOnHover asChild>
                      <Link
                        href={cat.href}
                        className="relative size-full block group overflow-hidden rounded-2xl select-none"
                      >
                        {/* High-Resolution Cyber Tech Card Image */}
                        {cat.cardImage ? (
                          <Image
                            src={cat.cardImage}
                            alt={cat.title}
                            fill
                            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 65vw"
                            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            priority={index === 0}
                          />
                        ) : (
                          <div className="size-full bg-black" />
                        )}

                        {/* Top & Bottom Ambient Vignette Overlays for crisp HUD readability */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/85 via-black/35 to-transparent z-10" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/95 via-black/45 to-transparent z-10" />

                        {/* Ambient Red Hover Aura */}
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-radial from-[#e83040]/15 via-transparent to-transparent z-10" />

                        {/* Large Cyber Icon Chip touching top edge above heading */}
                        <div className="pointer-events-auto absolute left-[9.8%] top-[3.5%] sm:top-[4%] md:top-[4.5%] flex size-16 sm:size-20 md:size-24 lg:size-[104px] items-center justify-center rounded-2xl sm:rounded-3xl bg-black/80 backdrop-blur-md border border-[#e83040]/50 text-[#e83040] shadow-2xl shadow-black/90 group-hover:bg-[#e83040] group-hover:text-black group-hover:border-[#e83040] group-hover:shadow-[0_0_35px_rgba(232,48,64,0.65)] group-hover:scale-105 transition-all duration-300 z-30">
                          <Icon className="size-9 sm:size-11 md:size-13 lg:size-16 transition-transform duration-200 group-hover:scale-110" />
                        </div>

                        {/* Interactive HUD Bottom Row */}
                        <div className="relative z-20 size-full p-5 sm:p-7 md:p-8 flex flex-col justify-end pointer-events-none">
                          <div className="flex items-center justify-between gap-3 pt-2">
                            {/* Track Tag */}
                            <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm border border-white/10 text-[11px] font-mono tracking-wider text-zinc-400 uppercase shadow-md shadow-black/60">
                              <span className="text-[#e83040] font-bold">#</span>
                              <span>Track {index + 1}</span>
                            </div>

                            {/* Explore Button */}
                            <div className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e83040] text-white text-xs font-bold tracking-wide shadow-lg shadow-red-950/60 group-hover:bg-[#ff2a3b] group-hover:shadow-[0_0_20px_rgba(232,48,64,0.6)] group-hover:gap-2.5 transition-all duration-200">
                              <span>Explore Visuals</span>
                              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </AnimateIcon>
                  );
                }}
              />
            </div>
          </section>

          {/* All Categories Grid */}
          <section className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  All Simulation Libraries
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                  Interactive visual learning tracks covering foundational computer science, distributed architectures, and algorithms.
                </p>
              </div>
              <span className="text-xs font-mono text-zinc-500 self-start sm:self-auto">
                {ANIMATION_CATEGORIES.length} Specialized Collections
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ANIMATION_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <AnimateIcon key={cat.slug} animateOnHover asChild>
                    <Link
                      href={cat.href}
                      className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-black p-6 transition-all duration-300 hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-950/20 hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Ambient Red-Black Gradient Glow Effect on hover */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-red-600/10 via-red-950/5 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br from-red-600/20 via-black to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10">
                        {/* Top Bar with Icon & Badge */}
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center text-zinc-300 group-hover:scale-105 group-hover:border-red-600/50 group-hover:text-red-500 group-hover:bg-gradient-to-b group-hover:from-red-950/40 group-hover:to-black transition-all duration-300">
                            <Icon size={22} className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          {cat.featured ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border border-red-600/40 bg-gradient-to-r from-red-950/60 to-black text-red-400 font-mono">
                              Featured
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border border-white/10 bg-black text-zinc-400 font-mono">
                              Upcoming
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-200 mb-2">
                          {cat.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                          {cat.description}
                        </p>
                      </div>

                      {/* Bottom Footer: Count & Explore */}
                      <div className="relative z-10 mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="font-mono text-zinc-500">{cat.count}</span>
                        <div className="flex items-center gap-1.5 text-zinc-300 group-hover:text-red-400 font-semibold transition-colors duration-200">
                          <span>Explore</span>
                          <ArrowRight size={14} className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-200 text-red-500" />
                        </div>
                      </div>

                      {/* Red-Black gradient accent line on hover */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-red-600 via-red-500 to-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                    </Link>
                  </AnimateIcon>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
