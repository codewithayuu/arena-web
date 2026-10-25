import type { ReactNode } from "react";

export type PageLoadingVariant =
  | "home"
  | "admin-contests"
  | "animations"
  | "animation-category"
  | "animation-concepts"
  | "animation-concept"
  | "simulation"
  | "auth"
  | "beginner-course"
  | "coming-soon"
  | "contest-access"
  | "contest-workspace"
  | "contest-exit"
  | "device-link"
  | "course-catalog"
  | "course-outline"
  | "deadlock"
  | "interview"
  | "leaderboard"
  | "lesson"
  | "login"
  | "legal"
  | "practice-catalog"
  | "practice-patterns"
  | "practice-track"
  | "practice-problem"
  | "profile"
  | "roadmap"
  | "sso-callback"
  | "topic-index"
  | "topic-detail"
  | "topic-leaderboard"
  | "topic-profile";

function Block({ className }: { className: string }) {
  return <div className={`animate-pulse motion-reduce:animate-none rounded-md bg-white/[0.07] ${className}`} />;
}

function NavSkeleton() {
  return (
    <div className="px-4 pt-4 sm:px-6 lg:px-8" aria-hidden="true">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-black/30 px-4">
        <Block className="h-7 w-28" />
        <Block className="hidden h-10 w-72 rounded-full md:block" />
        <Block className="h-9 w-28 rounded-full" />
      </div>
    </div>
  );
}

function Header({ width = "w-64" }: { width?: string }) {
  return (
    <div className="mb-8 space-y-3 border-b border-white/[0.08] pb-6">
      <Block className="h-3 w-24 rounded-full" />
      <Block className={`h-8 max-w-full ${width}`} />
      <Block className="h-4 w-full max-w-xl" />
    </div>
  );
}

function MetricCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: count }, (_, index) => <Block key={index} className="h-24 rounded-xl border border-white/[0.06] bg-white/[0.025]" />)}
    </div>
  );
}

function CardGrid({ count = 3, height = "h-52" }: { count?: number; height?: string }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-2xl border border-white/[0.07] bg-black/35 p-5">
          <Block className={`${height} mb-5 w-full rounded-xl bg-white/[0.035]`} />
          <Block className="mb-3 h-5 w-2/3" />
          <Block className="mb-2 h-3 w-full" />
          <Block className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

function Rows({ count = 6 }: { count?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-black/35">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-4 border-b border-white/[0.05] px-4 py-4 last:border-0">
          <Block className="h-7 w-7 rounded-full" />
          <Block className="h-4 flex-1 max-w-sm" />
          <Block className="h-4 w-20" />
          <Block className="hidden h-6 w-24 rounded-full sm:block" />
        </div>
      ))}
    </div>
  );
}

function FormCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`mx-auto w-full rounded-2xl border border-white/[0.08] bg-black/55 p-6 shadow-2xl sm:p-8 ${compact ? "max-w-md" : "max-w-lg"}`}>
      <Block className="mx-auto mb-4 h-12 w-12 rounded-2xl" />
      <Block className="mx-auto mb-3 h-6 w-48 max-w-full" />
      <Block className="mx-auto mb-8 h-3 w-64 max-w-full" />
      <Block className="mb-3 h-11 w-full rounded-lg" />
      {!compact && <Block className="mb-3 h-11 w-full rounded-lg" />}
      <Block className="mb-5 h-11 w-full rounded-lg bg-[#ff1018]/20" />
      <Block className="h-10 w-full rounded-lg" />
    </div>
  );
}

function RouteLayout({ children, header = false, narrow = false, label }: { children: ReactNode; header?: boolean; narrow?: boolean; label: string }) {
  return (
    <>
      {header && <NavSkeleton />}
      <main className={`mx-auto w-full px-4 pb-16 pt-8 sm:px-6 lg:px-8 ${narrow ? "max-w-4xl" : "max-w-7xl"}`} aria-busy="true">
        <p className="sr-only" role="status" aria-live="polite">Loading {label}</p>
        <div aria-hidden="true">{children}</div>
      </main>
    </>
  );
}

