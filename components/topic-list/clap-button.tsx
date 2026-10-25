'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SimpleTooltip } from '@/components/animate-ui/tooltip';
import { Sparkles } from '@/components/animate-ui/icons';
import { cn } from '@/lib/utils';

export interface ClapButtonProps {
  count: number;
  onClap: () => boolean | Promise<boolean>;
  disabled?: boolean;
  className?: string;
}

interface ClapBubble {
  id: number;
  x: number;
  label: string;
}

export function ClapButton({ count, onClap, disabled = false, className }: ClapButtonProps) {
  const [bubbles, setBubbles] = useState<ClapBubble[]>([]);
  const [isClapping, setIsClapping] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const clapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;
      if (!(await onClap())) return;

      // Trigger pop wobble animation
      setIsClapping(true);
      if (clapTimeoutRef.current) clearTimeout(clapTimeoutRef.current);
      clapTimeoutRef.current = setTimeout(() => setIsClapping(false), 350);

      // Spawn a floating bubble with a slight random horizontal offset
      const newBubble: ClapBubble = {
        id: Date.now() + Math.random(),
        x: (Math.random() - 0.5) * 20,
        label: '+1',
      };
      setBubbles((prev) => [...prev.slice(-5), newBubble]);

      // Remove bubble after animation finishes
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
      }, 850);

      // Micro confetti burst directly above the button
      try {
        const rect = buttonRef.current?.getBoundingClientRect();
        if (rect && typeof window !== 'undefined') {
          const x = (rect.left + rect.width / 2) / (window.innerWidth || 1);
          const y = (rect.top + rect.height / 2) / (window.innerHeight || 1);
          const { default: confetti } = await import('canvas-confetti');
          confetti({
            particleCount: 14,
            spread: 45,
            startVelocity: 16,
            origin: { x, y: Math.max(0.02, y - 0.02) },
            colors: ['#FACC15', '#F59E0B', '#FF5466', '#FFFFFF'],
            ticks: 75,
            gravity: 1.25,
            scalar: 0.65,
            shapes: ['circle'],
          });
        }
      } catch {
        // ignore
      }
    },
    [disabled, onClap]
  );

  return (
    <SimpleTooltip content={disabled ? "Sign in to clap" : "Add one clap to the community total"}>
      <div className="relative inline-flex">
        {/* Floating pop-up bubbles */}
        <AnimatePresence>
          {bubbles.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 0, scale: 0.6, x: b.x }}
              animate={{ opacity: [0, 1, 1, 0], y: -34, scale: [0.6, 1.25, 1, 0.8] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 z-30 select-none"
            >
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1c1408] border border-amber-500/40 text-amber-300 font-mono font-bold text-[10px] shadow-[0_4px_14px_rgba(245,158,11,0.3)] backdrop-blur-md">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>{b.label}</span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Small Clap Button */}
        <motion.button
          ref={buttonRef}
          type="button"
          onClick={handleClick}
          disabled={disabled}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.02 }}
          className={cn(
            'inline-flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-medium border border-white/10 bg-black hover:border-white/20 hover:bg-white/[0.04] text-[#F4F3FC] transition-all shadow-sm cursor-pointer select-none group focus:outline-none',
            className,
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {/* Animated Clapping Hands Emoji */}
          <motion.span
            animate={
              isClapping
                ? {
                    rotate: [0, -18, 16, -10, 0],
                    scale: [1, 1.35, 1],
                  }
                : { rotate: 0, scale: 1 }
            }
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center text-sm leading-none select-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </motion.span>

          {/* Clap Counter */}
          <span className="font-mono font-bold text-xs tabular-nums text-zinc-200 group-hover:text-white transition-colors">
            {new Intl.NumberFormat().format(count)}
          </span>
        </motion.button>
      </div>
    </SimpleTooltip>
  );
}
