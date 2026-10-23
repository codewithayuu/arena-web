'use client';

import React, { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import './TrueFocus.css';

const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
const SMOOTH_EASE = [0.65, 0, 0.35, 1] as const;
const SMOOTH_CSS = 'cubic-bezier(0.65, 0, 0.35, 1)';
const SPRING_CSS = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface TrueFocusItem {
  id?: string | number;
  content: React.ReactNode;
  className?: string;
}

export interface TrueFocusProps {
  sentence?: string;
  items?: TrueFocusItem[];
  separator?: string;
  manualMode?: boolean;
  focusStyle?: 'brackets' | 'box' | 'underline' | 'highlight';
  order?: 'sequential' | 'random';
  easing?: 'smooth' | 'spring';
  blurAmount?: number;
  focusScale?: number;
  borderColor?: string;
  highlightColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  cornerSize?: number;
  borderWidth?: number;
  unfocusedOpacity?: number;
  className?: string;
  wordClassName?: string;
  highlightWords?: string[];
  highlightTextColor?: string;
  textColor?: string;
  frameGap?: number;
}

export const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence,
  items,
  separator = ' ',
  manualMode = false,
  focusStyle = 'brackets',
  order = 'sequential',
  easing = 'smooth',
  blurAmount = 0,
  focusScale = 1.02,
  borderColor = '#FF1018',
  highlightColor,
  glowColor = 'transparent',
  animationDuration = 0.45,
  pauseBetweenAnimations = 1.4,
  cornerSize = 14,
  borderWidth = 2.5,
  unfocusedOpacity = 0.65,
  className = '',
  wordClassName = '',
  highlightWords = [],
  highlightTextColor = '#FF1018',
  textColor = '#ffffff',
  frameGap = 8
}) => {
  const isItemsMode = Array.isArray(items) && items.length > 0;

  // Parse words when sentence mode is active
  const { tokens, wordCount } = useMemo(() => {
    if (isItemsMode || !sentence) {
      return { tokens: [], wordCount: 0 };
    }
    const rawLines = sentence.split('\n');
    const tokenList: Array<{ type: 'word' | 'break'; text: string; wordIndex: number }> = [];
    let wIdx = 0;
    rawLines.forEach((line, lIdx) => {
      const lineWords = line.split(separator).filter(w => w.trim() !== '');
      lineWords.forEach(w => {
        tokenList.push({ type: 'word', text: w, wordIndex: wIdx++ });
      });
      if (lIdx < rawLines.length - 1) {
        tokenList.push({ type: 'break', text: '', wordIndex: -1 });
      }
    });
    return { tokens: tokenList, wordCount: wIdx };
  }, [sentence, separator, isItemsMode]);

  const totalCount = isItemsMode ? items.length : wordCount;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [focusRect, setFocusRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const isHoveredRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRefs = useRef<Array<HTMLElement | null>>([]);
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : animationDuration;
  const activeIndex = totalCount > 0 ? currentIndex % totalCount : -1;
  const spring = easing === 'spring' && !reduceMotion;
  const transition = spring
    ? { type: 'spring' as const, duration, bounce: 0.38 }
    : { duration, ease: SMOOTH_EASE };

  useEffect(() => {
    if (manualMode || totalCount < 2) return;
    const interval = setInterval(() => {
      if (isHoveredRef.current) return;
      const roll = Math.random();
      setCurrentIndex(prev => {
        const current = prev % totalCount;
        if (order !== 'random') return (current + 1) % totalCount;
        const next = Math.floor(roll * (totalCount - 1));
        return next >= current ? next + 1 : next;
      });
    }, (animationDuration + pauseBetweenAnimations) * 1000);
    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, totalCount, order]);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const target = elementRefs.current[activeIndex];
    if (!container || !target) return;

    const measure = () => {
      const next = {
        x: target.offsetLeft,
        y: target.offsetTop,
        width: target.offsetWidth,
        height: target.offsetHeight
      };
      setFocusRect(prev =>
        prev && prev.x === next.x && prev.y === next.y && prev.width === next.width && prev.height === next.height
          ? prev
          : next
      );
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    elementRefs.current.forEach(node => node && observer.observe(node));
    return () => observer.disconnect();
  }, [activeIndex, sentence, separator, isItemsMode, items]);

  const frame = focusRect && {
    x: focusRect.x - (focusRect.width * (focusScale - 1)) / 2,
    y: focusRect.y - (focusRect.height * (focusScale - 1)) / 2,
    width: focusRect.width * focusScale,
    height: focusRect.height * focusScale
  };

  const corners = frame && {
    'top-left': { x: frame.x - frameGap, y: frame.y - frameGap },
    'top-right': { x: frame.x + frame.width + frameGap - cornerSize, y: frame.y - frameGap },
    'bottom-left': { x: frame.x - frameGap, y: frame.y + frame.height + frameGap - cornerSize },
    'bottom-right': {
      x: frame.x + frame.width + frameGap - cornerSize,
      y: frame.y + frame.height + frameGap - cornerSize
    }
  };

  const shapes = frame && {
    box: {
      x: frame.x - frameGap,
      y: frame.y - frameGap,
      width: frame.width + frameGap * 2,
      height: frame.height + frameGap * 2
    },
    underline: {
      x: frame.x,
      y: frame.y + frame.height + frameGap * 0.4,
      width: frame.width,
      height: borderWidth
    },
    highlight: {
      x: frame.x - frame.height * 0.14,
      y: frame.y + frame.height * 0.04,
      width: frame.width + frame.height * 0.28,
      height: frame.height * 0.92
    }
  };

  const frameStyle: React.CSSProperties = {
    // @ts-ignore
    '--border-color': borderColor,
    '--highlight-color': `color-mix(in srgb, ${highlightColor ?? borderColor} 30%, transparent)`,
    '--glow-color': glowColor,
    '--corner-size': `${cornerSize}px`,
    '--border-width': `${borderWidth}px`
  };

  return (
    <div
      className={`focus-container ${className}`.trim()}
      ref={containerRef}
      style={{
        ...frameStyle,
        ...(className.includes('grid') ? { display: 'grid' } : {}),
      }}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      {focusStyle === 'highlight' && shapes && (
        <motion.span
          className="focus-highlight"
          aria-hidden="true"
          initial={{ ...shapes.highlight, opacity: 0 }}
          animate={{ ...shapes.highlight, opacity: 1 }}
          transition={transition}
        />
      )}

      {/* Mode A: Items Array (Cards, Stats, Capabilities) */}
      {isItemsMode &&
        items.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={item.id ?? `item-${index}`}
              ref={el => {
                elementRefs.current[index] = el;
              }}
              className={`focus-item ${manualMode ? 'manual' : ''} ${isActive ? 'active' : ''} ${item.className || ''}`.trim()}
              style={{
                filter: blurAmount > 0 && !isActive ? `blur(${blurAmount}px)` : undefined,
                opacity: isActive ? 1 : unfocusedOpacity,
                transform: focusScale !== 1 && isActive ? `scale(${focusScale})` : undefined,
                transition: `filter ${duration}s ease, opacity ${duration}s ease, transform ${duration}s ${spring ? SPRING_CSS : SMOOTH_CSS}`
              }}
              onMouseEnter={() => {
                setCurrentIndex(index);
              }}
            >
              {item.content}
            </div>
          );
        })}

      {/* Mode B: Sentence Tokens (Words) */}
      {!isItemsMode &&
        tokens.map((token, tIdx) => {
          if (token.type === 'break') {
            return <span key={`break-${tIdx}`} className="focus-break" aria-hidden="true" />;
          }

          const index = token.wordIndex;
          const isActive = index === activeIndex;
          const rawWord = token.text;
          const cleanWord = rawWord.replace(/[^a-zA-Z0-9]/g, '');
          const isHighlightWord = highlightWords.some(hw => hw.toLowerCase() === cleanWord.toLowerCase());
          const wordColor = isHighlightWord ? highlightTextColor : textColor;

          return (
            <span
              key={`word-${index}`}
              ref={el => {
                elementRefs.current[index] = el;
              }}
              className={`focus-word ${manualMode ? 'manual' : ''} ${isActive ? 'active' : ''} ${wordClassName}`.trim()}
              style={{
                color: wordColor,
                filter: `blur(${isActive ? 0 : blurAmount}px)`,
                opacity: isActive ? 1 : unfocusedOpacity,
                transform: focusScale !== 1 ? `scale(${isActive ? focusScale : 1})` : undefined,
                transition: `filter ${duration}s ease, opacity ${duration}s ease, transform ${duration}s ${spring ? SPRING_CSS : SMOOTH_CSS}`
              }}
              onMouseEnter={() => {
                setCurrentIndex(index);
              }}
            >
              {rawWord}
            </span>
          );
        })}

      {shapes && corners && focusStyle !== 'highlight' && (
        <div className="focus-frame" aria-hidden="true">
          {focusStyle === 'box' && (
            <motion.span
              className="focus-box"
              initial={{ ...shapes.box, opacity: 0 }}
              animate={{ ...shapes.box, opacity: 1 }}
              transition={transition}
            />
          )}
          {focusStyle === 'underline' && (
            <motion.span
              className="focus-underline"
              initial={{ ...shapes.underline, opacity: 0 }}
              animate={{ ...shapes.underline, opacity: 1 }}
              transition={transition}
            />
          )}
          {focusStyle !== 'box' &&
            focusStyle !== 'underline' &&
            CORNERS.map(corner => (
              <motion.span
                key={corner}
                className={`corner ${corner}`}
                initial={{ ...corners[corner], opacity: 0 }}
                animate={{ ...corners[corner], opacity: 1 }}
                transition={transition}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default TrueFocus;