function PageShape({ variant }: { variant: PageLoadingVariant }) {
  switch (variant) {
    case "home":
      return (
        <div className="space-y-12 pt-12">
          <section className="mx-auto max-w-4xl space-y-5 py-12 text-center">
            <Block className="mx-auto h-4 w-36 rounded-full" />
            <Block className="mx-auto h-14 w-4/5 max-w-3xl" />
            <Block className="mx-auto h-4 w-2/3 max-w-xl" />
            <div className="flex justify-center gap-3 pt-4"><Block className="h-11 w-36 rounded-full" /><Block className="h-11 w-32 rounded-full" /></div>
          </section>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3"><Block className="h-60 rounded-2xl" /><Block className="h-60 rounded-2xl" /><Block className="h-60 rounded-2xl" /></div>
        </div>
      );
    case "admin-contests":
      return <><Header width="w-80" /><div className="mb-5 flex flex-wrap gap-3"><Block className="h-10 w-36 rounded-lg" /><Block className="h-10 w-28 rounded-lg" /><Block className="h-10 w-44 rounded-lg" /></div><MetricCards count={3} /><div className="mt-6"><Rows count={7} /></div></>;
    case "animations":
      return <><Header width="w-72" /><div className="mb-5 flex gap-3"><Block className="h-9 w-28 rounded-full" /><Block className="h-9 w-32 rounded-full" /></div><CardGrid count={6} height="h-40" /></>;
    case "animation-category":
      return <><Header width="w-80" /><div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_18rem]"><Rows count={5} /><Block className="h-72 rounded-2xl" /></div></>;
    case "animation-concepts":
      return <><Header width="w-72" /><div className="space-y-6"><Block className="h-40 w-full rounded-2xl" /><CardGrid count={4} height="h-32" /></div></>;
    case "animation-concept":
      return <><Header width="w-96" /><div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"><div className="space-y-4"><Block className="h-64 rounded-2xl" /><Block className="h-4 w-full" /><Block className="h-4 w-5/6" /><Block className="h-4 w-2/3" /></div><Block className="h-[28rem] rounded-2xl" /></div></>;
    case "simulation":
      return <><Header width="w-96" /><div className="grid grid-cols-1 gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]"><Block className="h-[32rem] rounded-2xl" /><div className="space-y-4"><Block className="h-[28rem] rounded-2xl" /><Block className="h-16 rounded-xl" /><Block className="h-20 rounded-xl" /></div></div></>;
    case "auth":
      return <RouteAuth variant="sign" label="authentication" />;
    case "beginner-course":
      return <><Header width="w-80" /><Block className="mb-7 h-48 rounded-2xl" /><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]"><Rows count={8} /><Block className="h-72 rounded-2xl" /></div></>;
    case "coming-soon":
      return <div className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center text-center"><Block className="mb-6 h-14 w-14 rounded-2xl" /><Block className="mb-4 h-10 w-80 max-w-full" /><Block className="mb-3 h-4 w-full max-w-xl" /><Block className="h-4 w-2/3 max-w-md" /><Block className="mt-8 h-11 w-36 rounded-full" /></div>;
    case "contest-access":
      return <RouteAuth variant="access" label="contest access" />;
    case "contest-workspace":
      return <><div className="mb-5 flex items-center justify-between gap-4"><Block className="h-10 w-56" /><Block className="h-9 w-36 rounded-lg" /></div><div className="grid min-h-[70vh] grid-cols-1 gap-3 lg:grid-cols-[4.5rem_18rem_minmax(0,1fr)]"><Block className="hidden rounded-xl lg:block" /><Block className="h-[68vh] rounded-xl" /><div className="grid gap-3"><Block className="h-[46vh] rounded-xl" /><Block className="h-[20vh] rounded-xl" /></div></div></>;
    case "contest-exit":
      return <RouteAuth variant="exit" label="contest exit" />;
    case "device-link":
      return <RouteAuth variant="device-link" label="secure desktop sign-in" />;
    case "course-catalog":
      return <><Header width="w-72" /><div className="mb-6 flex flex-wrap gap-3"><Block className="h-11 flex-1 min-w-56 rounded-xl" /><Block className="h-11 w-32 rounded-xl" /></div><CardGrid count={6} height="h-36" /></>;
    case "course-outline":
      return <><Block className="mb-7 h-52 w-full rounded-2xl" /><div className="mb-6"><Header width="w-80" /></div><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]"><Rows count={8} /><div className="space-y-4"><Block className="h-44 rounded-xl" /><Block className="h-36 rounded-xl" /></div></div></>;
    case "deadlock":
      return <><Header width="w-80" /><div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"><Block className="h-[26rem] rounded-2xl" /><Block className="h-[26rem] rounded-2xl" /><Block className="h-64 rounded-2xl xl:col-span-2" /></div></>;
    case "interview":
      return <><Header width="w-80" /><div className="grid grid-cols-1 gap-5 lg:grid-cols-[22rem_minmax(0,1fr)]"><div className="space-y-4"><Block className="h-44 rounded-2xl" /><Block className="h-64 rounded-2xl" /></div><Block className="h-[36rem] rounded-2xl" /></div></>;
    case "leaderboard":
      return <><Header width="w-72" /><div className="mb-7 grid gap-4 md:grid-cols-3"><Block className="h-40 rounded-2xl" /><Block className="h-48 rounded-2xl" /><Block className="h-40 rounded-2xl" /></div><Rows count={8} /></>;
    case "lesson":
      return <><div className="mb-5 flex gap-3"><Block className="h-4 w-20" /><Block className="h-4 w-32" /></div><Header width="w-[32rem]" /><div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem]"><div className="space-y-5"><Block className="h-60 rounded-2xl" /><Block className="h-4 w-full" /><Block className="h-4 w-11/12" /><Block className="h-4 w-4/5" /><Block className="h-48 rounded-xl" /><Block className="h-4 w-full" /></div><Block className="h-80 rounded-2xl" /></div></>;
    case "login":
      return <RouteAuth variant="login" label="login" />;
    case "legal":
      return <><Header width="w-72" /><div className="space-y-7">{Array.from({ length: 5 }, (_, index) => <section key={index} className="space-y-3"><Block className="h-5 w-56" /><Block className="h-4 w-full" /><Block className="h-4 w-full" /><Block className="h-4 w-4/5" /></section>)}</div></>;
    case "practice-catalog":
      return <><Header width="w-72" /><div className="mb-6 flex gap-3"><Block className="h-10 w-32 rounded-full" /><Block className="h-10 w-40 rounded-full" /></div><CardGrid count={6} height="h-28" /></>;
    case "practice-patterns":
      return <><Header width="w-96" /><div className="mb-5 flex flex-wrap gap-2"><Block className="h-9 w-28 rounded-full" /><Block className="h-9 w-36 rounded-full" /><Block className="h-9 w-24 rounded-full" /></div><div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]"><Rows count={8} /><div className="space-y-4"><Block className="h-64 rounded-2xl" /><Block className="h-36 rounded-2xl" /></div></div></>;
    case "practice-track":
      return <><Header width="w-80" /><div className="mb-4 flex gap-3"><Block className="h-10 flex-1 rounded-xl" /><Block className="h-10 w-36 rounded-xl" /></div><Rows count={9} /></>;
    case "practice-problem":
      return <><div className="mb-5 flex items-center gap-3"><Block className="h-9 w-9 rounded-lg" /><Block className="h-5 w-56" /></div><div className="grid min-h-[70vh] gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"><div className="space-y-4 rounded-2xl border border-white/[0.06] bg-black/35 p-5"><Block className="h-7 w-3/4" /><Block className="h-4 w-full" /><Block className="h-4 w-5/6" /><Block className="h-28 rounded-xl" /><Block className="h-4 w-full" /></div><div className="grid gap-3"><Block className="h-[52vh] rounded-2xl" /><Block className="h-28 rounded-2xl" /></div></div></>;
    case "profile":
      return <><div className="mb-6 flex flex-col gap-5 rounded-2xl border border-white/[0.07] bg-black/40 p-6 sm:flex-row sm:items-center"><Block className="h-24 w-24 shrink-0 rounded-full" /><div className="flex-1 space-y-3"><Block className="h-7 w-64 max-w-full" /><Block className="h-4 w-80 max-w-full" /><Block className="h-8 w-40 rounded-full" /></div><Block className="h-16 w-32 rounded-xl" /></div><MetricCards /><div className="my-7 flex gap-2 overflow-hidden"><Block className="h-10 w-32 rounded-full" /><Block className="h-10 w-32 rounded-full" /><Block className="h-10 w-32 rounded-full" /><Block className="h-10 w-32 rounded-full" /></div><div className="grid gap-5 lg:grid-cols-2"><Block className="h-72 rounded-2xl" /><Block className="h-72 rounded-2xl" /><Block className="h-56 rounded-2xl lg:col-span-2" /></div></>;
    case "roadmap":
      return <><Header width="w-80" /><div className="mx-auto max-w-4xl space-y-0 border-l border-white/10 pl-7">{Array.from({ length: 6 }, (_, index) => <div key={index} className="relative pb-8"><Block className="absolute -left-[2.05rem] top-1 h-6 w-6 rounded-full" /><div className="rounded-2xl border border-white/[0.06] bg-black/35 p-5"><Block className="mb-3 h-5 w-2/3" /><Block className="mb-2 h-3 w-full" /><Block className="h-3 w-4/5" /></div></div>)}</div></>;
    case "sso-callback":
      return <RouteAuth variant="sso" label="sign-in callback" />;
    case "topic-index":
      return <><Header width="w-72" /><div className="mb-6 flex flex-wrap gap-3"><Block className="h-11 min-w-56 flex-1 rounded-xl" /><Block className="h-11 w-32 rounded-xl" /><Block className="h-11 w-11 rounded-xl" /></div><div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_18rem]"><div className="space-y-4"><Rows count={8} /></div><Block className="h-72 rounded-2xl" /></div></>;
    case "topic-detail":
      return <><Header width="w-96" /><div className="mb-5 flex gap-2"><Block className="h-9 w-24 rounded-full" /><Block className="h-9 w-28 rounded-full" /><Block className="h-9 w-24 rounded-full" /></div><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"><div className="space-y-4"><Block className="h-64 rounded-2xl" /><Block className="h-4 w-full" /><Block className="h-4 w-5/6" /><Block className="h-52 rounded-2xl" /></div><div className="space-y-4"><Block className="h-40 rounded-2xl" /><Block className="h-64 rounded-2xl" /></div></div></>;
    case "topic-leaderboard":
      return <><Header width="w-96" /><div className="mb-6 flex gap-3"><Block className="h-9 w-32 rounded-full" /><Block className="h-9 w-36 rounded-full" /></div><div className="mb-6 grid gap-4 md:grid-cols-3"><Block className="h-32 rounded-2xl" /><Block className="h-40 rounded-2xl" /><Block className="h-32 rounded-2xl" /></div><Rows count={7} /></>;
    case "topic-profile":
      return <><div className="mb-6 flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-black/35 p-5"><Block className="h-16 w-16 rounded-full" /><div className="flex-1 space-y-2"><Block className="h-5 w-56" /><Block className="h-3 w-40" /></div><Block className="h-9 w-24 rounded-lg" /></div><MetricCards count={3} /><div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]"><Block className="h-80 rounded-2xl" /><Block className="h-80 rounded-2xl" /></div></>;
    default:
      return null;
  }
}

