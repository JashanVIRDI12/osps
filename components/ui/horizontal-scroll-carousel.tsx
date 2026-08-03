'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import { prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

/**
 * Horizontal scroll carousel — adapted from @uniquesonu / 21st.dev.
 *
 * The section is taller than the viewport; the deck inside sticks to the top and
 * translates on X as that extra height scrolls past, so vertical input reads as
 * horizontal movement.
 *
 * Two changes from the source component:
 *   - the travel distance is measured from the real track width instead of the
 *     hardcoded `-95%`, so any number of cards lands flush at both ends,
 *   - the pinning only engages from `lg` up and is skipped under reduced motion;
 *     below that the deck is a native swipe row, which is what a touch device
 *     wants anyway.
 */

export type CarouselItem = {
  image: string;
  title: string;
  description: string;
  badge: string;
};

type HorizontalScrollCarouselProps = {
  items: CarouselItem[];
  className?: string;
  /** Rendered inside the pinned area, above the deck. */
  header?: React.ReactNode;
};

export function HorizontalScrollCarousel({
  items,
  className,
  header,
}: HorizontalScrollCarouselProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /**
   * Whether each arrow still has somewhere to go. A disabled arrow at the end
   * of the row is the affordance that tells you the deck has an end — without
   * it the control looks broken rather than exhausted.
   */
  const syncArrows = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;

    const max = row.scrollWidth - row.clientWidth;
    setAtStart(row.scrollLeft <= 4);
    setAtEnd(row.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    syncArrows();

    const row = rowRef.current;
    if (!row) return;

    const observer = new ResizeObserver(syncArrows);
    observer.observe(row);
    return () => observer.disconnect();
  }, [syncArrows, items.length]);

  /** Advances by exactly one card plus its gap, so the row lands snapped. */
  const step = useCallback((direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;

    const card = row.querySelector('article');
    const track = row.firstElementChild;
    const gap = track ? parseFloat(getComputedStyle(track).gap) || 16 : 16;
    const distance = card
      ? card.getBoundingClientRect().width + gap
      : row.clientWidth * 0.8;

    row.scrollBy({
      left: direction * distance,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const pinnable =
        window.matchMedia('(min-width: 1024px)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!track || !pinnable) {
        setTravel(0);
        return;
      }

      // Overshoot slightly so the last card clears the right edge.
      setTravel(Math.max(0, track.scrollWidth - window.innerWidth + 48));
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [items.length]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  return (
    <div
      ref={sectionRef}
      className={cn('relative', className)}
      // Only reserve extra scroll height when the deck actually travels.
      style={travel > 0 ? { height: `calc(100svh + ${travel}px)` } : undefined}
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:overflow-hidden">
        {header}

        {/**
         * Swipe controls, mobile only.
         *
         * From `lg` the deck is driven by the page scroll, so an arrow would be
         * pointing at a gesture that does not apply. Below it the row is a
         * native swipe area — and a swipe area with no visible control reads as
         * a static row of cut-off cards, which is exactly how this section was
         * being missed.
         *
         * They are real buttons rather than decorative chevrons, so the deck is
         * reachable by tap and by keyboard, not only by dragging.
         */}
        <div className="shell mt-7 flex items-center gap-2 lg:hidden">
          <ArrowButton
            direction="prev"
            disabled={atStart}
            onClick={() => step(-1)}
          />
          <ArrowButton
            direction="next"
            disabled={atEnd}
            onClick={() => step(1)}
          />
          <span
            aria-hidden="true"
            className="ml-1 text-caption font-medium uppercase tracking-[0.14em] text-ink-soft"
          >
            Swipe to browse
          </span>
        </div>

        {/**
         * Below `lg` this is a native swipe row, so it gets the things a swipe
         * row needs and a transformed track must not have: scroll snapping so
         * cards come to rest framed rather than half-cut, `scroll-padding` that
         * matches the gutter so a snapped card lines up with the copy above it,
         * and `overscroll-contain` so swiping past the last card does not
         * trigger the browser's back gesture.
         */}
        <div
          ref={rowRef}
          onScroll={syncArrows}
          className={cn(
            'mt-4 lg:mt-10',
            'scrollbar-none overscroll-x-contain overflow-x-auto pb-4',
            'snap-x snap-mandatory scroll-pl-5 sm:scroll-pl-6',
            'lg:snap-none lg:overflow-visible lg:pb-0'
          )}
          role="region"
          aria-label="Industries we serve, swipe to browse"
          tabIndex={0}
          /* Nested scroller: Lenis must leave this one to the browser, or a
             horizontal trackpad gesture over the row is swallowed by the page's
             virtual scroller instead of moving the deck. */
          data-lenis-prevent
        >
          <motion.div
            ref={trackRef}
            style={travel > 0 ? { x } : undefined}
            className="gutter-x flex w-max gap-4 [--gutter:1.25rem] sm:gap-5 sm:[--gutter:1.5rem] lg:[--gutter:2rem]"
          >
            {items.map((item, index) => (
              <Card key={item.title} item={item} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      /* `aria-label` rather than visible text: the row it controls is already
         named, so the button only has to say which way it goes. */
      aria-label={
        direction === 'prev' ? 'Previous industries' : 'Next industries'
      }
      className={cn(
        'grid h-11 w-11 shrink-0 place-items-center rounded-pill border transition-colors duration-200',
        disabled
          ? 'border-line bg-canvas text-ink-soft/40'
          : 'border-line-strong bg-surface text-royal active:border-royal active:bg-royal-tint'
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

function Card({ item, index }: { item: CarouselItem; index: number }) {
  return (
    <article
      className={cn(
        'group relative shrink-0 snap-start overflow-hidden rounded-card-elevated lg:snap-align-none',
        // Caps at the viewport width so a 320px phone never gets a card wider
        // than the screen, which would make the row impossible to rest on.
        'h-[400px] w-[min(268px,78vw)] xs:h-[420px] sm:h-[460px] sm:w-[320px] lg:h-[500px] lg:w-[368px]',
        'border border-line bg-royal-deep shadow-card'
      )}
    >
      <Image
        src={item.image}
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 640px) 268px, (max-width: 1024px) 320px, 368px"
        /**
         * The deck is 2580px of track inside a 390px window, so every card past
         * the second sits outside the viewport horizontally — and a lazy image
         * that is off-screen on the *x* axis never loads, however far the
         * visitor scrolls down the page. The result on a phone is a row whose
         * first two cards have photography and whose remaining seven are flat
         * navy rectangles, which reads as a broken section rather than one
         * waiting to be swiped.
         *
         * The first three are therefore eager (they are what is on screen when
         * the section arrives), and the rest stay lazy so they cost nothing
         * until the row is actually swiped.
         */
        loading={index < 3 ? 'eager' : 'lazy'}
        className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
      />

      {/* Scrim — the copy sits over photography, so it needs a floor. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-royal-deep via-royal-deep/55 to-royal-deep/10"
      />

      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-pill border border-white/25 bg-royal-deep/70 px-3 py-1.5 text-caption font-medium text-white lg:bg-white/15 lg:backdrop-blur-md">
            {item.badge}
          </span>
          <span className="text-caption font-semibold tracking-[0.16em] text-white/60">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div>
          <h3 className="text-balance text-[1.4rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[1.55rem]">
            {item.title}
          </h3>
          <p className="mt-3 text-pretty text-body-sm leading-relaxed text-white/80">
            {item.description}
          </p>
          {/* Accent rule that draws in on hover. */}
          <span
            aria-hidden="true"
            className="mt-5 block h-0.5 w-10 origin-left scale-x-100 bg-accent transition-transform duration-500 ease-smooth group-hover:scale-x-[2.4]"
          />
        </div>
      </div>
    </article>
  );
}
