'use client';

import React from 'react';
import { motion, useReducedMotion, type Transition } from 'motion/react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import { SiCodeforces } from 'react-icons/si';
import { Person } from '@/data/team';

interface PersonCardProps {
  person: Person;
  tier: 1 | 2 | 3 | 4;
  layoutId?: string;
  isOperationalHead?: boolean;
  displayRole?: string;
  embedded?: boolean;
  className?: string;
}

/**
 * Extracts initials from person's name for fallback grayscale block.
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * PersonCard renders society members across hierarchy tiers using the site's default font.
 *
 * Tier 2: Council members (General Secretary, Executive, Technical Head, Head of Operations)
 * Tier 3: Team Leaders / Heads (Bigger portrait image, prominent presentation)
 * Tier 4: Society Members (All have visible portrait images)
 *
 * Head of Operations:
 * - On hover, card turns red with a vibrant glow, duotone red portrait filter, and red accents.
 * - Smoothly slides to/from Media & Creative as a member via layoutId.
 */
export function PersonCard({
  person,
  tier,
  layoutId,
  isOperationalHead = false,
  displayRole,
  embedded = false,
  className = '',
}: PersonCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const effectiveRole = displayRole || person.role;
  const isOpHead = isOperationalHead || person.isOperationalHead;

  // Shared layout transition for smooth sliding
  const layoutTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : {
        type: 'spring',
        stiffness: 280,
        damping: 30,
        mass: 0.9,
      };

  // Reusable portrait block
  const renderPortrait = (
    sizeClasses: string,
    extraClasses = '',
    options?: { isLeader?: boolean }
  ) => {
    return (
      <div
        className={`relative shrink-0 overflow-hidden bg-[#141418] border transition-all duration-300 ${sizeClasses} ${extraClasses} ${
          isOpHead
            ? 'border-white/10 group-hover:border-[#E5322D] group-hover:shadow-[0_0_25px_rgba(229,50,45,0.4)]'
            : 'border-white/10 group-hover:border-[#E5322D]/60'
        }`}
      >
        {person.photo ? (
          <motion.img
            src={person.photo}
            alt={person.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-300 grayscale group-hover:grayscale-0 ${
              isOpHead ? 'group-hover:contrast-125' : ''
            }`}
            whileHover={
              isOpHead && !prefersReducedMotion
                ? {
                    x: [0, -2, 2, -2, 2, 0],
                    rotate: [0, -1, 1, -1, 1, 0],
                    transition: { duration: 0.35, repeat: Infinity },
                  }
                : undefined
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#17171c] text-[#8A8A90] font-semibold text-sm transition-colors duration-200 group-hover:text-[#F2F2EE]">
            {getInitials(person.name)}
          </div>
        )}

        {/* Head of Operations: Red duotone overlay layers activated on hover */}
        {isOpHead && (
          <>
            <div
              className="absolute inset-0 bg-[#E5322D] mix-blend-multiply opacity-0 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-[#E5322D] mix-blend-screen opacity-0 group-hover:opacity-65 transition-opacity duration-300 pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 ring-2 ring-inset ring-[#E5322D] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              aria-hidden="true"
            />
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/55 px-2 text-center text-xs font-bold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              Scolded by Vice President
            </div>
          </>
        )}

        {/* Team Leader indicator badge */}
        {options?.isLeader && (
          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#E5322D] text-white text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-md">
            Lead
          </div>
        )}
      </div>
    );
  };

  // Reusable links rendering
  const renderLinks = (compact = false) => {
    if (!person.links) return null;
    const { github, linkedin, codeforces } = person.links;
    if (!github && !linkedin && !codeforces) return null;

    return (
      <div className={`flex items-center gap-3 ${compact ? 'text-xs' : 'text-xs'} pt-2`}>
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3DA9FC] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3DA9FC] transition-colors"
            aria-label={`${person.name}'s GitHub`}
          >
            <FaGithub aria-hidden="true" size={16} />
          </a>
        )}
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3DA9FC] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3DA9FC] transition-colors"
            aria-label={`${person.name}'s LinkedIn`}
          >
            <FaLinkedinIn aria-hidden="true" size={16} />
          </a>
        )}
        {codeforces && (
          <a
            href={codeforces}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3DA9FC] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3DA9FC] transition-colors"
            aria-label={`${person.name}'s Codeforces`}
          >
            <SiCodeforces aria-hidden="true" size={16} />
          </a>
        )}
      </div>
    );
  };

  // ─── TIER 2 / COUNCIL CARD ────────────────────────────────────────────────
  if (tier === 1 || tier === 2) {
    const cardContent = (
      <article
        className={`group flex flex-col justify-between w-full h-full text-left transition-all duration-300 ${
          embedded
            ? ''
            : 'p-6 bg-[#111115] border border-white/10 rounded-xl'
        } ${
          isOpHead
            ? 'hover:border-[#E5322D] hover:shadow-[0_0_35px_rgba(229,50,45,0.35)] hover:bg-[#E5322D]/[0.03]'
            : 'hover:border-white/20'
        } ${className}`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            {renderPortrait('w-28 h-28 sm:w-32 sm:h-32 rounded-lg')}
            {isOpHead && (
              <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md border border-white/10 text-[#8A8A90] group-hover:border-[#E5322D] group-hover:text-[#E5322D] group-hover:bg-[#E5322D]/10 transition-all duration-300">
                Operations
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 pt-1">
            <h3
              className={`text-xl sm:text-2xl font-bold leading-tight tracking-tight break-words transition-colors duration-300 ${
                isOpHead ? 'text-[#F2F2EE] group-hover:text-[#E5322D]' : 'text-[#F2F2EE]'
              }`}
            >
              {person.name}
            </h3>
            <p className="text-sm font-medium text-[#8A8A90] capitalize">
              {effectiveRole}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 mt-4">
          {renderLinks()}
        </div>
      </article>
    );

    if (layoutId) {
      return (
        <motion.div
          layoutId={layoutId}
          transition={layoutTransition}
          className="w-full h-full"
        >
          {cardContent}
        </motion.div>
      );
    }

    return cardContent;
  }

  // ─── TIER 3: TEAM LEADER (BIGGER IMAGE) ───────────────────────────────────
  if (tier === 3) {
    const cardContent = (
      <article
        className={`group flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-[#141419] border rounded-xl w-full text-left transition-all duration-300 ${
          isOpHead
            ? 'border-[#E5322D]/50 hover:border-[#E5322D] hover:shadow-[0_0_35px_rgba(229,50,45,0.4)] hover:bg-[#E5322D]/[0.04]'
            : 'border-white/10 hover:border-white/20'
        } ${className}`}
      >
        {/* Team leader has a bigger image: w-24 h-24 sm:w-28 sm:h-28 */}
        {renderPortrait('w-24 h-24 sm:w-28 sm:h-28 rounded-lg', '', { isLeader: true })}

        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E5322D]/15 text-[#E5322D] border border-[#E5322D]/30">
              Team Lead
            </span>
            {isOpHead && (
              <span className="text-[11px] font-medium text-[#8A8A90] italic">
                (Council relocated)
              </span>
            )}
          </div>

          <h4
            className={`text-lg sm:text-xl font-bold leading-snug truncate transition-colors duration-300 ${
              isOpHead ? 'text-[#F2F2EE] group-hover:text-[#E5322D]' : 'text-[#F2F2EE]'
            }`}
          >
            {person.name}
          </h4>

          <p className="text-sm font-medium text-[#8A8A90] capitalize truncate">
            {effectiveRole}
          </p>

          {renderLinks(true)}
        </div>
      </article>
    );

    if (layoutId) {
      return (
        <motion.div
          layoutId={layoutId}
          transition={layoutTransition}
          className="w-full"
        >
          {cardContent}
        </motion.div>
      );
    }

    return cardContent;
  }

  // ─── TIER 4: SOCIETY MEMBERS (ALL HAVE VISIBLE IMAGES) ────────────────────
  const cardContent = (
    <article
      className={`group flex items-center gap-3.5 p-3 rounded-lg bg-[#111115]/80 hover:bg-[#14141a] border border-white/5 hover:border-white/15 transition-all duration-200 text-left ${className}`}
    >
      {/* Member portrait image (always visible) */}
      {renderPortrait('w-14 h-14 sm:w-16 sm:h-16 rounded-md')}

      <div className="flex flex-col min-w-0 flex-1">
        <h5 className="text-sm sm:text-base font-semibold text-[#F2F2EE] group-hover:text-white truncate">
          {person.name}
        </h5>
        <p className="text-xs text-[#8A8A90] truncate capitalize">
          {effectiveRole}
        </p>
        {renderLinks(true)}
      </div>
    </article>
  );

  if (layoutId) {
    return (
      <motion.div
        layoutId={layoutId}
        transition={layoutTransition}
        className="w-full"
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}
