'use client';

import { Download, FileSpreadsheet } from 'lucide-react';
import { useReveal } from '@/lib/motion';
import { companyNetwork } from '@/lib/content';
import { CountUp } from '@/components/ui/CountUp';

/**
 * The supplier network and reach figures. The button and the file card are
 * plain anchors with `download`, so the company list downloads with no
 * JavaScript involved.
 */
export function CompanyNetwork() {
  const ref = useReveal<HTMLElement>({ stagger: 0.08 });
  const { file, companies } = companyNetwork;

  return (
    <section
      ref={ref}
      id="companies"
      className="section-base py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <div className="overflow-hidden rounded-card-elevated border border-line bg-surface shadow-card">
          <div className="grid gap-8 p-6 xs:p-7 sm:gap-10 sm:p-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:p-12">
            <div>
              <h2 className="heading-section max-w-xl" data-reveal>
                <span className="heading-kicker">{companyNetwork.eyebrow}</span>
                {companyNetwork.heading}
              </h2>
              <p
                className="mt-5 max-w-xl text-pretty text-body text-ink-muted"
                data-reveal
              >
                {companyNetwork.lead}
              </p>

              <a
                href={file.href}
                download={file.name}
                className="btn-primary mt-8 w-full px-6 py-3.5 sm:w-auto"
                data-reveal
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download company list
                <span className="sr-only">{` (${file.format}, ${file.size})`}</span>
              </a>
            </div>

            {/* File card — also downloads the list. */}
            <a
              href={file.href}
              download={file.name}
              className="group flex flex-col gap-5 rounded-card border border-royal-wash bg-royal-tint p-5 text-left transition-colors hover:border-royal xs:p-6 sm:p-7"
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
                    {`${file.format} · ${companies.length} companies listed`}
                  </p>
                </div>
              </div>

              <ul className="flex flex-wrap gap-2 border-t border-royal-wash pt-5">
                {companies.slice(0, 8).map((name) => (
                  <li
                    key={name}
                    className="rounded-pill border border-royal-wash bg-surface px-3 py-1.5 text-body-sm font-medium text-royal"
                  >
                    {name}
                  </li>
                ))}
                <li className="rounded-pill bg-royal px-3 py-1.5 text-body-sm font-medium text-white">
                  {`+${companies.length - 8} more`}
                </li>
              </ul>

              <span className="inline-flex items-center gap-2 text-body-sm font-semibold text-royal">
                <Download
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
                Download Excel
              </span>
            </a>
          </div>

          {/* Reach figures, ruled the same way as the metrics ledger. */}
          <dl className="grid grid-cols-2 gap-px border-t border-line bg-line lg:grid-cols-4">
            {companyNetwork.stats.map((stat) => (
              <div
                key={stat.label}
                data-reveal
                className="bg-surface px-5 py-6 xs:px-7 xs:py-8 lg:px-8"
              >
                <dd>
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    className="text-[2rem] font-semibold leading-none tracking-[-0.04em] text-ink xs:text-[2.5rem]"
                  />
                </dd>
                <dt className="mt-3 max-w-[22ch] text-pretty text-body-sm font-medium leading-snug text-ink-muted">
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
