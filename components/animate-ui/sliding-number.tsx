'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SlidingNumberProps {
  number: number | string;
  className?: string;
  padStart?: boolean;
  padLength?: number;
}

/**
 * SlidingNumber - Animate UI inspired animated text primitive
 * Smoothly rolls / slides numbers when the value changes
 */
export function SlidingNumber({
  number,
  className = '',
  padStart = false,
  padLength = 2,
}: SlidingNumberProps) {
  const strValue = React.useMemo(() => {
    const raw = String(number);
    if (padStart) {
      return raw.padStart(padLength, '0');
    }
    return raw;
  }, [number, padStart, padLength]);

  return (
    <span
      className={`inline-flex items-center tabular-nums overflow-hidden font-mono ${className}`}
      style={{ lineHeight: 1 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={strValue}
          initial={{ y: 12, opacity: 0, filter: 'blur(2px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -12, opacity: 0, filter: 'blur(2px)' }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 25,
            mass: 0.5,
          }}
          className="inline-block"
        >
          {strValue}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
