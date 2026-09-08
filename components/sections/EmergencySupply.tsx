'use client';

import { useReveal } from '@/lib/motion';
import { scrollToHash } from '@/lib/scroll';
import { emergencySupply } from '@/lib/content';
import { ArrowRight, MessageSquare, Phone } from 'lucide-react';

/**
 * Emergency supply, set as a duty board rather than a stack of cards.
 *
 * The first version was four nested rounded panels — a gradient header holding a
 * white box holding a stat grid, then three cards, then a button strip — in a
 * green that is not in the palette. It read as a different website. The problem
 * underneath the styling was that everything carried the same weight: the phone
 * number a ward sister needs at 2am sat fourth in a row of four buttons.
 *
 * So the section is rebuilt around one claim — these numbers are answered now.
 * The board on the right is the only panel on the page here, the numbers inside
 * it are the largest type in the section, and WhatsApp sits in the same rank as
 * a third way to reach the same desk. Everything else is ruled rather than
 * boxed: the committed terms and the three units are hairline ranks in the same
 * idiom as the purpose spread, so the section belongs to the page.
 *
 * Red is the signal colour here, which is the one place on the site it carries
 * meaning rather than emphasis. It rules the top of the section and marks the
 * live dot, and is still never used as a fill.
 */
export function EmergencySupply() {
  const ref = useReveal<HTMLElement>({ stagger: 0.07 });
  const { hotlines, whatsapp, departments, stats, board, cta } = emergencySupply;

  return (
    <section
      ref={ref}
      id="emergency-supply"
      aria-labelledby="emergency-supply-heading"
      className="section-surface relative overflow-hidden py-20 sm:py-24 lg:py-28"
    >
      {/* The alert rail. A hairline, not a banner — the only red field here. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent via-accent/35 to-transparent"
      />

      <div className="shell relative">
        {/**
         * Three grid children rather than two columns, so the board can be
         * placed differently in each layout. Stacked, it sits directly under the
         * claim — a ward calling at 2am should not scroll past two paragraphs of
         * supporting copy to reach a number. On `lg` it spans both rows of the
         * right-hand column and the copy closes up underneath itself.
         */}
        <div className="grid gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
          {/* ------------------------------------------------ the claim */}
          <div data-reveal className="lg:col-start-1 lg:row-start-1 lg:self-end">
            <h2 id="emergency-supply-heading" className="heading-section max-w-none">
              <span className="heading-kicker text-accent">
                {emergencySupply.eyebrow}
              </span>
              {emergencySupply.title}
            </h2>

            <p className="mt-6 max-w-[46ch] text-pretty text-body leading-relaxed text-ink sm:text-[1.15rem]">
              {emergencySupply.lead}
            </p>
          </div>

          {/* -------------------------------------------------- the board */}
          <div
            data-reveal
            className="rounded-card border border-line bg-canvas p-5 shadow-card sm:p-6 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center"
          >
            {/* Board head: what this is, and that it is live. */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line pb-4">
              <p className="font-utility text-[0.68rem] uppercase tracking-[0.18em] text-ink-soft">
                {board.label}
              </p>
              <p className="inline-flex items-center gap-2 font-utility text-[0.68rem] uppercase tracking-[0.18em] text-accent">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                {board.status}
              </p>
            </div>

            {/* The three ways to reach the same desk, as one rank. */}
            <ul className="divide-y divide-line">
              {hotlines.map((hotline) => (
                <li key={hotline.href}>
                  <a
                    href={hotline.href}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span className="min-w-0">
                      <span className="block font-utility text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft">
                        {hotline.label}
                      </span>
                      <span className="mt-1.5 block text-[1.25rem] font-semibold tracking-[-0.03em] text-ink transition-colors duration-200 group-hover:text-royal sm:text-[1.4rem]">
                        {hotline.number}
                      </span>
                    </span>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-icon border border-line-strong bg-surface text-royal transition-colors duration-200 group-hover:border-royal group-hover:bg-royal group-hover:text-white">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}

              <li>
                <a
                  href={whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <span className="min-w-0">
                    <span className="block font-utility text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft">
                      {whatsapp.label}
                    </span>
                    <span className="mt-1.5 block text-body font-semibold tracking-[-0.02em] text-ink transition-colors duration-200 group-hover:text-teal-deep">
                      {whatsapp.note}
                    </span>
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-icon border border-teal-line bg-teal-tint text-teal-deep transition-colors duration-200 group-hover:border-teal group-hover:bg-teal group-hover:text-white">
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  </span>
                </a>
              </li>
            </ul>

            <p className="border-t border-line pt-4 text-body-sm leading-relaxed text-ink-muted">
              {board.note}
            </p>
          </div>

          {/* The supporting detail, which is the one thing here that can wait. */}
          <p
            data-reveal
            className="max-w-[58ch] text-pretty text-body-sm leading-relaxed text-ink-muted lg:col-start-1 lg:row-start-2 lg:self-start"
          >
            {emergencySupply.description}
          </p>
        </div>

        {/* ------------------------------------------- the committed terms */}
        <div className="mt-16 sm:mt-20">
          <p
            data-reveal
            className="font-utility text-[0.68rem] uppercase tracking-[0.18em] text-ink-soft"
          >
            {emergencySupply.statsLabel}
          </p>

          <dl className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-3 sm:gap-x-12">
            {stats.map((stat) => (
              <div key={stat.label} data-reveal>
                <span aria-hidden="true" className="block h-px w-full bg-accent/50" />
                <dd className="mt-5 text-[1.75rem] font-semibold leading-none tracking-[-0.04em] text-ink sm:text-[2.1rem]">
                  {stat.value}
                </dd>
                <dt className="mt-3 font-utility text-[0.66rem] uppercase tracking-[0.16em] text-royal">
                  {stat.label}
                </dt>
                {/* A second `dd` rather than a `p`: only dt/dd may sit in the
                    grouping div, and the subtext genuinely describes the term. */}
                <dd className="mt-2 text-body-sm leading-snug text-ink-muted">
                  {stat.subtext}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ------------------------------------------------- the manifests */}
        <div className="mt-16 sm:mt-20">
          <div
            data-reveal
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
          >
            <h3 className="font-utility text-[0.68rem] uppercase tracking-[0.18em] text-ink-soft">
              {emergencySupply.departmentsLabel}
            </h3>
            <p className="text-body-sm text-ink-soft">
              {emergencySupply.departmentsNote}
            </p>
          </div>

          <div className="mt-6 grid gap-x-10 gap-y-12 sm:gap-x-12 lg:grid-cols-3">
            {departments.map((dept, index) => {
              const Icon = dept.icon;
              return (
                <div key={dept.title} data-reveal>
                  <span aria-hidden="true" className="block h-px w-full bg-line-strong" />

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-3">
                      <Icon className="h-5 w-5 text-royal" aria-hidden="true" />
                      <span className="font-utility text-[0.66rem] uppercase tracking-[0.16em] text-royal">
                        {dept.badge}
                      </span>
                    </span>
                    <span className="font-utility text-[0.66rem] tracking-[0.16em] text-ink-soft">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h4 className="mt-4 text-balance text-[1.3rem] font-semibold leading-tight tracking-[-0.035em] text-ink sm:text-[1.45rem]">
                    {dept.title}
                  </h4>
                  <p className="mt-2 text-body-sm font-semibold text-royal">
                    {dept.tagline}
                  </p>
                  <p className="mt-3 max-w-[42ch] text-pretty text-body-sm leading-relaxed text-ink-muted">
                    {dept.description}
                  </p>

                  {/* The manifest. Ruled rows, not pills — this is a stock list. */}
                  <p className="mt-6 font-utility text-[0.6rem] uppercase tracking-[0.18em] text-ink-soft">
                    {emergencySupply.suppliesLabel}
                  </p>
                  <ul className="mt-2 divide-y divide-line border-t border-line">
                    {dept.supplies.map((item) => (
                      <li key={item} className="py-2 text-body-sm font-medium text-ink-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------- the quiet exit */}
        <div data-reveal className="mt-14 border-t border-line pt-6 sm:mt-16">
          <a
            href={cta.href}
            onClick={(event) => {
              if (scrollToHash(cta.href)) event.preventDefault();
            }}
            className="tap-target group inline-flex items-center gap-2 text-body font-semibold text-royal transition-colors duration-200 hover:text-royal-bright"
          >
            {cta.label}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
