'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { PersonCard } from './PersonCard';
import { TeamSectionData, Person } from '@/data/team';

interface TeamAccordionProps {
  section: TeamSectionData;
  isOpen: boolean;
  onToggle: () => void;
  onExpanded?: () => void;
  isHeadOfOperationsMoved: boolean;
  headOfOperations: Person;
}

/**
 * TeamAccordion renders an accessible collapsible accordion for a team section.
 *
 * Requirements:
 * - Soft ease animation for expansion and collapse so lower team names glide smoothly down and up.
 * - Animated '+' indicator that smoothly rotates with ease into a close indicator.
 * - Single open state maintained by parent TeamPage.
 * - Team leader has a prominent image (Tier 3).
 * - All members of society have their images visible and enlarged (Tier 4).
 * - When Media & Creative is open, Head of Operations slides in as a member
 *   with layoutId="head-of-operations-card" and hover red effect.
 */
export function TeamAccordion({
  section,
  isOpen,
  onToggle,
  onExpanded,
  isHeadOfOperationsMoved,
  headOfOperations,
}: TeamAccordionProps) {
  const prefersReducedMotion = useReducedMotion();
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
          <motion.span
            aria-hidden="true"
            className="w-6 h-6 flex items-center justify-center rounded-full border border-white/10 group-hover:border-white/30 text-[#8A8A90] group-hover:text-white transition-colors select-none"
            animate={prefersReducedMotion ? undefined : { rotate: isOpen ? 45 : 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }
            }
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current stroke-[1.75]"
              strokeLinecap="round"
            >
              <path d="M6 2V10M2 6H10" />
            </svg>
          </motion.span>
        </div>
      </button>

      {/* Accordion panel content with soft ease-style expansion and collapse */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={contentId}
            id={contentId}
            role="region"
            aria-labelledby={triggerId}
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: prefersReducedMotion
                ? { duration: 0 }
                : {
                    height: {
                      duration: 0.65,
                      ease: [0.25, 0.1, 0.25, 1],
                    },
                    opacity: {
                      duration: 0.45,
                      delay: 0.08,
                      ease: [0.25, 0.1, 0.25, 1],
                    },
                  },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: prefersReducedMotion
                ? { duration: 0 }
                : {
                    height: {
                      duration: 0.55,
                      ease: [0.25, 0.1, 0.25, 1],
                    },
                    opacity: {
                      duration: 0.25,
                      ease: [0.25, 0.1, 0.25, 1],
                    },
                  },
            }}
            className="overflow-hidden"
            onAnimationComplete={() => {
              if (isOpen && isMediaCreative) onExpanded?.();
            }}
          >
            <div className="pb-6 pt-2 flex flex-col gap-6 text-left">
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
                  {isMediaCreative && isOpen && isHeadOfOperationsMoved && (
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
