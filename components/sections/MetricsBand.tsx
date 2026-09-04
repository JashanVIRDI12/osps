'use client';

import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';
import { useReveal } from '@/lib/motion';
import { headlineStats, whyChooseUs } from '@/lib/content';
import { CountUp } from '@/components/ui/CountUp';

/**
 * The numbers, on the page's one royal-fill block — a single highlighted metric
 * surface so the figures read as the page's evidence, not decoration.
 *
 * Three rules hold the block together. The copy and the photograph meet on a
 * hard vertical cut with a single hairline, because the brand breaks light and
 * royal by cutting rather than by blending — the earlier mask-and-blur seam
 * bled royal across the photo and left the subject under a wash. The
 * certifications sit with the copy instead of floating over the image, so no
 * pill can be clipped by the seam and the photograph stays a photograph. And
 * the four figures run as one full-width rail beneath both columns, ruled by
 * hairline gaps, so they read as a ledger closing the block rather than as a
 * loose 2x2 grid floating in the panel.
 *
 * The rail draws its rules with `gap-px` over the border colour rather than
 * per-cell borders: the same markup rules correctly at two columns and at four,
 * with no first-in-row exceptions to keep in sync.
 */
export function MetricsBand() {
  const ref = useReveal<HTMLElement>({ stagger: 0.09 });

  return (
    <section ref={ref} className="section-base py-16 sm:py-24 lg:py-28">
      <div className="shell">
        <div className="overflow-hidden rounded-card-elevated border border-royal-line bg-royal-deep shadow-card">
          <div className="grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
            <div className="p-5 xs:p-8 sm:p-10 lg:p-12">
              <h2 className="heading-section max-w-lg" data-reveal>
                <span className="heading-kicker text-accent-deep">
                  {whyChooseUs.label}
                </span>
                {whyChooseUs.heading}
              </h2>

              <p
                className="mt-5 max-w-lg text-pretty text-body leading-relaxed text-royal-mist"
                data-reveal
              >
                {whyChooseUs.body}
              </p>

              <ul
                className="mt-7 flex flex-wrap gap-2 xs:mt-8"
                data-reveal
              >
                {whyChooseUs.pointers.map((pointer) => (
                  <li
                    key={pointer}
                    className="inline-flex items-center gap-1.5 rounded-pill border border-white/70 bg-surface/85 px-2.5 py-1.5 text-[0.7rem] font-semibold tracking-[-0.01em] text-ink xs:text-body-sm"
                  >
                    <BadgeCheck
                      className="h-3.5 w-3.5 shrink-0 text-royal xs:h-4 xs:w-4"
                      aria-hidden="true"
                    />
                    {pointer}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hard cut, one hairline — no wash, no bleed over the subject. */}
            <div
              className="relative aspect-[16/10] border-t border-royal-mist/20 sm:aspect-[2/1] lg:aspect-auto lg:min-h-full lg:border-l lg:border-t-0"
              data-reveal
            >
              <Image
                src={whyChooseUs.image.src}
                alt={whyChooseUs.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_35%]"
              />
            </div>
          </div>

          {/* The ledger. `gap-px` over the border colour draws the rules. */}
          <dl className="grid grid-cols-2 gap-px border-t border-royal-mist/20 bg-royal-mist/20 sm:grid-cols-4">
            {headlineStats.map((stat) => (
              <div
                key={stat.label}
                data-reveal
                className="bg-royal-deep px-5 py-6 xs:px-7 xs:py-8 lg:px-8 lg:py-9"
              >
                <dd>
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    className="text-[2rem] font-semibold leading-none tracking-[-0.05em] text-ink xs:text-[2.4rem] lg:text-[2.75rem]"
                  />
                </dd>
                <dt className="mt-2.5 font-utility text-[0.62rem] uppercase leading-snug tracking-[0.14em] text-royal-mist xs:text-[0.68rem]">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
