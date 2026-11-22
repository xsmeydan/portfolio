import type { ToolkitItem } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useEffect, useRef, useState } from 'react';

interface ToolkitSectionProps {
  toolkit: ToolkitItem[];
}

export default function ToolkitSection({ toolkit }: ToolkitSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [forceVisible, setForceVisible] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // hover / touch
  const [hasFocus, setHasFocus] = useState(false); // keyboard focus inside
  const [isPlaying, setIsPlaying] = useState(true); // explicit play/pause toggle

  const isCompact = useMediaQuery('(max-width: 767px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isAutoRotating = isPlaying && !isPaused && !hasFocus && !prefersReducedMotion;
  const touchStartX = useRef<number | null>(null);

  // Fallback in case the intersection observer never fires
  useEffect(() => {
    const timer = setTimeout(() => setForceVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);


  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % toolkit.length);
  };

  const previous = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + toolkit.length) % toolkit.length
    );
  };

  // Auto rotate (WCAG 2.2.2: pausable, and off for reduced motion or while focused)
  useEffect(() => {
    if (!isAutoRotating || toolkit.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % toolkit.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoRotating, toolkit.length]);

  if (!toolkit.length) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    setIsPaused(false);
    if (startX === null) return;

    const deltaX = e.changedTouches[0].clientX - startX;
    if (Math.abs(deltaX) < 40) return;
    if (deltaX < 0) next();
    else previous();
  };

  const cardSpacing = isCompact ? 150 : 260;

  return (
    <section
      ref={ref as any}
      id="toolkit"
      className={`py-20 px-6 md:px-16 max-w-[1440px] mx-auto relative z-10
        transition-all duration-1000 ease-out
        ${isVisible || forceVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-20'
        }`}
      aria-roledescription="carousel"
      aria-label="Technical toolkit"
      onFocus={() => setHasFocus(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHasFocus(false);
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-headline-md text-headline-md text-primary">
          Technical Toolkit
        </h2>

        <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
          Core competencies and system architecture stack.
        </p>
      </div>

      {/* Carousel */}
      <div
        className="relative h-[340px] md:h-[420px] flex items-center justify-center overflow-hidden md:overflow-visible touch-pan-y"
        style={{ perspective: '1200px' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left button */}
        <button
          onClick={previous}
          className="
            absolute left-0 md:left-4 z-30
            w-12 h-12 rounded-full
            border border-surface-variant
            bg-background/60 backdrop-blur
            flex items-center justify-center
            text-primary
            hover:bg-primary hover:text-background
            transition-all duration-300
          "
          aria-label="Previous technology"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_back
          </span>
        </button>

        {/* 3D stage */}
        <div
          className="relative w-full max-w-6xl h-full"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {toolkit.map((tool, index) => {
            const total = toolkit.length;

            let offset = index - currentIndex;

            // Shortest direction around the carousel
            if (offset > total / 2) {
              offset -= total;
            }

            if (offset < -total / 2) {
              offset += total;
            }

            const isCenter = offset === 0;

            const absOffset = Math.abs(offset);

            // Only render nearby cards
            if (absOffset > (isCompact ? 1 : 2)) return null;

            const translateX = offset * cardSpacing;
            const translateZ = isCenter
              ? 100
              : -absOffset * 120;

            const rotateY = offset * -25;

            const scale = isCenter
              ? 1
              : absOffset === 1
                ? 0.82
                : 0.65;

            const opacity = isCenter
              ? 1
              : absOffset === 1
                ? 0.65
                : 0.3;

            return (
              <div
                key={`${tool.name}-${index}`}
                className="
                  absolute left-1/2 top-1/2
                  w-[180px] h-[220px] md:w-[220px] md:h-[260px]
                  rounded-2xl
                  glass-card
                  flex flex-col
                  items-center
                  justify-center
                  gap-5
                  cursor-hover
                  transition-all
                  duration-700
                  ease-out
                "
                style={{
                  transform: `
                    translate(-50%, -50%)
                    translateX(${translateX}px)
                    translateZ(${translateZ}px)
                    rotateY(${rotateY}deg)
                    scale(${scale})
                  `,
                  opacity,
                  zIndex: 20 - absOffset,
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => setCurrentIndex(index)}
                aria-hidden={!isCenter}
              >
                {/* Icon */}
                <div
                  className={`
                    w-20 h-20 rounded-2xl
                    border
                    flex items-center justify-center
                    transition-all duration-500
                    ${
                      isCenter
                        ? 'border-primary/60 shadow-[0_0_40px_rgba(255,255,255,0.12)]'
                        : 'border-surface-variant'
                    }
                  `}
                >
                  <span
                    className="
                      material-symbols-outlined
                      text-[38px]
                      text-primary
                    "
                  >
                    {tool.icon}
                  </span>
                </div>

                {/* Name (only legible on the focused card; faded side cards show just the icon) */}
                <span
                  className={`
                    font-label-mono
                    text-label-mono
                    text-primary
                    text-center
                    text-sm
                    px-4
                    ${isCenter ? '' : 'invisible'}
                  `}
                >
                  {tool.name}
                </span>

                {/* Center indicator */}
                {isCenter && (
                  <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                    Core Stack
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right button */}
        <button
          onClick={next}
          className="
            absolute right-0 md:right-4 z-30
            w-12 h-12 rounded-full
            border border-surface-variant
            bg-background/60 backdrop-blur
            flex items-center justify-center
            text-primary
            hover:bg-primary hover:text-background
            transition-all duration-300
          "
          aria-label="Next technology"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_forward
          </span>
        </button>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center mt-6 md:mt-8 max-w-full">
        {toolkit.map((tool, index) => (
          <button
            key={tool.name}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to ${tool.name}`}
            aria-current={index === currentIndex}
            className="group p-1.5 md:p-1"
          >
            <span
              className={`
                block h-2 rounded-full
                transition-all duration-500
                ${
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-outline-variant group-hover:bg-primary/50'
                }
              `}
            />
          </button>
        ))}
      </div>

      {/* Screen reader announcement of the current item (silent while auto-rotating) */}
      <p className="sr-only" aria-live={isAutoRotating ? 'off' : 'polite'} aria-atomic="true">
        {toolkit[currentIndex]?.name}, {currentIndex + 1} of {toolkit.length}
      </p>

      {/* Hint + play/pause */}
      <div className="flex justify-center items-center gap-3 mt-4 md:mt-6">
        {!prefersReducedMotion && (
          <button
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-label={isPlaying ? 'Pause auto-rotation' : 'Resume auto-rotation'}
            aria-pressed={!isPlaying}
            className="w-11 h-11 -my-2 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
        )}
        <span className="font-label-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
          {isAutoRotating ? 'Auto rotating · ' : ''}
          <span className="md:hidden">Swipe</span><span className="hidden md:inline">Click a card</span> to explore
        </span>
      </div>
    </section>
  );
}