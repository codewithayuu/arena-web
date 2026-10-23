'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type ArrowLeftProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    arrow: {
      initial: {
        x: 0,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      animate: {
        x: -4,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
    },
  },
} satisfies Record<string, Record<string, Variants>>;

function IconComponent({ size, ...props }: ArrowLeftProps) {
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
      <motion.g variants={variants.arrow} initial="initial" animate={controls}>
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </motion.g>
    </motion.svg>
  );
}

function ArrowLeft(props: ArrowLeftProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  ArrowLeft,
  ArrowLeft as ArrowLeftIcon,
  type ArrowLeftProps,
  type ArrowLeftProps as ArrowLeftIconProps,
};
