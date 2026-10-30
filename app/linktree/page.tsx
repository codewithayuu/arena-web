import Image from "next/image";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  BookOpen,
  Camera,
  Code2,
  MessageCircle,
  SquareChartGantt,
  Waypoints,
  CalendarDays,
  Target
} from "lucide-react";

const links = [
  { label: "Mindflare Website", href: "/", icon: Waypoints },
  { label: "DEADLOCK", href: "https://deadlock.mindflare.tech/", icon: CalendarDays},
  { label: "Beginner Learning Hub", href: "/learn/beginners", icon: BookOpen },
  { label: "Interactive DSA Course", href: "/learn/dsa/course-introduction", icon: Code2 },
  { label: "Practice Problems", href: "/topic-list", icon: Target },
  { label: "Mindflare Roadmaps", href: "/contests", icon: SquareChartGantt},
  {
    label: "Join our Discord",
    href: "https://discord.gg/tsEC8qjcJ",
    icon: MessageCircle,
    external: true,
  },
  {
    label: "Follow us on Instagram",
    href: "https://www.instagram.com/mindflare.mait",
    icon: Camera,
    external: true,
  },
  {
    label: "Connect on LinkedIn",
    href: "https://www.linkedin.com/company/mindflare2/",
    icon: BriefcaseBusiness,
    external: true,
  },
];

export const metadata = {
  title: "Mindflare Links",
  description: "Important links from Mindflare, the DSA and Competitive Programming society.",
};

export default function LinktreePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 text-[#f4f3fc]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#e83040]/10 blur-[120px]"
      />

      <section className="relative w-full max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_48px_rgba(232,48,64,0.12)]">
          <Image
            src="/images/mindflare_m_logo.svg"
            alt="Mindflare"
            width={56}
            height={56}
            className="h-full w-full object-contain"
            priority
          />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
          Mindflare <span className="text-[#FF1018]">Arena</span>
        </h1>
        <p className="mt-1 text-sm font-medium tracking-wide text-zinc-300">
          Where <span className="text-[#FF1018]">algorithm</span> sparks{" "}
          <span className="text-[#FF1018]">Intuition</span>
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
          The official DSA &amp; Competitive Programming society of the MAIT.
        </p>

        <ul className="mt-8 space-y-3">
          {links.map(({ label, href, icon: Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group flex min-h-14 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#e83040]/45 hover:bg-[#e83040]/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5466] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080a]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-black/20 text-zinc-300 transition-colors group-hover:border-[#e83040]/30 group-hover:text-[#ff7180]">
                  <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
                </span>
                <span className="flex-1 text-sm font-semibold text-zinc-100">{label}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover:text-[#ff7180]"
                />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}