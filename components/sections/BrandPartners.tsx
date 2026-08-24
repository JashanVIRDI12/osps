'use client';

/* eslint-disable @next/next/no-img-element */

import { useReveal } from '@/lib/motion';
import { brandPartners } from '@/lib/content';

/**
 * The manufacturer wall, in two halves: the proof and the claim.
 *
 * Six logos on their own were thin — they showed that a handful of names are
 * real without saying anything about the catalogue those names add up to, which
 * is the part a purchase manager is buying. So the marks now sit over a figure
 * strip that states the shape of the range, and the right-hand panel carries
 * what the wall is actually arguing: that the six are a sample, and that all of
 * it arrives on one purchase order.
 *
 * Logos only — a brand with no artwork is not rendered. The roster in
 * `content.ts` is deliberately longer than this grid: it is the record of what
 * is carried and the queue for artwork, and a brand joins the moment it has a
 * `logo`, with no change needed here.
 */
export function BrandPartners() {
  const ref = useReveal<HTMLElement>({ stagger: 0.06 });

  const branded = brandPartners.brands.filter((brand) => brand.logo);

  return (
    <section
      ref={ref}
      className="section-base relative overflow-hidden py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <div className="max-w-2xl">
          <h2 className="heading-section max-w-none" data-reveal>
            <span className="heading-kicker">{brandPartners.eyebrow}</span>
            {brandPartners.heading}
          </h2>
          <p className="mt-6 text-pretty text-body text-ink-muted" data-reveal>
            {brandPartners.lead}
          </p>
        </div>

        <div className="mt-12 sm:mt-14">
          <div className="overflow-hidden rounded-card-elevated border border-line">
            <ul className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-4">
              {branded.map((brand) => (
                <li
                  key={brand.name}
                  data-reveal
                  className="group grid min-h-[7.5rem] place-items-center bg-surface p-6 transition-colors duration-300 hover:bg-royal-tint sm:min-h-[9rem]"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    loading="lazy"
                    decoding="async"
                    style={{ transform: `scale(${brand.scale ?? 1})` }}
                    className="h-10 w-auto max-w-[8.5rem] object-contain opacity-70 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0 sm:h-11"
                  />
                </li>
              ))}

              {/**
               * The roster's closing line, given a cell rather than a caption.
               * It fills the remainder of the last row at every breakpoint, so
               * the grid never ends on a ragged gap — and it is the honest
               * statement of scale, six marks being a sample rather than a list.
               */}
              <li
                data-reveal
                className="col-span-2 flex min-h-[7.5rem] items-center bg-royal-tint p-6 sm:col-span-3 sm:min-h-[9rem] lg:col-span-2"
              >
                <p className="text-balance text-[1.15rem] font-semibold leading-snug tracking-[-0.03em] text-royal sm:text-[1.3rem]">
                  {brandPartners.moreLabel}
                </p>
              </li>
            </ul>

            {/* The shape of the range, under the names that make it up. */}
            <dl className="grid grid-cols-3 gap-px border-t border-line bg-line">
              {brandPartners.figures.map((figure) => (
                <div
                  key={figure.label}
                  data-reveal
                  className="bg-surface px-4 py-5 sm:px-6 sm:py-6"
                >
                  <dd className="text-[1.7rem] font-semibold leading-none tracking-[-0.05em] text-royal sm:text-[2.1rem]">
                    {figure.value}
                  </dd>
                  <dt className="mt-2.5 font-utility text-[0.62rem] uppercase leading-[1.35] tracking-[0.16em] text-ink-soft sm:text-[0.68rem]">
                    {figure.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
