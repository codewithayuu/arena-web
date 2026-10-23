'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import { motion, type Transition } from 'motion/react';
import { SlidingNumber } from './sliding-number';
import { SimpleTooltip } from './tooltip';

export interface AnimatePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const SPRING_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 26,
};

const BUTTON_MOTION = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.94 },
};

/**
 * Animate UI Pagination Component
 * Features Animate UI motion spring physics, active indicator layoutId sliding transitions,
 * SlidingNumber counter, quick jump input, and responsive layout.
 */
export function AnimatePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className = '',
}: AnimatePaginationProps) {
  const [jumpPage, setJumpPage] = React.useState('');

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate pagination items with smart ellipsis
  const pageNumbers = React.useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items: (number | 'ellipsis-prev' | 'ellipsis-next')[] = [];

    // Always include page 1
    items.push(1);

    if (currentPage > 4) {
      items.push('ellipsis-prev');
    }

    // Neighbors around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let p = start; p <= end; p++) {
      if (!items.includes(p)) {
        items.push(p);
      }
    }

    if (currentPage < totalPages - 3) {
      items.push('ellipsis-next');
    }

    // Always include last page
    if (!items.includes(totalPages)) {
      items.push(totalPages);
    }

    return items;
  }, [currentPage, totalPages]);

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPage, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      onPageChange(p);
      setJumpPage('');
    }
  };

  if (totalPages <= 1 && totalItems <= pageSize) {
    return (
      <div className={`flex items-center justify-between py-4 text-xs text-muted-foreground ${className}`}>
        <span>
          Showing all <span className="font-semibold text-foreground">{totalItems}</span> problems
        </span>
        <span className="px-2.5 py-1 rounded-md bg-muted/50 border border-border/40 font-mono text-[11px]">
          {pageSize} per page
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 pt-5 border-t border-border/80 ${className}`}
    >
      {/* Left: Summary Info */}
      <div className="flex items-center gap-2.5 text-xs text-muted-foreground order-2 sm:order-1">
        <span>
          Showing{' '}
          <span className="font-semibold text-foreground tabular-nums">
            {startItem}–{endItem}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-foreground tabular-nums">
            {totalItems}
          </span>{' '}
          problems
        </span>

        <span className="text-border">•</span>

        <span className="hidden md:inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground/80">
          Page <SlidingNumber number={currentPage} className="text-foreground font-semibold" /> of{' '}
          <span className="font-semibold text-foreground">{totalPages}</span>
        </span>
      </div>

      {/* Center / Right: Animate UI Pagination Controls */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 order-1 sm:order-2">
        {/* First Page Button */}
        <SimpleTooltip content="First page">
          <motion.button
            type="button"
            {...BUTTON_MOTION}
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
            aria-label="First page"
            className="w-8 h-8 rounded-lg border border-border bg-card/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </motion.button>
        </SimpleTooltip>

        {/* Previous Page Button */}
        <SimpleTooltip content="Previous page">
          <motion.button
            type="button"
            {...BUTTON_MOTION}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
            className="h-8 px-2.5 rounded-lg border border-border bg-card/60 flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Prev</span>
          </motion.button>
        </SimpleTooltip>

        {/* Page Numbers with Animate UI Sliding Indicator */}
        <div className="flex items-center gap-1 bg-muted/20 p-0.5 rounded-lg border border-border/40">
          {pageNumbers.map((item, index) => {
            if (item === 'ellipsis-prev') {
              return (
                <SimpleTooltip key={`ellipsis-prev-${index}`} content="Jump 5 pages back">
                  <button
                    type="button"
                    onClick={() => onPageChange(Math.max(1, currentPage - 5))}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-md transition-colors"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </SimpleTooltip>
              );
            }

            if (item === 'ellipsis-next') {
              return (
                <SimpleTooltip key={`ellipsis-next-${index}`} content="Jump 5 pages forward">
                  <button
                    type="button"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 5))}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-md transition-colors"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </SimpleTooltip>
              );
            }

            const pageNum = item;
            const isActive = pageNum === currentPage;

            return (
              <motion.button
                key={pageNum}
                type="button"
                {...BUTTON_MOTION}
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative w-8 h-8 rounded-md text-xs font-medium transition-colors flex items-center justify-center tabular-nums ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                {/* Animate UI Animated Active Background Pill */}
                {isActive && (
                  <motion.div
                    layoutId="active-pagination-indicator"
                    transition={SPRING_TRANSITION}
                    className="absolute inset-0 rounded-md bg-[#e83040] shadow-sm shadow-[#e83040]/40 z-0"
                  />
                )}
                <span className="relative z-10">{pageNum}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <SimpleTooltip content="Next page">
          <motion.button
            type="button"
            {...BUTTON_MOTION}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
            className="h-8 px-2.5 rounded-lg border border-border bg-card/60 flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </SimpleTooltip>

        {/* Last Page Button */}
        <SimpleTooltip content="Last page">
          <motion.button
            type="button"
            {...BUTTON_MOTION}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
            aria-label="Last page"
            className="w-8 h-8 rounded-lg border border-border bg-card/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </motion.button>
        </SimpleTooltip>
      </div>

      {/* Right: Quick Jump Form & Page Size */}
      <div className="flex items-center gap-2 order-3">
        {totalPages > 3 && (
          <form onSubmit={handleJumpSubmit} className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Go to</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder={String(currentPage)}
              className="w-12 h-7 px-1.5 py-0.5 rounded-md border border-border bg-background text-foreground text-center text-xs focus:outline-none focus:ring-1 focus:ring-[#e83040] tabular-nums"
            />
            <button
              type="submit"
              className="h-7 px-2 rounded-md border border-border bg-card hover:bg-muted text-[11px] font-medium text-foreground transition-colors"
            >
              Go
            </button>
          </form>
        )}

        <span className="text-[11px] font-mono px-2 py-1 rounded-md bg-muted/40 border border-border/40 text-muted-foreground">
          {pageSize} / page
        </span>
      </div>
    </div>
  );
}
