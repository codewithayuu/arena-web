'use client';

import * as React from 'react';
import { motion, type Variants } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon';

type CodeProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    left: {
      initial: {
        x: 0,
      },
      animate: {
        x: [0, -3, 0],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
    right: {
      initial: {
        x: 0,
      },
      animate: {
        x: [0, 3, 0],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
};

function IconComponent({ size, ...props }: CodeProps) {
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
      <motion.polyline
        points="16 18 22 12 16 6"
        variants={variants.right}
        initial="initial"
        animate={controls}
      />
      <motion.polyline
        points="8 6 2 12 8 18"
        variants={variants.left}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Code(props: CodeProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Code,
  Code as CodeIcon,
  IconComponent as CodeIconComponent,
  type CodeProps,
};
