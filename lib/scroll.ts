'use client';

import { getLenis } from './lenis';
import { prefersReducedMotion } from './gsap';

/**
 * Scrolls to an in-page anchor through Lenis when it is running, falling back
 * to native scrolling (and to a plain jump under reduced motion).
 * Returns false when the target does not exist, so callers can let the browser
 * handle the link normally.
 */
export function scrollToHash(hash: string, offset = -96): boolean {
  const target = document.querySelector(hash);
  if (!target) return false;

  const lenis = getLenis();

  if (lenis) {
    lenis.start();
    lenis.scrollTo(target as HTMLElement, { offset });
  } else {
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  return true;
}
