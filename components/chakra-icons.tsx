"use client";

import React, { forwardRef } from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  boxSize?: string | number;
}

/**
 * Authentic Chakra UI HamburgerIcon SVG definition
 * Strictly used for hamburger sidebar drawers.
 */
export const HamburgerIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  const { className, boxSize, width, height, ...rest } = props;
  const sizeStyle = boxSize ? { width: boxSize, height: boxSize } : undefined;
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      focusable="false"
      aria-hidden="true"
      className={className}
      style={{ ...sizeStyle, ...props.style }}
      {...rest}
    >
      <path
        d="M 3 5 A 1.0001 1.0001 0 1 0 3 7 L 21 7 A 1.0001 1.0001 0 1 0 21 5 L 3 5 z M 3 11 A 1.0001 1.0001 0 1 0 3 13 L 21 13 A 1.0001 1.0001 0 1 0 21 11 L 3 11 z M 3 17 A 1.0001 1.0001 0 1 0 3 19 L 21 19 A 1.0001 1.0001 0 1 0 21 17 L 3 17 z"
        fill="currentColor"
      />
    </svg>
  );
});
HamburgerIcon.displayName = "HamburgerIcon";
