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

    /**
     * A commanded jump wants a different curve from a wheel gesture.
     *
     * The instance easing is expo-out, which is right for the wheel — it answers
     * instantly and eases the tail. Reused for an anchor it launches the page at
     * enormous speed and the visitor loses the thread of where they are going.
     * The in-out cubic below accelerates first, so the jump reads as travel
     * between two places rather than a cut.
     *
     * The duration scales with distance and is clamped at both ends: nav links
     * jump anywhere from a few hundred pixels (Process) to most of the document
     * (Contact), and a fixed duration makes one of those crawl and the other
     * teleport. The ceiling matters most — nothing on this page is far enough
     * away to be worth more than 1.2s of the visitor's attention.
     */
    const distance = Math.abs(
      (target as HTMLElement).getBoundingClientRect().top + offset
    );

    lenis.scrollTo(target as HTMLElement, {
      offset,
      duration: Math.min(1.2, Math.max(0.6, distance / 2200)),
      easing: (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    });

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
