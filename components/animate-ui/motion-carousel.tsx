'use client';

import * as React from 'react';
import { motion, type Transition } from 'motion/react';
import { type EmblaOptionsType, type EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from '@/components/animate-ui/icons';
import { cn } from '@/lib/utils';

export type MotionCarouselProps = {
  slides: number[];
  options?: EmblaOptionsType;
  className?: string;
  renderSlide?: (index: number, isActive: boolean) => React.ReactNode;
};

type EmblaControls = {
  selectedIndex: number;
  scrollSnaps: number[];
  prevDisabled: boolean;
  nextDisabled: boolean;
  onDotClick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

type DotButtonProps = {
  selected?: boolean;
  label: string;
  onClick: () => void;
};

const transition: Transition = {
  type: 'spring',
  stiffness: 240,
  damping: 24,
  mass: 1,
};

const useEmblaControls = (
  emblaApi: EmblaCarouselType | undefined,
): EmblaControls => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [prevDisabled, setPrevDisabled] = React.useState(true);
  const [nextDisabled, setNextDisabled] = React.useState(true);

  const onDotClick = React.useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const onNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const updateSelectionState = React.useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
    setPrevDisabled(!api.canScrollPrev());
    setNextDisabled(!api.canScrollNext());
  }, []);

  const onInit = React.useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
    updateSelectionState(api);
  }, [updateSelectionState]);

  const onSelect = React.useCallback((api: EmblaCarouselType) => {
    updateSelectionState(api);
  }, [updateSelectionState]);

  React.useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    emblaApi.on('reInit', onInit).on('select', onSelect);

    return () => {
      emblaApi.off('reInit', onInit).off('select', onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  };
};

export function MotionCarousel({ slides, options, className, renderSlide }: MotionCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  } = useEmblaControls(emblaApi);

  return (
    <div
      className={cn(
        'w-full space-y-5 [--slide-height:10rem] sm:[--slide-height:14rem] md:[--slide-height:18rem] [--slide-spacing:1.25rem] [--slide-size:55%]',
        className,
      )}
    >
      <div className="overflow-hidden py-3" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map((index) => {
            const isActive = index === selectedIndex;

            return (
              <motion.div
                key={index}
                className="h-[var(--slide-height)] mr-[var(--slide-spacing)] basis-[var(--slide-size)] flex-none flex min-w-0"
              >
                <motion.div
                  className={cn(
                    'size-full flex flex-col items-center justify-center font-bold select-none rounded-2xl border transition-all duration-300 overflow-hidden',
                    isActive
                      ? 'border-[#e83040] bg-black text-white shadow-2xl shadow-red-950/40 ring-1 ring-[#e83040]/40'
                      : 'border-white/10 bg-black/90 text-muted-foreground hover:border-white/25',
                  )}
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.92,
                    opacity: isActive ? 1 : 0.65,
                  }}
                  transition={transition}
                >
                  {renderSlide ? (
                    renderSlide(index, isActive)
                  ) : (
                    <>
                      <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                        {index + 1}
                      </span>
                      <span className="mt-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Slide {index + 1}
                      </span>
                    </>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-1">
        <button
          type="button"
          onClick={onPrev}
          disabled={prevDisabled}
          aria-label="Previous slide"
          className="size-9 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#e83040]/40 hover:text-white text-foreground transition-all duration-150 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e83040] shadow-sm"
        >
          <ChevronLeft size={20} animateOnHover className="size-5" />
        </button>

        <div className="flex flex-wrap justify-center items-center gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              label={`Slide ${index + 1}`}
              selected={index === selectedIndex}
              onClick={() => onDotClick(index)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          aria-label="Next slide"
          className="size-9 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#e83040]/40 hover:text-white text-foreground transition-all duration-150 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e83040] shadow-sm"
        >
          <ChevronRight size={20} animateOnHover className="size-5" />
        </button>
      </div>
    </div>
  );
}

function DotButton({ selected = false, label, onClick }: DotButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      initial={false}
      className={cn(
        'flex cursor-pointer select-none items-center justify-center rounded-full border-none transition-colors duration-200',
        selected
          ? 'bg-[#e83040] text-white shadow-md shadow-red-900/30'
          : 'bg-white/20 hover:bg-white/40',
      )}
      animate={{
        width: selected ? 72 : 12,
        height: selected ? 28 : 12,
      }}
      transition={transition}
    >
      <motion.span
        layout
        initial={false}
        className="block whitespace-nowrap px-3 py-1 text-xs font-semibold"
        animate={{
          opacity: selected ? 1 : 0,
          scale: selected ? 1 : 0,
          filter: selected ? 'blur(0)' : 'blur(4px)',
        }}
        transition={transition}
      >
        {label}
      </motion.span>
    </motion.button>
  );
}
