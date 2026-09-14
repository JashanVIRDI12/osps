'use client';

import { ArrowRight, Building2, Check, Handshake } from 'lucide-react';
import { useReveal } from '@/lib/motion';
import { scrollToHash } from '@/lib/scroll';

const solutions = [
  {
    id: 'distributors',
    eyebrow: 'Distributors & dealers',
    title: 'Become an OSPS Distributor / Dealer',
    description:
      'Build your local healthcare business with a broad medical portfolio and a supply team that supports repeat orders.',
    icon: Handshake,
    points: [
      'Competitive B2B pricing',
      'Wide product portfolio',
      'Bulk supply',
      'Dealer support',
      'Reliable dispatch',
      'Repeat-order support',
      'Business growth opportunity',
    ],
    cta: 'Become a Distributor',
    dark: true,
  },
  {
    id: 'institutions',
    eyebrow: 'Hospitals & institutions',
    title: 'Medical Supply Solutions for Hospitals & Healthcare Institutions',
    description:
      'Simplify routine and bulk procurement through one responsive partner across multiple medical and surgical categories.',
    icon: Building2,
    points: [
      'Bulk procurement',
      'Institutional pricing',
      'Multiple product categories',
      'Regular supply',
      'Documentation support',
      'Order coordination',
    ],
    cta: 'Request Institutional Quote',
    dark: false,
  },
] as const;

export function BuyerSolutions() {
  const ref = useReveal<HTMLElement>({ stagger: 0.07 });

  return (
    <section ref={ref} className="section-base py-20 sm:py-24 lg:py-28">
      <div className="shell">
        <div className="max-w-3xl" data-reveal>
          <h2 className="heading-section max-w-none">
            <span className="heading-kicker">B2B supply partnerships</span>
            Built around the way healthcare businesses buy.
          </h2>
          <p className="mt-6 max-w-2xl text-pretty text-body text-ink-muted">
            From distribution and retail to hospital procurement, OSPS provides clear pricing, coordinated supply and responsive order support.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-2">
          {solutions.map((solution) => {
            const Icon = solution.icon;

            return (
              <article
                key={solution.id}
                id={solution.id}
                className={
                  solution.dark
                    ? 'scroll-mt-28 rounded-card-elevated border border-ink bg-ink p-6 text-white shadow-card-hover xs:p-7 sm:p-9'
                    : 'scroll-mt-28 rounded-card-elevated border border-royal-line bg-royal-deep p-6 text-ink shadow-card-hover xs:p-7 sm:p-9'
                }
                data-reveal
              >
                <div className="flex items-center justify-between gap-4">
                  <p className={solution.dark ? 'text-caption font-semibold uppercase tracking-[0.14em] text-royal-line' : 'text-caption font-semibold uppercase tracking-[0.14em] text-royal-mist'}>
                    {solution.eyebrow}
                  </p>
                  <span className={solution.dark ? 'grid h-11 w-11 place-items-center rounded-icon bg-white/10 text-white' : 'grid h-11 w-11 place-items-center rounded-icon bg-white/60 text-royal'}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                <h3 className="mt-6 max-w-[22ch] text-balance text-[1.65rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-[2rem]">
                  {solution.title}
                </h3>
                <p className={solution.dark ? 'mt-4 max-w-xl text-pretty text-body-sm leading-relaxed text-white/70' : 'mt-4 max-w-xl text-pretty text-body-sm leading-relaxed text-ink-muted'}>
                  {solution.description}
                </p>

                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {solution.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-body-sm">
                      <span className={solution.dark ? 'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-pill bg-royal text-white' : 'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-pill bg-white/70 text-royal'}>
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  onClick={(event) => {
                    if (scrollToHash('#contact')) event.preventDefault();
                  }}
                  className={solution.dark ? 'btn-light mt-8 px-6 py-3.5' : 'btn-accent mt-8 px-6 py-3.5'}
                >
                  {solution.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
