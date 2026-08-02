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

type RevealOptions = {
  /** Children to stagger. Defaults to `[data-reveal]` descendants. */
  selector?: string;
  stagger?: number;
  y?: number;
  duration?: number;
  delay?: number;
  /** ScrollTrigger `start` value. */
  start?: string;
};

/**
 * Scroll-triggered reveal for a group of elements.
 *
 * Attach the returned ref to a section and mark the items inside it with
 * `data-reveal`. Under `prefers-reduced-motion` the y-transform is dropped and
 * only the opacity fade remains.
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
      start = REVEAL.start,
    } = optionsRef.current;

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>(selector);
      if (!targets.length) return;

      gsap.fromTo(
        targets,
        { opacity: 0, y: reduced ? 0 : y },
        {
          opacity: 1,
          y: 0,
          duration: reduced ? 0.4 : duration,
          ease: REVEAL.ease,
          stagger: reduced ? 0.04 : stagger,
          delay,
          scrollTrigger: {
            trigger: scope,
            start,
            once: true,
          },
        }
      );
    }, scope);

    return () => ctx.revert();
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

    if (prefersReducedMotion()) {
      el.textContent = format(value);
      return;
    }

    const ctx = gsap.context(() => {
      const counter = { n: 0 };
      el.textContent = format(0);

      gsap.to(counter, {
        n: value,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = format(counter.n);
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, decimals]);

  return ref;
}
