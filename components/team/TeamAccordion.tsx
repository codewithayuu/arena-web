'use client';

import React from 'react';
import { PersonCard } from './PersonCard';
import { TeamSectionData, Person } from '@/data/team';

interface TeamAccordionProps {
  section: TeamSectionData;
  isOpen: boolean;
  onToggle: () => void;
  headOfOperations: Person;
}

/**
 * TeamAccordion renders an accessible collapsible accordion for a team section.
 *
 * Requirements:
 * - Team leader has a prominent image (Tier 3).
 * - All members of society have their images visible and enlarged (Tier 4).
 * - When Media & Creative is open, Head of Operations slides in as a member
 *   with layoutId="head-of-operations-card" and hover red effect.
 * - Font matches the website font (no JetBrains Mono).
 */
export function TeamAccordion({
  section,
  isOpen,
  onToggle,
  headOfOperations,
}: TeamAccordionProps) {
  const isMediaCreative = section.id === 'media&creative';
  const contentId = `team-content-${section.id}`;
  const triggerId = `team-trigger-${section.id}`;

  return (
    <div className="w-full border-b border-white/10 last:border-b-0">
      <button
        id={triggerId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3DA9FC] group"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 min-w-0">
          <span className="text-lg sm:text-xl font-bold text-[#F2F2EE] group-hover:text-white transition-colors">
            {section.name}
          </span>
          {section.head && (
            <span className="text-xs sm:text-sm text-[#8A8A90] font-normal truncate">
              head: {section.head.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <span className="text-xs sm:text-sm text-[#8A8A90] font-medium">
            {section.totalCount + (isMediaCreative && isOpen ? 1 : 0)}{' '}
            {section.totalCount + (isMediaCreative && isOpen ? 1 : 0) === 1 ? 'member' : 'members'}
          </span>
          <span
            aria-hidden="true"
            className="text-lg font-light text-[#8A8A90] w-6 h-6 flex items-center justify-center rounded-full border border-white/10 group-hover:border-white/30 group-hover:text-white transition-all select-none"
          >
            {isOpen ? '−' : '+'}
          </span>
        </div>
      </button>

      {/* Accordion panel content */}
      {isOpen && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          className="pb-6 pt-2 flex flex-col gap-6 text-left"
        >
          {/* ─── Team Leader (Bigger Image) ─────────────────────────────────── */}
          {section.head && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                Team Lead
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PersonCard person={section.head} tier={3} />
              </div>
            </div>
          )}

          {/* ─── Team Members (Enlarged Images & Animation Card Style) ──────── */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
              Members
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.members.map((member) => (
                <PersonCard
                  key={member.id}
                  person={member}
                  tier={4}
                />
              ))}
              {isMediaCreative && isOpen && (
                <PersonCard
                  person={headOfOperations}
                  tier={4}
                  layoutId="head-of-operations-card"
                  displayRole="Creative artist"
                  isOperationalHead
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
