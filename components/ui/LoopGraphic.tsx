'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/cn';

type LoopGraphicProps = {
  /** Animated WebP. */
  src: string;
  /** Single-frame WebP shown until the animation is wanted, and instead of it
   *  under reduced motion. A fraction of the animation's weight. */
  poster: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
};

/**
 * An animated WebP that only downloads when it is worth downloading.
 *
 * The animation is two orders of magnitude heavier than its first frame, and an
 * animated image cannot be paused — once decoded it keeps cycling for as long as
 * it exists, whether or not anyone is looking at it. So the poster loads first
 * and the animation is only requested when the graphic is actually near the
 * viewport, and never at all when the visitor has asked for less motion.
 *
 * The swap happens on the decoded `load` event rather than on `src` assignment,
 * so the still is never replaced by a blank box on a slow connection.
 */
export function LoopGraphic({
  src,
  poster,
  alt,
  className,
  width,
  height,
}: LoopGraphicProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [source, setSource] = useState(poster);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const preload = new Image();
        preload.onload = () => setSource(src);
        preload.src = src;
      },
      { rootMargin: '200px 0px', threshold: 0 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={source}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={cn('h-auto max-w-full object-contain', className)}
    />
  );
}
