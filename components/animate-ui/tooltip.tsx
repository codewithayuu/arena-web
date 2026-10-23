'use client';

import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import {
  motion,
  type Transition,
} from 'motion/react';
import { cn } from '@/lib/utils';

export interface TooltipProviderProps
  extends React.ComponentProps<typeof TooltipPrimitive.Provider> {}

export function TooltipProvider({
  delayDuration = 400,
  skipDelayDuration = 300,
  disableHoverableContent = true,
  ...props
}: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
      {...props}
    />
  );
}

export interface TooltipProps
  extends React.ComponentProps<typeof TooltipPrimitive.Root> {
  delayDuration?: number;
}

export function Tooltip({
  delayDuration = 400,
  disableHoverableContent = true,
  children,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root
      data-slot="tooltip"
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
      {...props}
    >
      {children}
    </TooltipPrimitive.Root>
  );
}

export interface TooltipTriggerProps
  extends React.ComponentProps<typeof TooltipPrimitive.Trigger> {}

export function TooltipTrigger({ ...props }: TooltipTriggerProps) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

export interface TooltipContentProps
  extends Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, 'forceMount' | 'asChild'> {
  transition?: Transition;
  showArrow?: boolean;
}

export function TooltipContent({
  className,
  side = 'top',
  sideOffset = 6,
  showArrow = true,
  transition = { type: 'spring', stiffness: 350, damping: 25 },
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        asChild
        side={side}
        sideOffset={sideOffset}
        className="z-50 pointer-events-none select-none"
        {...props}
      >
        <motion.div
          data-slot="tooltip-content"
          initial={{ opacity: 0, scale: 0.92, y: side === 'top' ? 4 : side === 'bottom' ? -4 : 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={transition}
          className={cn(
            'z-50 w-fit rounded-lg px-2.5 py-1 text-xs font-medium shadow-2xl',
            // Crisp AMOLED charcoal tooltip background without blur
            'bg-[#141419] border border-white/[0.1] text-foreground',
            'pointer-events-none select-none',
            className
          )}
        >
          {children}
          {showArrow && (
            <TooltipPrimitive.Arrow className="fill-[#0c0c0c]/95 stroke-white/[0.1] stroke-1 size-2.5" />
          )}
        </motion.div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

/**
 * Convenient all-in-one SimpleTooltip wrapper
 * Usage: <SimpleTooltip content="Edit Note"><button ... /></SimpleTooltip>
 */
export function SimpleTooltip({
  content,
  children,
  side = 'top',
  sideOffset = 6,
  delayDuration = 400,
  className,
}: {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  delayDuration?: number;
  className?: string;
}) {
  if (!content) return children;

  return (
    <Tooltip delayDuration={delayDuration} disableHoverableContent>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={sideOffset}
        className={className}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
