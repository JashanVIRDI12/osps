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
      {/* Ambient wash — the split layout has no full-bleed backdrop of its own,
          so an animated ribbon mesh in the royal/teal pairing keeps the canvas
          from reading as bare white. Falls back to the flat `bg-canvas` above
          under reduced motion, since the mesh itself renders nothing then. */}
      <AetherRibbonMesh className="-z-10" />

      <div className="shell grid w-full items-center gap-14 py-24 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-20 xl:gap-16">
        {/* Copy column */}
        <div className="flex flex-col items-start text-left">
          <span className="eyebrow" data-hero-reveal>
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
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
            className="mt-7 flex w-full max-w-xs flex-col items-stretch gap-3 sm:mt-8 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center"
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
            className="mt-10 hidden w-full max-w-md items-start gap-6 border-t border-line pt-6 xs:flex sm:gap-9"
            data-hero-reveal
          >
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dd>
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    className="text-[1.7rem] font-semibold leading-none tracking-[-0.04em] text-royal sm:text-[2rem]"
                  />
                </dd>
                <dt className="mt-1.5 text-caption font-medium uppercase tracking-[0.1em] text-ink-soft">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Delivery showcase — the proof, framed as a portrait card rather
            than a full-bleed backdrop, so the footage stays at full clarity. */}
        <div
          className="relative mx-auto w-full max-w-[300px] xs:max-w-[340px] lg:mx-0 lg:max-w-none"
          data-hero-reveal
        >
          <LoopVideo
            src={hero.delivery.video}
            poster={hero.delivery.poster}
            alt={hero.delivery.alt}
            label={hero.delivery.videoLabel}
            priority
            className="aspect-[9/16] w-full rounded-card-elevated border border-line shadow-card-hover lg:max-h-[36rem]"
          >
            {/* Badge — the headline's evidence, named on the card itself. */}
            <div className="absolute left-4 right-4 top-4 flex items-center gap-3 rounded-card border border-white/20 bg-royal-deep/75 p-3.5 shadow-card backdrop-blur-md lg:bg-royal-deep/60">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-icon bg-accent text-white">
                <Zap
                  className="h-[18px] w-[18px]"
                  fill="currentColor"
                  aria-hidden="true"
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[0.95rem] font-semibold leading-tight text-white">
                  {hero.delivery.badge}
                </p>
                <p className="truncate text-[0.75rem] text-white/75">
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
