import Link from "next/link";
import SmoothButton from "@/components/smoothui/smooth-button";
import { SpecularButton } from "@/components/reactbits/specular-button";

export function HeroSection() {
  return (
    <section className="w-full pt-32 pb-20 md:pt-44 md:pb-28 relative overflow-hidden">
      {/* Obsidian ambient glow – top red */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/20 via-transparent to-transparent pointer-events-none"
      />

      {/* Subtle grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px] bg-[position:0_2px]"
      />

      <div className="container px-4 md:px-6 mx-auto">
        {/* Main Heading & Subtitle */}
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight sm:tracking-tighter mb-6 leading-[1.08] text-[#F4F3FC]">
            Where{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="bg-gradient-to-r from-[#FF3B41] via-[#FF1018] to-[#CC0D13] bg-clip-text text-transparent">
                Algorithms
              </span>
              <svg
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-2 w-full text-[#FF1018]/70"
                preserveAspectRatio="none"
                viewBox="0 0 400 12"
              >
                <path
                  d="M2 8 Q 100 2, 200 7 T 398 5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
              </svg>
            </span>
            <br />
            Sparks{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="bg-gradient-to-r from-[#FF3B41] via-[#FF1018] to-[#CC0D13] bg-clip-text text-transparent">
                Intuition
              </span>
              <svg
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-2 w-full text-[#FF1018]/70"
                preserveAspectRatio="none"
                viewBox="0 0 400 12"
              >
                <path
                  d="M2 8 Q 100 2, 200 7 T 398 5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
              </svg>
            </span>
          </h1>

          <p className="text-[#c4c0d8] text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-8">
            The official{" "}
            <span className="font-semibold text-[#f1f0f5]">
              DSA &amp; Competitive Programming society
            </span>{" "}
            of the IT Department. We turn difficult problems into patterns,
            patterns into intuition, and{" "}
            <span className="font-semibold text-[#f1f0f5]">
              intuition into mastery
            </span>
            .
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
            <Link href="/topic-list" className="inline-flex">
              <SpecularButton
                size="md"
                radius={16}
                lineColor="#FF3B41"
                tint="#FF1018"
                tintOpacity={0.18}
                glow={1.4}
              >
                <span>Explore Topic List</span>
                <span className="text-white ml-0.5">&rarr;</span>
              </SpecularButton>
            </Link>

            <Link href="/practice/dsa-patterns" className="inline-flex">
              <SmoothButton
                variant="outline"
                color="neutral"
                size="default"
                className="border-[#1E1E2E] bg-[#14141F] hover:bg-[#1E1E2E] text-white font-medium"
              >
                DSA Patterns
              </SmoothButton>
            </Link>

            <Link href="/roadmaps" className="inline-flex">
              <SmoothButton
                variant="ghost"
                size="default"
                className="text-[#38BDF8] hover:text-white hover:bg-[#1E1E2E]/60 font-medium"
              >
                View Roadmaps &rarr;
              </SmoothButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
