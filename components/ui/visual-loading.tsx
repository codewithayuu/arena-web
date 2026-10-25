import type { CSSProperties } from "react";

const pulse = "animate-pulse motion-reduce:animate-none bg-white/[0.07]";

function Shape({ className, style }: { className: string; style?: CSSProperties }) {
  return <div aria-hidden="true" className={`${pulse} rounded-md ${className}`} style={style} />;
}

export function SimulationLoading({ label = "interactive simulation" }: { label?: string }) {
  return (
    <section aria-busy="true" className="w-full rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-4 sm:p-5">
      <p className="sr-only" role="status" aria-live="polite">Loading {label}</p>
      <div aria-hidden="true">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
          <Shape className="h-5 w-44" />
          <div className="flex gap-2"><Shape className="h-8 w-8 rounded-lg" /><Shape className="h-8 w-24 rounded-lg" /><Shape className="h-8 w-8 rounded-lg" /></div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <div className="relative flex min-h-[19rem] items-center justify-center overflow-hidden rounded-xl border border-white/[0.05] bg-black/60 p-5">
            <div className="absolute inset-x-8 top-1/4 border-t border-white/[0.04]" />
            <div className="absolute inset-x-8 top-1/2 border-t border-white/[0.04]" />
            <div className="absolute inset-x-8 top-3/4 border-t border-white/[0.04]" />
            <div className="flex w-full items-center justify-around gap-4">
              <Shape className="h-12 w-12 rounded-xl" />
              <Shape className="h-16 w-16 rounded-full" />
              <Shape className="h-10 w-10 rounded-lg" />
              <Shape className="h-14 w-14 rounded-xl" />
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-white/[0.05] bg-black/30 p-4">
            <Shape className="h-4 w-28" /><Shape className="h-28 w-full rounded-lg" />
            <Shape className="h-3 w-full" /><Shape className="h-3 w-4/5" /><Shape className="h-8 w-full rounded-lg" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3"><Shape className="h-2 flex-1 rounded-full" /><Shape className="h-8 w-24 rounded-lg" /></div>
      </div>
    </section>
  );
}

export function ChartLoading({
  label,
  kind,
  height = 280,
}: {
  label: string;
  kind: "rating" | "activity" | "performance";
  height?: number;
}) {
  const style: CSSProperties = { height };
  return (
    <div aria-busy="true" className="w-full rounded-xl border border-white/[0.06] bg-[#0d0d12] p-4" style={style}>
      <p className="sr-only" role="status" aria-live="polite">Loading {label}</p>
      <div aria-hidden="true" className="flex h-full gap-3">
        <div className="flex w-8 flex-col justify-between py-4"><Shape className="h-2 w-7" /><Shape className="h-2 w-6" /><Shape className="h-2 w-7" /><Shape className="h-2 w-5" /></div>
        {kind === "activity" ? (
          <div className="grid flex-1 grid-cols-12 grid-rows-7 gap-1 self-center">
            {Array.from({ length: 84 }, (_, index) => <Shape key={index} className={`aspect-square w-full rounded-sm ${index % 9 === 0 ? "bg-emerald-400/15" : "bg-white/[0.035]"}`} />)}
          </div>
        ) : (
          <div className="relative flex-1 overflow-hidden border-b border-l border-white/[0.12]">
            <div className="absolute inset-0 flex flex-col justify-between py-5">
              <span className="border-t border-white/[0.05]" /><span className="border-t border-white/[0.05]" /><span className="border-t border-white/[0.05]" /><span className="border-t border-white/[0.05]" />
            </div>
            {kind === "performance" ? (
              <div className="absolute inset-x-4 bottom-0 flex h-3/4 items-end justify-around gap-2">
                {[35, 55, 30, 78, 48, 68, 42, 88, 57].map((size, index) => <Shape key={index} className="w-full rounded-t-sm" style={{ height: `${size}%` }} />)}
              </div>
            ) : (
              <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                <polyline points="0,188 65,160 130,174 200,108 265,130 330,74 395,112 465,58 530,79 600,34" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function EditorLoading({ label = "code editor" }: { label?: string }) {
  return (
    <section aria-busy="true" className="min-h-[300px] h-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#08080a] font-mono">
      <p className="sr-only" role="status" aria-live="polite">Loading {label}</p>
      <div aria-hidden="true">
        <div className="flex h-10 items-center justify-between border-b border-white/[0.06] px-4"><Shape className="h-4 w-24" /><Shape className="h-6 w-20 rounded-md" /></div>
        <div className="space-y-3 p-4 pt-5">
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Shape className="h-3 w-5 opacity-40" />
              <Shape className={`h-3 ${["w-3/5", "w-2/5", "w-4/5", "w-1/3", "w-2/3"][index % 5]}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TopicOverlayLoading({
  label,
  kind,
}: {
  label: string;
  kind: "search" | "modules" | "heatmap" | "aura";
}) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-start bg-black/70 px-4 pt-[15vh] backdrop-blur-sm sm:place-items-center sm:pt-0" aria-busy="true">
      <p className="sr-only" role="status" aria-live="polite">Loading {label}</p>
      <div aria-hidden="true" className={`w-full rounded-2xl border border-white/[0.08] bg-[#0a0a0d] p-5 shadow-2xl ${kind === "search" ? "max-w-2xl" : "max-w-4xl"}`}>
        <div className="mb-5 flex items-center justify-between"><Shape className="h-6 w-48" /><Shape className="h-8 w-8 rounded-full" /></div>
        {kind === "search" && <Shape className="mb-4 h-12 w-full rounded-xl" />}
        {kind === "heatmap" ? <ChartLoading label={label} kind="activity" height={220} /> : <div className="grid gap-3 sm:grid-cols-2">{Array.from({ length: kind === "modules" ? 8 : kind === "aura" ? 4 : 6 }, (_, index) => <Shape key={index} className="h-16 w-full rounded-xl" />)}</div>}
      </div>
    </div>
  );
}
