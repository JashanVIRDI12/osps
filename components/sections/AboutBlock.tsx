'use client';

import { ArrowUpRight } from 'lucide-react';
import { useReveal } from '@/lib/motion';
import { scrollToHash } from '@/lib/scroll';
import { about, hero, site } from '@/lib/content';
import { CountUp } from '@/components/ui/CountUp';
import { HexPattern } from '@/components/ui/HexPattern';
import { LoopVideo } from '@/components/ui/LoopVideo';

/**
 * The opening claim, with the evidence directly under it.
 *
 * The previous version buried the numbers in a small tinted box wedged into the
 * bottom of the copy column, where the CTA collided with it and one label wrapped
 * while its neighbours did not. For a supplier the numbers *are* the argument —
 * a decade of continuous supply, counted — so they now run the full width of the
 * card as its base, on hairline-divided columns at figure scale.
 *
 * Moving them also frees the footage. The caption used to sit over the busiest
 * part of the frame, competing with a truck door; the founding year it carried
 * is now the fourth figure in the row, where it is legible and where it answers
 * the heading directly.
 */
export function AboutBlock() {
  const ref = useReveal<HTMLElement>();

  /**
   * The founding year is a fact of the same kind as the other three, and a
   * fourth column is what lets the row divide evenly rather than leaving a gap.
   */
  const figures = [
    ...hero.stats.map((stat) => ({
      value: stat.value,
      suffix: stat.suffix,
      label: stat.label,
      count: true,
    })),
    {
      value: site.founded,
      suffix: '',
      label: 'Supplying since',
      count: false,
    },
  ];

  return (
    <section
      ref={ref}
      id="about"
      className="section-base relative overflow-hidden py-20 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(36rem 36rem at 108% -12%, rgba(29,63,191,0.10), transparent 62%), radial-gradient(32rem 32rem at -18% 112%, rgba(29,63,191,0.06), transparent 62%)',
        }}
      >
        <div
          className="absolute inset-0 hidden text-royal/[0.09] lg:block"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent), linear-gradient(to right, transparent, black 42%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          }}
        >
          <HexPattern className="h-full w-full" />
        </div>
      </div>

      <div className="shell relative">
        <article className="overflow-hidden rounded-card-elevated border border-line bg-surface shadow-card">
          <div className="grid lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
            <div
              className="flex flex-col px-5 py-8 xs:px-7 sm:px-10 sm:py-11 lg:px-12 lg:py-14"
              data-reveal
            >
              <h2 className="heading-section-lg max-w-[18ch]">
                <span className="heading-kicker">{about.eyebrow}</span>
                {about.statement}
              </h2>

              <p className="mt-7 max-w-xl text-pretty text-body text-ink-muted">
                {about.lead}
              </p>
              <p className="mt-4 max-w-xl text-pretty text-body-sm leading-relaxed text-ink-soft">
                {about.body}
              </p>

              {/* `mt-auto` pins the link to the bottom of the copy column, so it
                  can never crowd whatever follows it. */}
              <a
                href={about.cta.href}
                onClick={(event) => {
                  if (scrollToHash(about.cta.href)) event.preventDefault();
                }}
                className="tap-target group mt-9 inline-flex w-fit items-center gap-2 text-body font-medium text-royal transition-colors hover:text-royal-bright lg:mt-auto lg:pt-10"
              >
                {about.cta.label}
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>

            <div className="relative bg-royal-deep lg:min-h-[30rem]">
              <LoopVideo
                src={about.video.src}
                poster={about.video.poster}
                alt={about.video.alt}
                label={about.video.videoLabel}
                className="aspect-[4/3] w-full xs:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
              />
            </div>
          </div>

          {/* The evidence. Full width, figure scale, hairline-divided. */}
          <dl className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
            {figures.map((figure) => (
              <div
                key={figure.label}
                className="bg-surface px-5 py-6 xs:px-6 sm:px-7 sm:py-8"
                data-reveal
              >
                <dd>
                  {figure.count ? (
                    <CountUp
                      value={figure.value}
                      suffix={figure.suffix}
                      className="text-[2rem] font-semibold leading-none tracking-[-0.05em] text-royal xs:text-[2.3rem] sm:text-[2.6rem]"
                    />
                  ) : (
                    <span className="block text-[2rem] font-semibold leading-none tracking-[-0.05em] text-royal xs:text-[2.3rem] sm:text-[2.6rem]">
                      {figure.value}
                    </span>
                  )}
                </dd>
                {/* Fixed two-line box, so a label that wraps cannot shunt its
                    neighbours' baselines out of alignment. */}
                <dt className="mt-3 font-utility text-[0.65rem] uppercase leading-[1.35] tracking-[0.16em] text-ink-soft sm:min-h-[2.7em] sm:text-[0.7rem]">
                  {figure.label}
                </dt>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </section>
  );
}
