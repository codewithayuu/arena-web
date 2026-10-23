'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type ArrowUpDownProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    upArrow: {
      initial: {
        y: 0,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      animate: {
        y: -3,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
    },
    downArrow: {
      initial: {
        y: 0,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      animate: {
        y: 3,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
    },
  },
} satisfies Record<string, Record<string, Variants>>;

function IconComponent({ size, ...props }: ArrowUpDownProps) {
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
      <motion.g
        variants={variants.downArrow}
        initial="initial"
        animate={controls}
      >
        <path d="m3 16 4 4 4-4" />
        <path d="M7 20V4" />
      </motion.g>
      <motion.g
        variants={variants.upArrow}
        initial="initial"
        animate={controls}
      >
        <path d="m21 8-4-4-4 4" />
        <path d="M17 4v16" />
      </motion.g>
    </motion.svg>
  );
}

function ArrowUpDown(props: ArrowUpDownProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  ArrowUpDown,
  ArrowUpDown as ArrowUpDownIcon,
  type ArrowUpDownProps,
  type ArrowUpDownProps as ArrowUpDownIconProps,
};
