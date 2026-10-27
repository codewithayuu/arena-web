"use client";

import React from "react";
import { UserProfileData } from "@/lib/profile-data";
import { GraduationCap, FolderGit2 } from "lucide-react";
import { ExternalLink, Calendar, User, Star, Sparkles } from "@/components/animate-ui/icons";

interface JourneyAboutPanelProps {
  profile: UserProfileData;
  isOwner?: boolean;
  onOpenEdit?: () => void;
  onOpenConnect?: () => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  Python: "#3572a5",
  CSS: "#563d7c",
  Rust: "#dea584",
  Go: "#00add8",
  Java: "#b07219",
};

export function JourneyAboutPanel({
  profile,
  isOwner = false,
  onOpenEdit,
  onOpenConnect,
}: JourneyAboutPanelProps) {
  const bio = profile.personalDetails.bio?.trim();
  const hasEducation = profile.education && profile.education.length > 0;
  const hasProjects = profile.projects && profile.projects.length > 0;
  const githubRepos = profile.github?.topRepos ?? [];
  const hasGithubRepos = githubRepos.length > 0;

  return (
    <div className="space-y-4 font-poppins">
      {/* 1. About Me / Bio Section */}
      <div className="rounded-xl border border-white/10 bg-black p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#ff1018]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              About Me
            </h2>
          </div>
          {isOwner && onOpenEdit && (
            <button
              type="button"
              onClick={onOpenEdit}
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              {bio ? "Edit Bio" : "Add Bio"}
            </button>
          )}
        </div>

        {bio ? (
          <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c]">
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {bio}
            </p>
          </div>
        ) : (
          <div className="py-6 px-4 rounded-xl border border-dashed border-white/10 bg-[#0a0a0c]/50 text-center">
            <p className="text-xs text-zinc-400">
              {isOwner
                ? "Share a summary of your journey, technical interests, or career objectives."
                : "No bio has been added yet."}
            </p>
            {isOwner && onOpenEdit && (
              <button
                type="button"
                onClick={onOpenEdit}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ff1018]" />
                <span>Add Bio</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Education Section */}
      <div className="rounded-xl border border-white/10 bg-black p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#ff1018]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Education
            </h2>
          </div>
          {isOwner && onOpenEdit && (
            <button
              type="button"
              onClick={onOpenEdit}
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Edit Details
            </button>
          )}
        </div>

        {hasEducation ? (
          <div className="space-y-3">
            {profile.education.map((edu) => (
              <div
                key={edu.id}
                className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-extrabold text-white">{edu.institution}</h3>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    {edu.degree && edu.fieldOfStudy
                      ? `${edu.degree} in ${edu.fieldOfStudy}`
                      : edu.fieldOfStudy || edu.degree || "Student"}
                  </p>
                </div>
                {(edu.startYear || edu.endYear) && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black border border-white/10 text-xs font-mono text-zinc-400 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{edu.startYear} – {edu.endYear}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 px-4 rounded-xl border border-dashed border-white/10 bg-[#0a0a0c]/50 text-center">
            <p className="text-xs text-zinc-400">
              {isOwner
                ? "No academic details found. Update your profile with your college and branch."
                : "No education details added yet."}
            </p>
            {isOwner && onOpenEdit && (
              <button
                type="button"
                onClick={onOpenEdit}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#ff1018]" />
                <span>Add Education</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Projects Showcase */}
      <div className="rounded-xl border border-white/10 bg-black p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-[#ff1018]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Highlighted Projects
            </h2>
          </div>
          {isOwner && onOpenConnect && (
            <button
              type="button"
              onClick={onOpenConnect}
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Manage Repos
            </button>
          )}
        </div>

        {hasProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c] hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-sm font-extrabold text-white">{proj.title}</h3>
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  {proj.tagline && <p className="text-xs font-medium text-[#ff4452] mb-2">{proj.tagline}</p>}
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    {proj.description}
                  </p>
                </div>

                {proj.builtWith && proj.builtWith.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800/80">
                    {proj.builtWith.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : hasGithubRepos ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {githubRepos.map((repo) => (
              <div
                key={repo.name}
                className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c] hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-white hover:text-[#38bdf8] transition-colors truncate max-w-[80%]"
                    >
                      {repo.name}
                    </a>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>{repo.stars}</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                    {repo.description || "Public repository on GitHub"}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || "#fff" }}
                    />
                    <span>{repo.language || "Code"}</span>
                  </span>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white transition-colors"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 px-4 rounded-xl border border-dashed border-white/10 bg-[#0a0a0c]/50 text-center">
            <p className="text-xs text-zinc-400">
              {isOwner
                ? "Connect your GitHub account in Connected Accounts to automatically showcase your top repositories here."
                : "No highlighted projects to display yet."}
            </p>
            {isOwner && onOpenConnect && (
              <button
                type="button"
                onClick={onOpenConnect}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-[#ff1018]" />
                <span>Connect GitHub</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
