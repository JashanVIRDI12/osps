'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
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
    let lenis: Lenis | null = null;

    const refresh = () => {
      /**
       * Lenis caches the document height and clamps its target scroll to it.
       * That measurement is taken at construction, before the fonts have
       * swapped and before a single lazy image below the fold has landed — so
       * without this the wheel simply stops a few hundred pixels short of the
       * footer, which reads as the page being broken. It has to run *before*
       * ScrollTrigger re-measures, so both agree on how tall the page is.
       */
      lenis?.resize();
      ScrollTrigger.refresh();
    };

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

    lenis = new Lenis({
      /**
       * `duration` + an expo-out curve rather than `lerp`.
       *
       * `lerp` moves a fixed *fraction* of the remaining distance per frame, so
       * its settle time is whatever the frame rate happens to be — the same
       * wheel gesture glides noticeably longer on a 60Hz panel than on a 120Hz
       * one. A duration is wall-clock, so the scroll feels identical on both.
       *
       * 0.9s is the shortest setting where the tail still reads as deceleration
       * rather than a stop. The curve below is expo-out: ~80% of the distance is
       * covered in the first third of that, so the page answers the wheel almost
       * immediately and spends the rest of the time easing — which is what makes
       * it feel responsive and smooth at once, instead of floaty.
       */
      duration: 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      /**
       * One wheel notch should still travel roughly the distance the OS says it
       * should — overshooting here is the single fastest way to make a smooth
       * scroller feel like it is fighting the user.
       */
      wheelMultiplier: 1,
      /**
       * GSAP's ticker drives the loop instead (below), so Lenis must not also
       * run one of its own.
       */
      autoRaf: false,
    });

    setLenis(lenis);

    /**
     * Lenis and ScrollTrigger have to advance inside the *same* tick, in this
     * order — and that is the whole reason the ticker is shared.
     *
     * Previously Lenis ran its own rAF and the ScrollTrigger update was pushed
     * to the *next* frame. So every pinned card in the deck and every scrubbed
     * scale was rendered against a scroll position one frame stale: the sticky
     * track had already moved, its scale tween had not. At 60Hz that is ~16ms of
     * disagreement on screen at all times, and it is exactly the shear/jitter
     * that makes a Lenis page feel worse than native scrolling.
     *
     * Driving `lenis.raf` from `gsap.ticker` collapses that to zero. Within one
     * tick: the ticker callback advances Lenis → Lenis emits `scroll`
     * synchronously → `ScrollTrigger.update` reads the position it just wrote →
     * GSAP then renders every tween against it. One frame, one truth.
     */
    lenis.on('scroll', ScrollTrigger.update);

    const drive = (time: number) => {
      // gsap.ticker reports seconds; Lenis wants milliseconds.
      lenis?.raf(time * 1000);
    };

    gsap.ticker.add(drive);

    /**
     * GSAP clamps the delta it reports after a slow frame, so tweens never jump
     * across a hitch. Applied to a scroll simulation that clamp is wrong: it
     * feeds Lenis less time than actually elapsed, so after any jank the page
     * drifts behind the wheel and takes a moment to catch up. The scroll should
     * track real time, always.
     */
    gsap.ticker.lagSmoothing(0);

    return () => {
      cleanupBase();
      gsap.ticker.remove(drive);
      // Back to GSAP's documented default, or a later mount inherits this.
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
      lenis = null;
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
