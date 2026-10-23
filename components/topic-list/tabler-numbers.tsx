import React from "react";

/**
 * Tabler Numbers Icon (from shadcn.io / Tabler Icons)
 * Visual representation of numerical counting, integer mathematics, order, and indices.
 */
export function TablerNumbersIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 10v-7l-2 2" />
      <path d="M6 16a2 2 0 1 1 4 0c0 .591 -.601 1.46 -1 2l-3 3h4" />
      <path d="M15 14a2 2 0 1 0 2 -2a2 2 0 1 0 -2 -2" />
      <path d="M6.5 10h3" />
    </svg>
  );
}

export default TablerNumbersIcon;
