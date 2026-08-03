'use client';

import { getLenis } from './lenis';
import { prefersReducedMotion } from './gsap';

/** Height of the fixed header, so a section never lands underneath it. */
const HEADER_OFFSET = 96;

/**
 * Scrolls to an in-page anchor through Lenis when it is running, falling back
 * to native scrolling (and to a plain jump under reduced motion).
 * Returns false when the target does not exist, so callers can let the browser
 * handle the link normally.
 */
export function scrollToHash(hash: string, offset = -HEADER_OFFSET): boolean {
  const target = document.querySelector(hash);
  if (!target) return false;

  const lenis = getLenis();

  if (lenis) {
    lenis.start();
    lenis.scrollTo(target as HTMLElement, { offset });
    return true;
  }

  /**
   * The native path is the one every phone takes, since Lenis only runs on
   * pointer devices — so it has to honour the header offset itself.
   * `scrollIntoView` cannot express one, and would park the section's top edge
   * exactly under the fixed bar.
   */
  const top =
    window.scrollY + target.getBoundingClientRect().top + offset;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });

  return true;
}
