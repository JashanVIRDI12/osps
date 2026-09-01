'use client';

import { useRef } from 'react';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import { scrollToHash } from '@/lib/scroll';
import { hero, site } from '@/lib/content';
import { RotatingWord } from '@/components/ui/RotatingWord';
import { CountUp } from '@/components/ui/CountUp';
import { LoopVideo } from '@/components/ui/LoopVideo';
import { AetherRibbonMesh } from '@/components/ui/aether-ribbon-mesh';

const HERO_WORDS = ['depend', 'rely', 'trust', 'count'];

/**
 * Split hero: the claim and its evidence side by side rather than copy laid
 * over a dimmed backdrop. The portrait delivery clip is proof of the headline,
 * not decoration behind it, so it gets its own frame at full quality instead
 * of competing with body text for legibility under a scrim.
 *
 * On a phone the clip is a 4:5 card the width of the shell — a 9:16 portrait
 * at this width is more than half a screen on its own, and stacked under the
 * copy it would push the rest of the page out of reach.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Entrance only. This is a one-shot stagger on load, not a scroll-linked
   * tween, so it cannot leave anything stranded part-way through.
   */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-reveal]',
        { opacity: 0, y: reduced ? 0 : 26 },
        {
          opacity: 1,
          y: 0,
          duration: reduced ? 0.5 : 0.95,
          ease: 'power3.out',
          stagger: reduced ? 0.04 : 0.08,
          delay: 0.15,
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label={`${site.name}: introduction`}
      className="hero-shell relative isolate flex w-full items-center overflow-hidden bg-canvas"
    >
      {/* Ambient wash — desktop only. A full-viewport canvas tick on a phone
          is the kind of decoration that costs frames the copy does not need. */}
      <AetherRibbonMesh className="-z-10 hidden lg:block" />

      <div className="shell grid w-full items-center gap-8 py-[calc(5.75rem+env(safe-area-inset-top,0px))] pb-12 sm:gap-10 sm:pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-20 xl:gap-16">
        {/* Copy column */}
        <div className="flex min-w-0 flex-col items-start text-left">
          <span className="eyebrow max-w-full whitespace-normal text-left leading-snug" data-hero-reveal>
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {hero.eyebrow}
          </span>

          <h1
            className="heading-section-lg mt-5 max-w-xl text-ink"
            data-hero-reveal
          >
            Healthcare supplies you can{' '}
            <RotatingWord words={HERO_WORDS} intervalMs={3000} /> on.
          </h1>

          <p
            className="mt-5 max-w-lg text-pretty text-[0.95rem] leading-[1.55] text-ink-muted xs:text-body sm:mt-6 sm:text-subheading"
            data-hero-reveal
          >
            Pharmaceuticals, surgical consumables, medical devices and hospital
            essentials, sourced from certified manufacturers and delivered on
            the day we commit to.
          </p>

          <div
            className="mt-7 flex w-full flex-col items-stretch gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center"
            data-hero-reveal
          >
            <a
              href={hero.primaryCta.href}
              onClick={(event) => {
                if (scrollToHash(hero.primaryCta.href)) event.preventDefault();
              }}
              className="btn-accent px-6 py-3.5"
            >
              {hero.primaryCta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={hero.secondaryCta.href}
              onClick={(event) => {
                if (scrollToHash(hero.secondaryCta.href)) event.preventDefault();
              }}
              className="btn-outline px-6 py-3.5"
            >
              {hero.secondaryCta.label}
            </a>
          </div>

          <dl
            className="mt-8 grid w-full grid-cols-3 gap-3 border-t border-line pt-6 xs:mt-10 xs:gap-6 sm:max-w-md sm:gap-9"
            data-hero-reveal
          >
            {hero.stats.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dd>
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    className="text-[1.35rem] font-semibold leading-none tracking-[-0.04em] text-royal xs:text-[1.7rem] sm:text-[2rem]"
                  />
                </dd>
                <dt className="mt-1.5 text-[0.62rem] font-medium uppercase leading-snug tracking-[0.08em] text-ink-soft xs:text-caption xs:tracking-[0.1em]">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Delivery showcase — 3:4 so the portrait clip has real height
            instead of a landscape crop. Capped on large screens so it still
            sits beside the copy rather than becoming a second viewport. */}
        <div className="relative w-full min-w-0" data-hero-reveal>
          <LoopVideo
            src={hero.delivery.video}
            audioSrc={hero.delivery.audio}
            poster={hero.delivery.poster}
            alt={hero.delivery.alt}
            label={hero.delivery.videoLabel}
            channel="hero"
            priority
            className="aspect-[3/4] w-full rounded-card-elevated border border-line shadow-card-hover lg:max-h-[44rem]"
          >
            <div className="absolute left-3 right-3 top-3 flex items-center gap-2.5 rounded-card border border-white/20 bg-royal-deep/80 p-2.5 shadow-card xs:left-4 xs:right-4 xs:top-4 xs:gap-3 xs:p-3.5 lg:bg-royal-deep/60">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-icon bg-accent text-white xs:h-10 xs:w-10">
                <Zap
                  className="h-4 w-4 xs:h-[18px] xs:w-[18px]"
                  fill="currentColor"
                  aria-hidden="true"
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[0.85rem] font-semibold leading-tight text-white xs:text-[0.95rem]">
                  {hero.delivery.badge}
                </p>
                <p className="truncate text-[0.7rem] text-white/75 xs:text-[0.75rem]">
                  {hero.delivery.badgeSub}
                </p>
              </div>
            </div>
          </LoopVideo>
        </div>
      </div>
    </section>
  );
}
