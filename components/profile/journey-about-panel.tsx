"use client";

import React from "react";
import { UserProfileData } from "@/lib/profile-data";
import { GraduationCap, FolderGit2 } from "lucide-react";
import { Briefcase, ExternalLink, Calendar, Code } from "@/components/animate-ui/icons";

interface JourneyAboutPanelProps {
  profile: UserProfileData;
}

export function JourneyAboutPanel({ profile }: JourneyAboutPanelProps) {
  return (
    <div className="space-y-6">
      {/* 1. Education Section */}
      <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <GraduationCap className="w-4 h-4 text-[#ff1018]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Education
          </h2>
        </div>

        <div className="space-y-3">
          {profile.education.map((edu) => (
            <div
              key={edu.id}
              className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <h3 className="text-sm font-extrabold text-white">{edu.institution}</h3>
                <p className="text-xs text-zinc-300 mt-0.5">
                  {edu.degree} in {edu.fieldOfStudy}
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black border border-white/10 text-xs font-mono text-zinc-400">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>{edu.startYear} – {edu.endYear}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Projects Showcase */}
      <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <FolderGit2 className="w-4 h-4 text-[#ff1018]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Highlighted Projects
          </h2>
        </div>

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
                <p className="text-xs font-medium text-[#ff4452] mb-2">{proj.tagline}</p>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {proj.description}
                </p>
              </div>

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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
