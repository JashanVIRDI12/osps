'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import { cn } from '@/lib/cn';

type RotatingWordProps = {
  words: string[];
  /** Milliseconds between swaps. */
  intervalMs?: number;
  className?: string;
};

/**
 * Cycles the highlighted hero word every few seconds with a short slide/fade.
 * The dashed box animates to fit whatever word is showing.
 *
 * Deliberately not a live region: the word is a stylistic variation on one
 * sentence, and announcing "depend / rely / trust / count" every three seconds
 * would talk over everything else a screen reader is trying to read. The h1 is
 * still read normally, with whichever word is current at the time.
 */
export function RotatingWord({
  words,
  intervalMs = 3000,
  className,
}: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const boxRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  const fitBox = (animate: boolean) => {
    const box = boxRef.current;
    const word = wordRef.current;
    if (!box || !word) return;

    // content-box width = glyph width only; padding/border sit outside so the
    // dashed frame never clips the rotating word.
    const nextWidth = Math.ceil(word.getBoundingClientRect().width);

    if (!animate || prefersReducedMotion()) {
      box.style.width = `${nextWidth}px`;
      return;
    }

    gsap.to(box, {
      width: nextWidth,
      duration: 0.35,
      ease: 'power3.out',
    });
  };

  /**
   * `useLayoutEffect` warns during SSR, and this component renders inside the
   * server-rendered hero — the isomorphic wrapper keeps the pre-paint measure on
   * the client and falls back to `useEffect` on the server.
   */
  useIsomorphicLayoutEffect(() => {
    fitBox(false);

    /**
     * The box is measured from the rendered glyphs, so a first measure taken
     * against the fallback font sets the wrong width and the dashed frame jumps
     * when Manrope swaps in. Re-measuring on `fonts.ready` removes that shift —
     * it is a layout shift inside the LCP element, so it counts against CLS.
     */
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) fitBox(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useIsomorphicLayoutEffect(() => {
    fitBox(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words]);

  /**
   * The swap only runs while the word is actually on screen and the tab is in
   * front. A timer that keeps firing GSAP tweens behind a scrolled-past hero is
   * pure battery drain on a phone, and it holds the ticker awake for nothing.
   */
  useEffect(() => {
    if (words.length < 2 || prefersReducedMotion()) return;

    const box = boxRef.current;
    if (!box) return;

    let timer = 0;
    let visible = false;

    const swap = () => {
      const el = wordRef.current;
      if (!el) {
        setIndex((current) => (current + 1) % words.length);
        return;
      }

      gsap.to(el, {
        y: -10,
        opacity: 0,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => {
          setIndex((current) => (current + 1) % words.length);
          gsap.fromTo(
            el,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }
          );
        },
      });
    };

    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };

    const sync = () => {
      const shouldRun = visible && document.visibilityState === 'visible';
      if (shouldRun && !timer) {
        timer = window.setInterval(swap, intervalMs);
      } else if (!shouldRun && timer) {
        stop();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });

    observer.observe(box);
    document.addEventListener('visibilitychange', sync);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      stop();
    };
  }, [words, intervalMs]);

  /**
   * Mobile browsers fire `resize` on every address-bar collapse. Re-measuring
   * there would thrash layout mid-scroll for no reason — only a width change can
   * change how wide the word renders.
   */
  useEffect(() => {
    let lastWidth = window.innerWidth;

    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      fitBox(false);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words]);

  return (
    <span
      ref={boxRef}
      className={cn(
        'word-highlight relative inline-flex max-w-full overflow-hidden whitespace-nowrap',
        className
      )}
    >
      <span
        ref={wordRef}
        className="inline-block will-change-transform"
      >
        {words[index]}
      </span>
    </span>
  );
}
