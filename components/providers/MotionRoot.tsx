'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { setLenis } from '@/lib/lenis';

declare global {
  interface Window {
    __ospsMotionReady?: boolean;
  }
}

/**
 * Boots smooth scrolling and keeps ScrollTrigger in sync with it.
 *
 * Lenis is skipped entirely when the visitor prefers reduced motion — native
 * scrolling stays untouched and ScrollTrigger falls back to its own listeners.
 */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.__ospsMotionReady = true;

    /**
     * Anything still parked at `opacity: 0` because its reveal never ran is a
     * blank section as far as the visitor is concerned. The reveal itself is
     * IntersectionObserver-driven and self-healing, so this only has to cover
     * the case where a section's script never ran at all.
     *
     * It is deliberately not a class toggled on `<html>`. That invalidates
     * style for every reveal target on the page at once, and at five seconds in
     * the visitor is usually mid-scroll — which turns the safety net into a
     * ~60ms long task and a visibly dropped frame. Instead it runs when the main
     * thread is idle, and only reveals elements that are genuinely still hidden
     * *and* already past the fold, so in the normal case it touches nothing.
     */
    let failsafeHandle = 0;

    const runFailsafe = () => {
      document
        .querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)')
        .forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('is-revealed');
          }
        });
    };

    const failsafe = window.setTimeout(() => {
      const idle = window.requestIdleCallback;
      failsafeHandle = idle
        ? idle(runFailsafe, { timeout: 2000 })
        : window.setTimeout(runFailsafe, 0);
    }, 5000);

    /**
     * ScrollTrigger measures against layout, and on a phone layout is still
     * settling long after `load` — fonts swap, and every below-the-fold image
     * is lazy. A refresh on each of those events keeps scrubbed triggers
     * (the process rail, the desktop card deck) honest.
     */
    const refresh = () => ScrollTrigger.refresh();
    const onLoad = () => refresh();
    window.addEventListener('load', onLoad);
    void document.fonts?.ready.then(refresh);

    /**
     * Width-only resize handling. Mobile browsers fire `resize` on every
     * address-bar collapse; refreshing there would recalculate every trigger
     * mid-scroll, which is the jump `ignoreMobileResize` exists to prevent.
     * An orientation change is a real layout change and always refreshes.
     */
    let lastWidth = window.innerWidth;
    let resizeTimer = 0;

    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(refresh, 150);
    };

    const onOrientation = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(refresh, 250);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onOrientation);

    const cleanupBase = () => {
      window.clearTimeout(failsafe);
      if (failsafeHandle) {
        window.cancelIdleCallback?.(failsafeHandle);
        window.clearTimeout(failsafeHandle);
      }
      window.clearTimeout(resizeTimer);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onOrientation);
    };

    if (prefersReducedMotion()) return cleanupBase;

    /**
     * Lenis is a wheel-input device, and only a wheel-input device.
     *
     * A touchscreen already scrolls smoothly: iOS and Android run the gesture
     * and its momentum on the compositor thread, independently of whatever the
     * main thread is busy with, at the display's full refresh rate. Handing that
     * to a JavaScript scroller replaces it with a per-frame main-thread
     * simulation — so on the device where the main thread is slowest, the
     * "smooth scrolling" library is what makes the scroll stutter, and every
     * frame it drops is a frame the finger has already moved past.
     *
     * A mouse wheel has no such native momentum, which is where the library
     * genuinely earns its place. So: smooth wheel on pointer devices, untouched
     * native scrolling on phones and tablets.
     */
    const canSmooth = window.matchMedia('(hover: hover) and (pointer: fine)')
      .matches;

    if (!canSmooth) return cleanupBase;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      // Lenis drives its own frame loop, so GSAP's ticker — and the
      // `lagSmoothing` question that comes with sharing it — stays out of it.
      autoRaf: true,
    });

    setLenis(lenis);

    /**
     * `ScrollTrigger.update` walks every registered trigger. Lenis emits a
     * scroll event per animated frame, so the update is coalesced onto a single
     * rAF tick rather than running more than once per painted frame.
     */
    let queued = false;
    const scheduleUpdate = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        ScrollTrigger.update();
      });
    };

    lenis.on('scroll', scheduleUpdate);

    return () => {
      cleanupBase();
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
