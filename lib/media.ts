import { prefersReducedMotion } from '@/lib/gsap';

type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * Whether a looping backdrop clip should load.
 *
 * These files sit on the main page, so they only earn their place when the
 * visitor has not asked for less motion and is not on a metered or slow
 * connection. Phones are excluded outright: a looping video keeps decoding
 * frames for as long as it is on screen, and that work competes with scroll.
 */
export function shouldLoadLoopVideo() {
  if (prefersReducedMotion()) return false;

  if (
    window.matchMedia('(max-width: 1023px)').matches ||
    window.matchMedia('(hover: none) and (pointer: coarse)').matches
  ) {
    return false;
  }

  const connection = (navigator as Navigator & { connection?: Connection })
    .connection;

  if (connection?.saveData) return false;
  if (
    connection?.effectiveType === '2g' ||
    connection?.effectiveType === 'slow-2g' ||
    connection?.effectiveType === '3g'
  ) {
    return false;
  }

  return true;
}
