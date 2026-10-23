'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type FilterProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    polygon: {
      initial: {
        scale: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      animate: {
        scale: [1, 0.95, 1.05, 1],
        y: [0, 2, -1, 0],
        transition: { duration: 0.5, ease: 'easeInOut' },
      },
    },
  },
} satisfies Record<string, Record<string, Variants>>;

function IconComponent({ size, ...props }: FilterProps) {
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
        points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
        variants={variants.polygon}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Filter(props: FilterProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Filter,
  Filter as FilterIcon,
  type FilterProps,
  type FilterProps as FilterIconProps,
};
