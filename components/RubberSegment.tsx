'use client';

import React, {
  useState,
  useRef,
  useId,
  ReactNode,
} from 'react';
import { motion, useReducedMotion } from 'motion/react';
import './RubberSegment.css';

const SIZES = {
  sm: { height: 32, font: 12, pad: 14, min: 36 },
  md: { height: 38, font: 13, pad: 18, min: 44 },
  lg: { height: 44, font: 14, pad: 22, min: 48 },
};

export type RubberSegmentItem =
  | string
  | {
      value: string;
      label: ReactNode;
      icon?: ReactNode;
    };

export interface RubberSegmentProps {
  items: RubberSegmentItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, index: number) => void;
  trackColor?: string;
  thumbColor?: string;
  textColor?: string;
  activeTextColor?: string;
  size?: 'sm' | 'md' | 'lg';
  radius?: number;
  inset?: number;
  equalSlots?: boolean;
  stretch?: number;
  squash?: number;
  speed?: number;
  glide?: number;
  draggable?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function RubberSegment({
  items,
  value,
  defaultValue,
  onChange,
  trackColor = '#000000',
  thumbColor = '#ff1018',
  textColor = '#a1a1aa',
  activeTextColor = '#000000',
  size = 'md',
  radius = 9999,
  inset = 3,
  equalSlots = false,
  disabled = false,
  className = '',
  'aria-label': ariaLabel = 'Segmented control',
}: RubberSegmentProps) {
  const instanceId = useId();
  const list = items.map((item) =>
    typeof item === 'string' ? { value: item, label: item, icon: undefined } : item
  );

  const [inner, setInner] = useState<string>(defaultValue ?? list[0]?.value ?? '');
  const current = value !== undefined ? value : inner;
  const index = Math.max(
    0,
    list.findIndex((item) => item.value === current)
  );

  const reduce = useReducedMotion();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = (val: string, i: number) => {
    if (disabled || val === current) return;
    if (value === undefined) {
      setInner(val);
    }
    onChange?.(val, i);
  };

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (disabled) return;
    let next: number | null = null;
    const last = list.length - 1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = Math.min(last, i + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = Math.max(0, i - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;

    if (next !== null && next !== i) {
      e.preventDefault();
      const nextItem = list[next];
      if (nextItem) {
        handleSelect(nextItem.value, next);
        itemRefs.current[next]?.focus();
      }
    }
  };

  const preset = SIZES[size] || SIZES.md;
  const thumbRadius = Math.max(0, radius - inset);

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      data-equal={equalSlots ? '' : undefined}
      className={`rubber-segment${className ? ` ${className}` : ''}`}
      style={
        {
          '--rs-track': trackColor,
          '--rs-thumb': thumbColor,
          '--rs-ink': textColor,
          '--rs-ink-active': activeTextColor,
          '--rs-radius': `${radius}px`,
          '--rs-inset': `${inset}px`,
          '--rs-thumb-radius': `${thumbRadius}px`,
          '--rs-h': `${preset.height}px`,
          '--rs-font': `${preset.font}px`,
          '--rs-pad': `${preset.pad}px`,
          '--rs-min': `${preset.min}px`,
        } as React.CSSProperties
      }
    >
      {list.map((item, i) => {
        const isSelected = item.value === current;
        return (
          <button
            key={item.value}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            disabled={disabled}
            className={`rubber-segment__item ${isSelected ? 'rubber-segment__item--active' : ''}`}
            onClick={() => handleSelect(item.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            {isSelected && (
              <motion.div
                layoutId={`rubber-thumb-${instanceId}`}
                className="rubber-segment__thumb"
                style={{
                  backgroundColor: thumbColor,
                  borderRadius: `${thumbRadius}px`,
                }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : {
                        type: 'spring',
                        stiffness: 420,
                        damping: 32,
                        mass: 0.8,
                      }
                }
              />
            )}
            <span className="rubber-segment__content">
              {item.icon && <span className="rubber-segment__icon">{item.icon}</span>}
              <span className="rubber-segment__label">{item.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default RubberSegment;
