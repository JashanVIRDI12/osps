'use client';

import { useReveal } from '@/lib/motion';
import { coreValues, industries } from '@/lib/content';
import { HorizontalScrollCarousel } from '@/components/ui/horizontal-scroll-carousel';

/**
 * Who we supply as a horizontal scroll deck, then how we behave — paired on one
 * light surface because both answer the same procurement question.
 *
 * Nine audiences is too many for a grid without the page turning into a wall of
 * equal-weight tiles, so the deck gives each one a full card and lets the scroll
 * do the pacing.
 */
export function IndustriesValues() {
  const ref = useReveal<HTMLElement>({ stagger: 0.05 });

  return (
    <section ref={ref} className="section-base relative py-20 sm:py-24 lg:py-28">
      <HorizontalScrollCarousel
        items={industries.slides}
        header={
          <div className="shell">
            <div className="max-w-2xl">
              <h2 className="heading-section max-w-none" data-reveal>
                <span className="heading-kicker">{industries.eyebrow}</span>
                {industries.heading}
              </h2>
              <p
                className="mt-6 text-pretty text-body text-ink-muted"
                data-reveal
              >
                {industries.lead}
              </p>
            </div>
          </div>
        }
      />

      <div className="shell">
        <div className="mt-20 border-t border-line pt-14 sm:mt-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="heading-section max-w-none" data-reveal>
                <span className="heading-kicker">{coreValues.eyebrow}</span>
                {coreValues.heading}
              </h2>
            </div>
          </div>

          <dl className="mt-10 grid gap-px overflow-hidden rounded-card-elevated border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {coreValues.items.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="bg-surface px-6 py-8 transition-colors duration-300 hover:bg-royal-tint"
                  data-reveal
                >
                  <Icon className="h-6 w-6 text-royal" aria-hidden="true" />
                  <dt className="mt-5 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">
                    {value.title}
                  </dt>
                  <dd className="mt-2.5 text-pretty text-body-sm leading-relaxed text-ink-soft">
                    {value.description}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
