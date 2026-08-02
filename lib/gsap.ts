'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Single global registration point for GSAP plugins.
 *
 * Every client component imports `gsap` / `ScrollTrigger` from here rather than
 * calling `gsap.registerPlugin` itself, so the plugin is wired up exactly once.
 */
let registered = false;

export function registerGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /**
   * Mobile browsers fire `resize` every time the address bar collapses or
   * expands. Left alone, ScrollTrigger recalculates every pinned/scrubbed
   * trigger mid-scroll and the sticky hero and card deck visibly jump.
   * `ignoreMobileResize` skips the refresh when only the viewport *height*
   * changed, which is exactly the URL-bar case — an orientation change still
   * refreshes normally.
   */
  ScrollTrigger.config({ ignoreMobileResize: true });

  registered = true;
}

registerGsap();

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger };
