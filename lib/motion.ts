'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from './gsap';

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Shared timing for every repeating grid on the page. */
export const REVEAL = {
  y: 40,
  stagger: 0.1,
  duration: 0.85,
  ease: 'power3.out',
  start: 'top 85%',
} as const;

/**
 * How far below the fold a section starts revealing, as a share of the
 * viewport. Matches the old ScrollTrigger `top 85%`.
 */
const ROOT_MARGIN = '0px 0px -12% 0px';

type RevealOptions = {
  /** Children to stagger. Defaults to `[data-reveal]` descendants. */
  selector?: string;
  stagger?: number;
  y?: number;
  duration?: number;
  delay?: number;
  /** ScrollTrigger `start` value. Kept for call-site compatibility. */
  start?: string;
};

/**
 * Scroll-triggered reveal for a group of elements.
 *
 * Attach the returned ref to a section and mark the items inside it with
 * `data-reveal`. Under `prefers-reduced-motion` the y-transform is dropped and
 * only the opacity fade remains.
 *
 * Deliberately IntersectionObserver + CSS rather than ScrollTrigger.
 *
 * ScrollTrigger resolves `top 85%` against a scroll position it measured once.
 * On a phone that measurement is taken while the layout is still settling — the
 * address bar is about to collapse, fonts are about to swap, and every image
 * below the fold is lazy — so a trigger can end up pointing at a position the
 * page never reaches. The element then stays at `opacity: 0` permanently, which
 * is indistinguishable from a section that failed to load. IntersectionObserver
 * is resolved by the compositor against real geometry, so it cannot drift, and
 * the transition itself runs off the main thread.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {}
) {
  const ref = useRef<T>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useIsomorphicLayoutEffect(() => {
    const scope = ref.current;
    if (!scope) return;

    const {
      selector = '[data-reveal]',
      stagger = REVEAL.stagger,
      y = REVEAL.y,
      duration = REVEAL.duration,
      delay = 0,
    } = optionsRef.current;

    const targets = Array.from(scope.querySelectorAll<HTMLElement>(selector));
    if (!targets.length) return;

    const reduced = prefersReducedMotion();

    targets.forEach((el, index) => {
      el.style.setProperty('--reveal-y', reduced ? '0px' : `${y}px`);
      el.style.setProperty(
        '--reveal-duration',
        `${reduced ? 0.4 : duration}s`
      );
      el.style.setProperty(
        '--reveal-delay',
        `${delay + index * (reduced ? 0.04 : stagger)}s`
      );
    });

    const show = () => targets.forEach((el) => el.classList.add('is-revealed'));

    // No IntersectionObserver (or a scope that is already on screen at mount)
    // must never mean invisible content.
    if (typeof IntersectionObserver === 'undefined') {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        show();
        observer.disconnect();
      },
      { rootMargin: ROOT_MARGIN, threshold: 0 }
    );

    observer.observe(scope);

    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Counts a number up once, the first time it scrolls into view.
 * Reduced motion jumps straight to the final value.
 */
export function useCountUp(value: number, decimals = 0) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = (n: number) =>
      decimals > 0
        ? n.toFixed(decimals)
        : Math.round(n).toLocaleString('en-IN');

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      el.textContent = format(value);
      return;
    }

    el.textContent = format(0);

    let tween: gsap.core.Tween | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const counter = { n: 0 };
        tween = gsap.to(counter, {
          n: value,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = format(counter.n);
          },
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      tween?.kill();
      // The element outlives the tween on a route change; leave it readable.
      el.textContent = format(value);
    };
  }, [value, decimals]);

  return ref;
}
