import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface LegalSection {
  title: string;
  body: string;
}

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#050506] text-[#f4f3fc]">
      <Navbar />
      <main className="relative z-10 flex-1 px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <article className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-[#08080b] px-5 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.55)] sm:px-10 sm:py-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff6977]">Mindflare Arena · Draft for review</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">{intro}</p>
          <p className="mt-3 text-xs text-zinc-500">Updated October 21, 2026</p>

          <div className="mt-10 space-y-8">
            {sections.map((section, index) => (
              <section key={section.title} className="border-t border-zinc-800 pt-6">
                <h2 className="text-lg font-semibold text-white">{index + 1}. {section.title}</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-300">{section.body}</p>
              </section>
            ))}
          </div>

          <nav aria-label="Legal pages" className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-zinc-800 pt-6 text-sm">
            <Link href="/terms" className="text-zinc-400 underline decoration-zinc-700 underline-offset-4 hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="text-zinc-400 underline decoration-zinc-700 underline-offset-4 hover:text-white">Privacy Policy</Link>
          </nav>
        </article>
      </main>
      <Footer />
    </div>
  );
}
