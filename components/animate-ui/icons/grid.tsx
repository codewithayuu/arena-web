'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type GridProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    group: {
      initial: {
        scale: 1,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      animate: {
        scale: [1, 0.9, 1.1, 1],
        transition: { duration: 0.5, ease: 'easeInOut' },
      },
    },
  },
} satisfies Record<string, Record<string, Variants>>;

function IconComponent({ size, ...props }: GridProps) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <motion.g variants={variants.group} initial="initial" animate={controls}>
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
        <path d="M9 3v18" />
        <path d="M15 3v18" />
      </motion.g>
    </motion.svg>
  );
}

function Grid(props: GridProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Grid,
  Grid as GridIcon,
  type GridProps,
  type GridProps as GridIconProps,
};
