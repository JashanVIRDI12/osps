'use client';

import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';
import { useReveal } from '@/lib/motion';
import { headlineStats, whyChooseUs } from '@/lib/content';
import { CountUp } from '@/components/ui/CountUp';

/**
 * The numbers, on the page's one royal-fill block — a single highlighted metric
 * surface so the figures read as the page's evidence, not decoration.
 */
export function MetricsBand() {
  const ref = useReveal<HTMLElement>({ stagger: 0.09 });

  return (
    <section ref={ref} className="section-base py-20 sm:py-24 lg:py-28">
      <div className="shell">
        <div className="overflow-hidden rounded-card-elevated border border-royal-line bg-royal">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
            <div className="p-6 xs:p-8 sm:p-10 lg:p-12">
              <h2
                className="heading-section heading-section-invert max-w-lg"
                data-reveal
              >
                <span className="heading-kicker heading-kicker-invert">
                  {whyChooseUs.label}
                </span>
                {whyChooseUs.heading}
              </h2>

              <p
                className="mt-5 max-w-lg text-pretty text-body-sm leading-relaxed text-royal-mist"
                data-reveal
              >
                {whyChooseUs.body}
              </p>

              {/* Two columns are ~104px wide inside a 320px card, which a
                  2.6rem figure fills exactly — the smaller step keeps the
                  numbers and their labels from colliding. */}
              <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-7 xs:mt-10 xs:gap-x-6 xs:gap-y-8">
                {headlineStats.map((stat) => (
                  <div key={stat.label} data-reveal>
                    <dd>
                      <CountUp
                        value={stat.value}
                        suffix={stat.suffix}
                        className="text-[2.2rem] font-semibold leading-none tracking-[-0.05em] text-white xs:text-[2.6rem] sm:text-[3rem]"
                      />
                    </dd>
                    <dt className="mt-2 text-caption font-medium uppercase tracking-[0.12em] text-royal-mist/90">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative min-h-[280px] lg:min-h-full" data-reveal>
              <Image
                src={whyChooseUs.image.src}
                alt={whyChooseUs.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-royal/95 via-royal/30 to-transparent lg:bg-gradient-to-r lg:from-royal/95 lg:via-royal/20 lg:to-transparent"
              />

              <ul className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2 xs:inset-x-6 xs:bottom-6">
                {whyChooseUs.pointers.map((pointer) => (
                  <li
                    key={pointer}
                    className="inline-flex items-center gap-1.5 rounded-pill border border-white/30 bg-royal-deep/60 px-3 py-1.5 text-caption font-medium text-white backdrop-blur-md"
                  >
                    <BadgeCheck
                      className="h-3.5 w-3.5 text-accent-soft"
                      aria-hidden="true"
                    />
                    {pointer}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
