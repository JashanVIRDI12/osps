import type Lenis from 'lenis';

/**
 * Tiny singleton so UI that locks scrolling (the mobile drawer) can pause the
 * smooth-scroll instance created in MotionRoot.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}
