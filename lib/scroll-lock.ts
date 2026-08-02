'use client';

import { getLenis } from './lenis';

/**
 * Page scroll lock for overlays (the mobile drawer, the product modal).
 *
 * Reference counted, because the two overlays can legitimately overlap — the
 * modal's "Enquire" action closes the modal and scrolls the page, and on a phone
 * the drawer may still be unwinding. Without the count the first `unlock` would
 * release the page while the second overlay is still on screen.
 *
 * Two things have to stop, not one: the CSS lock holds native scrolling
 * (including iOS Safari's rubber-band, via `overscroll-behavior`), and Lenis has
 * to be paused separately because a virtual scroller does not read `overflow`.
 */
let locks = 0;

export function lockScroll() {
  if (typeof document === 'undefined') return;

  locks += 1;
  if (locks > 1) return;

  getLenis()?.stop();
  document.documentElement.classList.add('scroll-locked');
}

export function unlockScroll() {
  if (typeof document === 'undefined' || locks === 0) return;

  locks -= 1;
  if (locks > 0) return;

  getLenis()?.start();
  document.documentElement.classList.remove('scroll-locked');
}