function RouteAuth({ variant, label }: { variant: "sign" | "access" | "exit" | "login" | "sso" | "device-link"; label: string }) {
  const body = variant === "sso"
    ? <div className="mx-auto flex min-h-[65vh] max-w-md flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-black/35 p-8"><Block className="mb-5 h-12 w-12 rounded-full" /><Block className="mb-3 h-5 w-48" /><Block className="h-3 w-64 max-w-full" /></div>
    : variant === "device-link"
      ? <div className="mx-auto flex min-h-[60vh] max-w-xl items-center"><div className="w-full rounded-2xl border border-white/[0.07] bg-black/45 p-7"><Block className="mb-4 h-8 w-64 max-w-full" /><Block className="mb-7 h-4 w-full max-w-sm" /><Block className="mb-4 h-12 w-full rounded-xl" /><Block className="h-10 w-40 rounded-lg" /></div></div>
    : variant === "access"
      ? <div className="mx-auto flex min-h-[55vh] max-w-xl items-center"><div className="w-full rounded-2xl border border-white/[0.07] bg-black/45 p-7"><Block className="mb-4 h-7 w-60 max-w-full" /><Block className="mb-7 h-4 w-full max-w-sm" /><Block className="mb-4 h-12 w-full rounded-xl" /><Block className="h-12 w-full rounded-xl bg-[#ff1018]/20" /></div></div>
      : variant === "exit"
        ? <div className="mx-auto flex min-h-[55vh] max-w-xl items-center"><div className="w-full rounded-2xl border border-emerald-400/10 bg-black/45 p-7"><Block className="mb-4 h-10 w-10 rounded-full" /><Block className="mb-4 h-7 w-64 max-w-full" /><Block className="mb-3 h-4 w-full" /><Block className="h-4 w-4/5" /></div></div>
        : variant === "login"
          ? <div className="mx-auto flex min-h-[65vh] max-w-5xl items-center justify-center gap-8"><div className="hidden flex-1 space-y-4 lg:block"><Block className="h-10 w-3/4" /><Block className="h-4 w-2/3" /><Block className="h-64 rounded-2xl" /></div><FormCard compact /></div>
          : <div className="mx-auto flex min-h-[65vh] max-w-5xl items-center justify-center"><FormCard /></div>;
  return <RouteLayout narrow label={label}>{body}</RouteLayout>;
}

