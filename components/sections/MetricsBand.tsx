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
 * Desktop tucks the photograph under the copy and dissolves the seam. Stacked
 * on a phone that same dissolve ate the top of the image and left a smeared
 * blue band, so below `lg` the photo is just a photograph: a 16:10 crop with a
 * short lift at the bottom for the pills.
 */
export function MetricsBand() {
  const ref = useReveal<HTMLElement>({ stagger: 0.09 });

  return (
    <section ref={ref} className="section-base py-16 sm:py-24 lg:py-28">
      <div className="shell">
        <div className="overflow-hidden rounded-card-elevated border border-royal-line bg-royal-deep">
          <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            <div className="relative z-10 bg-royal-deep p-5 xs:p-8 sm:p-10 lg:bg-[linear-gradient(90deg,var(--color-royal-deep)_0%,var(--color-royal-deep)_70%,transparent_100%)] lg:p-12">
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
                className="mt-5 max-w-lg text-pretty text-body-sm leading-relaxed text-ink"
                data-reveal
              >
                {whyChooseUs.body}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 xs:mt-10 xs:gap-x-6 xs:gap-y-8">
                {headlineStats.map((stat) => (
                  <div key={stat.label} data-reveal>
                    <dd>
                      <CountUp
                        value={stat.value}
                        suffix={stat.suffix}
                        className="text-[1.9rem] font-semibold leading-none tracking-[-0.05em] text-ink xs:text-[2.6rem] sm:text-[3rem]"
                      />
                    </dd>
                    <dt className="mt-2 text-[0.62rem] font-medium uppercase leading-snug tracking-[0.1em] text-royal-mist xs:text-caption xs:tracking-[0.12em]">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            <div
              className="relative aspect-[16/10] bg-royal-shade sm:aspect-[2/1] lg:aspect-auto lg:-ml-32 lg:min-h-full"
              data-reveal
            >
              <div className="absolute inset-0 lg:[mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.2)_18%,black_48%)]">
                <Image
                  src={whyChooseUs.image.src}
                  alt={whyChooseUs.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-[center_35%]"
                />
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-[-12%] left-[-8%] hidden w-[62%] lg:block"
                style={{
                  backgroundImage: `url(${whyChooseUs.image.src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 35%',
                  filter: 'blur(36px) saturate(1.2)',
                  transform: 'scale(1.18)',
                  maskImage:
                    'linear-gradient(90deg, black 0%, black 36%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(90deg, black 0%, black 36%, transparent 100%)',
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent lg:bg-[linear-gradient(90deg,var(--color-royal)_0%,color-mix(in_srgb,var(--color-royal)_62%,transparent)_22%,transparent_56%)]"
              />

              <ul className="absolute inset-x-4 bottom-4 z-[1] flex flex-wrap gap-1.5 xs:inset-x-6 xs:bottom-6 xs:gap-2">
                {whyChooseUs.pointers.map((pointer) => (
                  <li
                    key={pointer}
                    className="inline-flex items-center gap-1.5 rounded-pill border border-white/30 bg-ink/85 px-2.5 py-1 text-[0.65rem] font-medium text-white xs:px-3 xs:py-1.5 xs:text-caption lg:bg-ink/60 lg:backdrop-blur-md"
                  >
                    <BadgeCheck
                      className="h-3.5 w-3.5 shrink-0 text-accent-soft"
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
