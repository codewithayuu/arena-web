"use client";

import React from "react";
import { UserProfileData } from "@/lib/profile-data";
import { GitCommit, GitPullRequest } from "lucide-react";
import { Star, ExternalLink, Calendar, Activity } from "@/components/animate-ui/icons";

interface DevelopmentPanelProps {
  profile: UserProfileData;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  Python: "#3572a5",
  CSS: "#563d7c",
  PLpgSQL: "#336791",
};

export function DevelopmentPanel({ profile }: DevelopmentPanelProps) {
  const { github } = profile;

  if (!github.githubProfile) {
    return (
      <section className="rounded-2xl border border-white/10 bg-black p-6 text-white">
        <h2 className="text-sm font-bold uppercase tracking-wider">GitHub development profile</h2>
        <p className="mt-2 text-sm text-zinc-400">Connect and verify GitHub to load public repositories, stars, followers, and language data.</p>
      </section>
    );
  }

  // Calculate language percentages
  const totalBytes = Object.values(github.languages).reduce((a, b) => a + b, 0) || 1;
  const languagesSorted = Object.entries(github.languages)
    .map(([lang, bytes]) => ({
      name: lang,
      bytes,
      pct: Math.round((bytes / totalBytes) * 100),
      color: LANGUAGE_COLORS[lang] || "#8b5cf6",
    }))
    .sort((a, b) => b.bytes - a.bytes);
  const activityDays = Array.from({ length: 30 }, (_, index) => {
    const timestamp = Date.now() - (29 - index) * 86_400_000;
    const date = new Date(timestamp).toISOString().slice(0, 10);
    return { date, events: github.publicActivityByDay[date] ?? 0 };
  });

  return (
    <div className="space-y-6">
      {/* 1. Top Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="rounded-2xl border border-white/10 bg-black p-4 shadow-xl hover:border-white/20 transition-all">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            <Activity className="w-4 h-4 text-[#ff1018]" />
            <span>Public Repositories</span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-0.5 tabular-nums">
            {github.publicRepos ?? "—"}
          </div>
          <span className="text-[10px] font-mono text-zinc-400 mt-0.5 block">Owned public repositories</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-4 shadow-xl hover:border-white/20 transition-all">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            <GitCommit className="w-4 h-4 text-emerald-400" />
            <span>Repository Stars</span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-0.5 tabular-nums">
            {github.totalStars ?? "—"}
          </div>
          <span className="text-[10px] font-mono text-zinc-400 mt-0.5 block">Within {github.sampledRepositories ?? 0} fetched repositories</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-4 shadow-xl hover:border-white/20 transition-all">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            <GitPullRequest className="w-4 h-4 text-purple-400" />
            <span>Followers</span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-0.5 tabular-nums">
            {github.followers ?? "—"}
          </div>
          <span className="text-[10px] font-mono text-zinc-400 mt-0.5 block">Public GitHub account</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-4 shadow-xl hover:border-white/20 transition-all">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Following</span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-0.5 inline-flex items-baseline gap-0.5 tabular-nums">
            <span>{github.following ?? "—"}</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 mt-0.5 block">Public GitHub account</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-4 shadow-xl hover:border-white/20 transition-all">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Public Events · 30d</span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-0.5 tabular-nums">
            {github.publicActivityAvailable ? github.recentPublicEvents ?? 0 : "—"}
          </div>
          <span className="text-[10px] font-mono text-zinc-400 mt-0.5 block">Latest public activity, limited by GitHub</span>
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-3 mb-4 pb-2 border-b border-white/10">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent public activity</h2>
            <p className="text-xs text-zinc-400 mt-0.5">GitHub public events during the last 30 days (up to {github.publicActivityEventLimit ?? 100} events)</p>
          </div>
          <span className="text-xs font-mono text-zinc-400">{github.recentPublicActiveDays ?? "—"} active days</span>
        </div>
        {github.publicActivityAvailable ? (
          <div className="grid grid-cols-10 sm:grid-cols-[repeat(15,minmax(0,1fr))] gap-1.5" aria-label="GitHub public activity by day for the last 30 days">
            {activityDays.map(({ date, events }) => (
              <div key={date} title={`${date}: ${events} public events`} className={`h-5 rounded-sm border border-white/5 ${events === 0 ? "bg-[#141418]" : events < 3 ? "bg-emerald-900" : events < 8 ? "bg-emerald-600" : "bg-emerald-400"}`} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-white/10 bg-[#0d0d12] p-4 text-sm text-zinc-400">Public activity data is unavailable. The account summary remains available when GitHub&apos;s API rate limit resets.</p>
        )}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-400">
          <span>Pushes: <strong className="text-white">{github.recentPublicPushes ?? "—"}</strong></span>
          <span>Commits: <strong className="text-white">{github.recentPublicCommits ?? "—"}</strong></span>
          <span>Pull requests: <strong className="text-white">{github.recentPublicPullRequests ?? "—"}</strong></span>
          <span>Issues: <strong className="text-white">{github.recentPublicIssues ?? "—"}</strong></span>
        </div>
      </section>

      {/* 2. Language Distribution */}
      <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Language Distribution
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Count of owned public repositories by primary language</p>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            User: <strong className="text-white">@{github.githubProfile}</strong>
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="h-3 w-full rounded-full bg-zinc-900 overflow-hidden flex mb-4 border border-zinc-800">
          {languagesSorted.map((l) => (
            <div
              key={l.name}
              style={{ width: `${l.pct}%`, backgroundColor: l.color }}
              className="h-full transition-all"
              title={`${l.name}: ${l.pct}%`}
            />
          ))}
        </div>

        {/* Legend Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {languagesSorted.map((l) => (
            <div
              key={l.name}
              className="p-2.5 rounded-xl border border-zinc-800 bg-[#141418] flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                <span className="text-xs font-bold text-white">{l.name}</span>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-400">{l.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Featured Repositories */}
      <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Featured Repositories
          </h2>
          <a
            href={`https://github.com/${github.githubProfile}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#ff4452] hover:underline flex items-center gap-1"
          >
            <span>View All on GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {github.topRepos.map((repo) => (
            <div
              key={repo.name}
              className="p-4 rounded-xl border border-white/10 bg-[#0d0d12] hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-white hover:text-[#38bdf8] transition-colors truncate"
                  >
                    {repo.name}
                  </a>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span>{repo.stars}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                  {repo.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-zinc-800/80">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || "#fff" }}
                  />
                  <span>{repo.language}</span>
                </span>
                <span className="text-zinc-500">Public Repo</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
