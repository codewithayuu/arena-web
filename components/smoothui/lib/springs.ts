export const spring = {
  /** Hover highlights, fades, small toggles */
  fast: {
    bounce: 0,
    duration: 0.08,
    exit: { duration: 0.06 },
    type: "spring" as const,
  },
  /**
   * Critically damped — dropdowns, tabs, panels, fluid-hover travel when the
   * target size changes. Lands with no overshoot.
   */
  moderate: {
    bounce: 0,
    duration: 0.16,
    exit: { duration: 0.12 },
    type: "spring" as const,
  },
  /** Dialogs, drawers, larger chrome */
  slow: {
    bounce: 0.12,
    duration: 0.24,
    exit: { duration: 0.16 },
    type: "spring" as const,
  },
} as const;

/** Safety timeout (ms) for deferred unmount after an exit tween. */
export const exitFallbackMs = (tier: { exit: { duration: number } }) =>
  Math.round(tier.exit.duration * 1000) + 100;

export type SpringTier = keyof typeof spring;
