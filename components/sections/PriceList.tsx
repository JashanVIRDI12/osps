'use client';

import { ArrowRight, Download, FileSpreadsheet } from 'lucide-react';
import { useReveal } from '@/lib/motion';
import { scrollToHash } from '@/lib/scroll';
import { priceList } from '@/lib/content';
import { CountUp } from '@/components/ui/CountUp';

/**
 * The full SKU list as a file download.
 *
 * The catalogue above is the curated fifteen categories; this is the long tail —
 * every code a procurement team might need to price against. The download is a
 * plain anchor with `download`, so it needs no JavaScript to work.
 */
export function PriceList() {
  const ref = useReveal<HTMLElement>({ stagger: 0.08 });
  const { file } = priceList;

  return (
    <section ref={ref} className="section-base py-20 sm:py-24 lg:py-28">
      <div className="shell">
        <div className="overflow-hidden rounded-card-elevated border border-line bg-surface shadow-card">
          <div className="grid gap-8 p-6 xs:p-7 sm:gap-10 sm:p-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:p-12">
            <div>
              <h2 className="heading-section max-w-xl" data-reveal>
                <span className="heading-kicker">{priceList.eyebrow}</span>
                {priceList.heading}
              </h2>

              <p
                className="mt-5 max-w-xl text-pretty text-body text-ink-muted"
                data-reveal
              >
                {priceList.lead}
              </p>

              <div
                className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center"
                data-reveal
              >
                <a
                  href={priceList.cta.href}
                  download={file.name}
                  className="btn-primary w-full px-6 py-3.5 sm:w-auto"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  {priceList.cta.label}
                  <span className="sr-only">
                    {` (${file.format}, ${file.size})`}
                  </span>
                </a>

                <a
                  href={priceList.secondaryCta.href}
                  onClick={(event) => {
                    if (scrollToHash(priceList.secondaryCta.href)) {
                      event.preventDefault();
                    }
                  }}
                  className="tap-target group inline-flex items-center justify-center gap-2 text-body font-medium text-royal transition-colors hover:text-royal-bright sm:justify-start"
                >
                  {priceList.secondaryCta.label}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>

            {/* File card */}
            <div
              className="flex flex-col gap-5 rounded-card border border-royal-wash bg-royal-tint p-5 xs:p-6 sm:p-7"
              data-reveal
            >
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-icon bg-royal text-white">
                  <FileSpreadsheet className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-body font-semibold text-ink">
                    {file.name}
                  </p>
                  <p className="text-caption font-medium uppercase tracking-[0.12em] text-ink-soft">
                    {`${file.format} · ${file.size}`}
                  </p>
                </div>
              </div>

              <dl className="flex flex-col gap-3 border-t border-royal-wash pt-5">
                {priceList.sheets.map((sheet) => (
                  <div
                    key={sheet.label}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <dt className="text-body-sm text-ink-muted">
                      {sheet.label}
                    </dt>
                    <dd className="text-body font-semibold text-royal">
                      <CountUp value={sheet.count} />
                    </dd>
                  </div>
                ))}

                <div className="flex items-baseline justify-between gap-4 border-t border-royal-wash pt-3">
                  <dt className="text-body-sm font-medium text-ink">
                    Total line items
                  </dt>
                  <dd className="text-heading-sm font-semibold text-ink">
                    <CountUp value={priceList.total} />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
