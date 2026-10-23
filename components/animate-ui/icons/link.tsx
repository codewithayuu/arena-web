'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type LinkProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    leftLink: {
      initial: {
        x: 0,
        y: 0,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      animate: {
        x: -1.5,
        y: 1.5,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
    },
    rightLink: {
      initial: {
        x: 0,
        y: 0,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      animate: {
        x: 1.5,
        y: -1.5,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
    },
    diagonal: {
      initial: {
        pathLength: 1,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      animate: {
        pathLength: [1, 0.4, 1],
        transition: { duration: 0.5, ease: 'easeInOut' },
      },
    },
  },
} satisfies Record<string, Record<string, Variants>>;

function IconComponent({ size, ...props }: LinkProps) {
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
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        variants={variants.rightLink}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        variants={variants.leftLink}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Link(props: LinkProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Link,
  Link as LinkIcon,
  type LinkProps,
  type LinkProps as LinkIconProps,
};