export function PageLoading({
  variant,
  label,
  navigation = false,
  embedded = false,
}: {
  variant: PageLoadingVariant;
  label: string;
  navigation?: boolean;
  embedded?: boolean;
}) {
  if (variant === "auth") return <RouteAuth variant="sign" label={label} />;
  if (variant === "contest-access") return <RouteAuth variant="access" label={label} />;
  if (variant === "contest-exit") return <RouteAuth variant="exit" label={label} />;
  if (variant === "device-link") return <RouteAuth variant="device-link" label={label} />;
  if (variant === "login") return <RouteAuth variant="login" label={label} />;
  if (variant === "sso-callback") return <RouteAuth variant="sso" label={label} />;

  if (embedded) {
    return (
      <div className="mx-auto w-full max-w-[1640px] px-3 sm:px-6" aria-busy="true">
        <p className="sr-only" role="status" aria-live="polite">Loading {label}</p>
        <div aria-hidden="true"><PageShape variant={variant} /></div>
      </div>
    );
  }

  return (
    <RouteLayout header={navigation} label={label}>
      <PageShape variant={variant} />
    </RouteLayout>
  );
}

export function RedirectLoading({ destination }: { destination: string }) {
  return (
    <main className="grid min-h-[40vh] place-items-center px-6" aria-busy="true">
      <p className="flex items-center gap-3 text-sm text-zinc-400" role="status" aria-live="polite">
        <span className="h-2 w-2 rounded-full bg-[#ff1018] motion-safe:animate-pulse motion-reduce:animate-none" />
        Opening {destination}…
      </p>
    </main>
  );
}

export function RootLoadingFallback() {
  return (
    <main className="grid min-h-[40vh] place-items-center px-6" aria-busy="true">
      <div className="flex items-center gap-3" role="status" aria-live="polite">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff1018] motion-safe:animate-pulse motion-reduce:animate-none" />
        <span className="text-sm text-zinc-400">Opening Mindflare Arena…</span>
      </div>
    </main>
  );
}
