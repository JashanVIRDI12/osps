'use client';

import { ArrowUpRight } from 'lucide-react';
import { useReveal } from '@/lib/motion';
import { scrollToHash } from '@/lib/scroll';
import { about, hero, site } from '@/lib/content';
import { CountUp } from '@/components/ui/CountUp';
import { HexPattern } from '@/components/ui/HexPattern';
import { MedicalLineArt } from '@/components/ui/MedicalLineArt';

/**
 * Opening statement. The left column carries the claim, the right column proves
 * it with numbers — so the eye lands on the sentence, then on the evidence.
 */
export function AboutBlock() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="about"
      className="section-base relative overflow-hidden py-20 sm:py-24 lg:py-28"
    >
      {/**
       * Decorative backdrop, in two tiers.
       *
       * The blooms used to be a pair of 576px and 512px circles under a
       * `blur(64px)` filter. A filtered element that large cannot be cached as a
       * plain texture — it is re-rastered whenever the section is repainted,
       * which on a scrolling phone is often. They are replaced below `lg` by two
       * radial gradients painted straight onto the section background: the same
       * soft royal glow, at the cost of an ordinary background paint.
       *
       * The honeycomb is desktop-only outright. It is a tiled SVG pattern under
       * two stacked masks composited with `intersect`, and mask compositing is
       * both expensive and the least reliably accelerated of the three on mobile
       * GPUs. At phone scale the pattern reads as faint noise anyway.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(36rem 36rem at 108% -12%, rgba(29,63,191,0.10), transparent 62%), radial-gradient(32rem 32rem at -18% 112%, rgba(29,63,191,0.06), transparent 62%)',
        }}
      >
        {/* Honeycomb, faded at the top and bottom edges so it never hard-cuts
            at the section seam, and thinned across the copy column. */}
        <div
          className="absolute inset-0 hidden text-royal/[0.09] lg:block"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent), radial-gradient(85% 75% at 78% 45%, #000 35%, rgba(0,0,0,0.45) 100%)',
            maskComposite: 'intersect',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent), radial-gradient(85% 75% at 78% 45%, #000 35%, rgba(0,0,0,0.45) 100%)',
            WebkitMaskComposite: 'source-in',
          }}
        >
          <HexPattern className="h-full w-full" />
        </div>
      </div>

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="flex flex-col items-start">
            <h2 className="heading-section-lg" data-reveal>
              <span className="heading-kicker">{about.eyebrow}</span>
              {about.statement}
            </h2>

            <p
              className="mt-7 max-w-xl text-pretty text-body text-ink-muted"
              data-reveal
            >
              {about.lead}
            </p>

            <p
              className="mt-5 max-w-xl text-pretty text-body-sm leading-relaxed text-ink-soft"
              data-reveal
            >
              {about.body}
            </p>

            <a
              href={about.cta.href}
              onClick={(event) => {
                if (scrollToHash(about.cta.href)) event.preventDefault();
              }}
              className="tap-target group mt-9 inline-flex items-center gap-2 text-body font-medium text-royal transition-colors hover:text-royal-bright"
              data-reveal
            >
              {about.cta.label}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>

          <div className="flex flex-col gap-6">
            <dl className="card divide-y divide-line" data-reveal>
              {hero.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-baseline justify-between gap-4 px-5 py-5 xs:gap-6 xs:px-6 xs:py-6 sm:px-7"
                >
                  <dt className="text-body-sm text-ink-muted">{stat.label}</dt>
                  <dd>
                    {/* On a 320px card the label and a 2.4rem figure together
                        are wider than the row, and the label breaks mid-word. */}
                    <CountUp
                      value={stat.value}
                      suffix={stat.suffix}
                      className="text-[2rem] font-semibold leading-none tracking-[-0.04em] text-royal xs:text-[2.4rem] sm:text-[2.9rem]"
                    />
                  </dd>
                </div>
              ))}
            </dl>

            <div
              className="card-metric relative flex items-end overflow-hidden px-5 pb-5 pt-7 xs:px-6 xs:pb-6 xs:pt-8"
              data-reveal
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-10 w-32 text-white/30 xs:w-40 sm:w-52"
              >
                <MedicalLineArt className="h-auto w-full" />
              </div>
              <p className="relative max-w-[20ch] text-balance text-[1.3rem] font-semibold leading-tight tracking-[-0.03em] text-white xs:text-heading-sm">
                {`Supplying healthcare institutions since ${site.founded}.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
