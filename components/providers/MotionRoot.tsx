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

    if (prefersReducedMotion()) {
      // Layout can shift as fonts and images settle; keep triggers accurate.
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      window.removeEventListener('load', onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
