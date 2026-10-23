'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type FlagProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    flag: {
      initial: {
        skewY: 0,
        scale: 1,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      animate: {
        skewY: [0, -6, 6, -3, 0],
        scale: [1, 1.05, 0.95, 1],
        transition: { duration: 0.6, ease: 'easeInOut' },
      },
    },
    pole: {},
  },
} satisfies Record<string, Record<string, Variants>>;

function IconComponent({ size, ...props }: FlagProps) {
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
      <motion.line
        x1="4"
        y1="22"
        x2="4"
        y2="15"
        variants={variants.pole}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
        variants={variants.flag}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Flag(props: FlagProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Flag,
  Flag as FlagIcon,
  type FlagProps,
  type FlagProps as FlagIconProps,
};
