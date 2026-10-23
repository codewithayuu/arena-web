'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type BookOpenProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    leftPage: {
      initial: {
        rotateY: 0,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      animate: {
        rotateY: [0, -15, 0],
        transition: { duration: 0.5, ease: 'easeInOut' },
      },
    },
    rightPage: {
      initial: {
        rotateY: 0,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      animate: {
        rotateY: [0, 15, 0],
        transition: { duration: 0.5, ease: 'easeInOut' },
      },
    },
  },
} satisfies Record<string, Record<string, Variants>>;

function IconComponent({ size, ...props }: BookOpenProps) {
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
      <motion.path
        d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
        variants={variants.leftPage}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
        variants={variants.rightPage}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function BookOpen(props: BookOpenProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  BookOpen,
  BookOpen as BookOpenIcon,
  type BookOpenProps,
  type BookOpenProps as BookOpenIconProps,
};
