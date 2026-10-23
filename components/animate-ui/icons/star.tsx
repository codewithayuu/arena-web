'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type StarProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    polygon: {
      initial: {
        rotate: 0,
        scale: 1,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      animate: {
        rotate: [0, -15, 15, -5, 0],
        scale: [1, 1.2, 1],
        transition: { duration: 0.5, ease: 'easeInOut' },
      },
    },
  },
} satisfies Record<string, Record<string, Variants>>;

function IconComponent({ size, ...props }: StarProps) {
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
      <motion.polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        variants={variants.polygon}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Star(props: StarProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Star,
  Star as StarIcon,
  type StarProps,
  type StarProps as StarIconProps,
};
