'use client';

import dynamic from 'next/dynamic';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useReveal } from '@/lib/motion';
import { exportGateway } from '@/lib/content';

/**
 * `cobe` plus this canvas is the heaviest module on the page and it renders two
 * thirds of the way down, so it loads on demand rather than in the first
 * payload. The placeholder is the same aspect-square box the globe occupies, so
 * nothing reflows when it arrives — this must not become a CLS source.
 */
const Globe = dynamic(
  () =>
    import('@/components/ui/globe-feature-section').then((mod) => mod.Globe),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="relative mx-auto aspect-square w-full max-w-[520px]"
      >
        <div className="absolute inset-[8%] rounded-full bg-royal/10 blur-2xl" />
      </div>
    ),
  }
);

/** Mirrors the destination groups the globe draws lanes to. */
const EXPORT_REGIONS = [
  'Gulf & Middle East',
  'South Asia',
  'South-East Asia',
  'East & West Africa',
  'Europe',
  'Americas',
];

/**
 * Hand-off for international buyers — OSPS is the domestic site; CHW covers
 * export. The animated globe keeps the section clearly about overseas markets.
 */
export function ExportGlobe() {
  const ref = useReveal<HTMLElement>({ stagger: 0.08 });

  return (
    <section ref={ref} className="section-base relative py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <div
          className="relative overflow-hidden rounded-card-elevated border border-line bg-surface px-5 py-10 shadow-card xs:px-6 xs:py-12 sm:px-10 sm:py-16 lg:px-14"
          data-reveal
        >
          {/* Dot grid, echoing the globe's own dot map. Masked so it fades out
              before it reaches the copy. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle, var(--color-royal) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
              opacity: 0.12,
              maskImage:
                'radial-gradient(120% 100% at 100% 50%, #000 30%, transparent 72%)',
              WebkitMaskImage:
                'radial-gradient(120% 100% at 100% 50%, #000 30%, transparent 72%)',
            }}
          />

          <div className="relative flex flex-col-reverse items-center justify-between gap-10 md:flex-row md:gap-12">
            <div className="z-10 max-w-xl text-left">
              <p className="heading-kicker !mb-4">{exportGateway.eyebrow}</p>
              <h2 className="text-balance text-[1.6rem] font-semibold leading-[1.1] tracking-[-0.04em] text-ink xs:text-[1.85rem] sm:text-[2.4rem]">
                {exportGateway.heading}{' '}
                <span className="font-medium text-ink-muted">
                  {exportGateway.body}
                </span>
              </h2>

              {/* Names the lanes on the globe, so the animation reads as
                  information rather than decoration. */}
              <ul className="mt-8 flex flex-wrap gap-2">
                {EXPORT_REGIONS.map((region) => (
                  <li
                    key={region}
                    className="rounded-pill border border-royal-wash bg-royal-tint px-3 py-1.5 text-caption font-medium text-royal"
                  >
                    {region}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                <a
                  href={exportGateway.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full px-6 py-3.5 sm:w-auto"
                >
                  {exportGateway.cta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={exportGateway.secondaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target inline-flex items-center justify-center gap-1.5 text-body font-medium text-royal transition-colors hover:text-royal-bright sm:justify-start"
                >
                  {exportGateway.secondaryLabel}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* The upscale only makes sense once the layout goes side by side
                at `md` and the globe is confined to a narrow 46% column. While
                it is stacked full-width it already fills its box, and the card
                clips its overflow — so the old 110%/125% simply sliced the
                sphere's left and right edges off on every phone and small
                tablet. */}
            <div className="relative flex w-full max-w-xl shrink-0 items-center justify-center md:w-[46%]">
              <Globe className="md:scale-125 lg:scale-[1.35]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
