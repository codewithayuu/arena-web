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
 * PersonCard renders society members styled identically to the animation page cards.
 *
 * Hierarchy & Image sizing:
 * - Tier 1: President / Vice President (w-36 h-36 sm:w-40 sm:h-40)
 * - Tier 2: Council members (w-32 h-32 sm:w-36 sm:h-36)
 * - Tier 3: Team Leads (w-28 h-28 sm:w-32 sm:h-32)
 * - Tier 4: Society Members (w-20 h-20 sm:w-24 sm:h-24 - enlarged from 56px to 80-96px)
 *
 * Card Styling (from animation page):
 * - Rounded-2xl with subtle border-white/10 and pure black background
 * - Ambient radial and gradient red-black hover aura
 * - Bottom red accent line expanding on hover
 * - Top bar with portrait image on left and cyberpunk badge on right
 * - Bold title that turns red on hover
 * - Footer with social links and department/wing tag
 *
 * Head of Operations easter egg:
 * - Duotone red portrait overlay and "Scolded by Vice President" label on hover
 * - Red border & vibrant drop-shadow glow
 * - Smooth layout transition when sliding between Council and Media & Creative
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

  // Shared layout transition for smooth sliding (slow and graceful for Head of Operations)
  const layoutTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: 1.1,
        ease: [0.25, 0.1, 0.25, 1],
      };

  // Determine portrait image sizing based on tier
  const getImageSizeClass = () => {
    switch (tier) {
      case 1:
        return 'w-36 h-36 sm:w-40 sm:h-40';
      case 2:
        return 'w-32 h-32 sm:w-36 sm:h-36';
      case 3:
        return 'w-28 h-28 sm:w-32 sm:h-32';
      case 4:
      default:
        // Noticeable boost for society members from 56px to 80-96px
        return 'w-20 h-20 sm:w-24 sm:h-24';
    }
  };

  // Portrait block
  const renderPortrait = () => {
    const sizeClasses = getImageSizeClass();
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-2xl bg-black border transition-all duration-300 group-hover:scale-105 ${sizeClasses} ${
          isOpHead
            ? 'border-white/10 group-hover:border-[#E5322D] group-hover:shadow-[0_0_25px_rgba(229,50,45,0.4)]'
            : 'border-white/10 group-hover:border-red-600/50'
        }`}
      >
        {person.photo ? (
          <motion.img
            src={person.photo}
            alt={person.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 ${
              isOpHead ? 'group-hover:contrast-125' : ''
            }`}
            whileHover={
              isOpHead && !prefersReducedMotion
                ? {
                    x: [0, -2, 2, -2, 2, 0],
                    rotate: [0, -1, 1, -1, 1, 0],
                    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
                  }
                : undefined
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-400 font-semibold text-base transition-colors duration-200 group-hover:text-white">
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
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 px-2 text-center text-xs font-bold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              Scolded by Vice President
            </div>
          </>
        )}

        {/* Team Leader indicator badge */}
        {tier === 3 && (
          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-md">
            Lead
          </div>
        )}
      </div>
    );
  };

  // Cyberpunk badge matching animation page styling
  const renderBadge = () => {
    if (isOpHead) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border border-red-600/50 bg-gradient-to-r from-red-950/60 to-black text-red-400 font-mono tracking-wide">
          Operations
        </span>
      );
    }

    if (person.isPresident) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border border-red-600/40 bg-gradient-to-r from-red-950/60 to-black text-red-400 font-mono tracking-wide">
          President
        </span>
      );
    }

    if (person.isVicePresident) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border border-red-600/40 bg-gradient-to-r from-red-950/60 to-black text-red-400 font-mono tracking-wide">
          Vice President
        </span>
      );
    }

    if (tier === 1 || tier === 2) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border border-red-600/40 bg-gradient-to-r from-red-950/60 to-black text-red-400 font-mono tracking-wide">
          Council
        </span>
      );
    }

    if (tier === 3 || person.isHead) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border border-red-600/40 bg-gradient-to-r from-red-950/60 to-black text-red-400 font-mono tracking-wide">
          Team Lead
        </span>
      );
    }

    // Tier 4: Society Member
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border border-white/10 bg-black text-zinc-400 font-mono tracking-wide max-w-[140px] truncate">
        {person.team || 'Member'}
      </span>
    );
  };

  // Social links rendering matching animation page footer
  const renderLinks = () => {
    const links = person.links;
    const hasAnyLink = Boolean(links?.github || links?.linkedin || links?.codeforces);

    if (!hasAnyLink) {
      return (
        <span className="font-mono text-zinc-600 text-xs">
          Mindflare
        </span>
      );
    }

    return (
      <div className="flex items-center gap-3">
        {links?.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-red-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 transition-colors"
            aria-label={`${person.name}'s GitHub`}
          >
            <FaGithub aria-hidden="true" size={15} />
          </a>
        )}
        {links?.linkedin && (
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-red-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 transition-colors"
            aria-label={`${person.name}'s LinkedIn`}
          >
            <FaLinkedinIn aria-hidden="true" size={15} />
          </a>
        )}
        {links?.codeforces && (
          <a
            href={links.codeforces}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-red-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 transition-colors"
            aria-label={`${person.name}'s Codeforces`}
          >
            <SiCodeforces aria-hidden="true" size={15} />
          </a>
        )}
      </div>
    );
  };

  const cardContent = (
    <article
      className={`group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-black p-5 sm:p-6 transition-all duration-300 hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-950/20 hover:-translate-y-1 overflow-hidden w-full text-left ${
        isOpHead
          ? 'hover:border-[#E5322D] hover:shadow-[0_0_35px_rgba(229,50,45,0.4)] hover:bg-[#E5322D]/[0.03]'
          : ''
      } ${className}`}
    >
      {/* Ambient Red-Black Gradient Glow Effect on hover (Animation Page style) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-red-600/10 via-red-950/5 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br from-red-600/20 via-black to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col flex-1 justify-between">
        <div>
          {/* Top Bar with Avatar & Cyberpunk Badge */}
          <div className="mb-4 flex items-start justify-between gap-3">
            {renderPortrait()}
            <div className="shrink-0">{renderBadge()}</div>
          </div>

          {/* Name & Role */}
          <div className="mb-4">
            <h3
              className={`text-lg sm:text-xl font-bold transition-colors duration-200 line-clamp-1 ${
                isOpHead
                  ? 'text-white group-hover:text-[#E5322D]'
                  : 'text-white group-hover:text-red-400'
              }`}
            >
              {person.name}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed capitalize mt-1 line-clamp-2">
              {effectiveRole}
            </p>
          </div>
        </div>

        {/* Bottom Footer: Social Links & Wing Tag */}
        <div className="relative z-10 mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          {renderLinks()}
          <span className="font-mono text-zinc-500 text-[11px] tracking-wider uppercase">
            {person.wing ? `${person.wing} Wing` : 'Mindflare'}
          </span>
        </div>
      </div>

      {/* Red-Black gradient accent line on hover */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-red-600 via-red-500 to-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
    </article>
  );

  if (layoutId) {
    return (
      <motion.div
        layoutId={layoutId}
        transition={layoutTransition}
        className="w-full h-full flex"
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}
