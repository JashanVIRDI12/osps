'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useReveal } from '@/lib/motion';
import { scrollToHash } from '@/lib/scroll';
import { services } from '@/lib/content';

export function Strengths() {
  const ref = useReveal<HTMLElement>({ stagger: 0.04, y: 16, duration: 0.7 });

  return (
    <section
      ref={ref}
      id="services"
      aria-labelledby="services-heading"
      className="section-base py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-20">
          <div data-reveal>
            <p className="heading-kicker">{services.eyebrow}</p>
            <h2 id="services-heading" className="heading-section-lg max-w-[22ch]">
              {services.heading.main}{' '}
              <span className="text-royal">{services.heading.accent}</span>
            </h2>
          </div>
          <p
            className="max-w-[43ch] text-pretty text-body leading-relaxed text-ink-muted lg:pb-1"
            data-reveal
          >
            {services.lead}
          </p>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-card-elevated border border-line bg-surface shadow-card sm:mt-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.65fr)]">
          <ul className="grid gap-px bg-line sm:grid-cols-2">
            {services.items.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.title} className="bg-surface p-6 sm:p-7 lg:p-8">
                  <div data-reveal>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-royal-tint text-royal">
                      <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-[1.125rem] font-semibold leading-snug tracking-[-0.03em] text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 max-w-[38ch] text-pretty text-body-sm leading-relaxed text-ink-muted">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="grid border-t border-line bg-royal-wash sm:grid-cols-2 lg:order-first lg:flex lg:flex-col lg:border-r lg:border-t-0">
            <div className="relative aspect-[16/10] overflow-hidden bg-royal-tint sm:aspect-auto sm:min-h-64 lg:aspect-[4/3] lg:min-h-0 lg:shrink-0">
              <Image
                src="/images/accent-quality.webp"
                alt="Healthcare supply staff checking packaged surgical products before dispatch"
                fill
                sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 32vw"
                className="object-cover object-[38%_center]"
              />
            </div>
            <div className="flex flex-1 flex-col items-start p-6 sm:p-7 lg:p-8" data-reveal>
              <p className="text-caption font-semibold uppercase tracking-[0.12em] text-royal-mist">
                Here for the long term
              </p>
              <h3 className="mt-4 max-w-[20ch] text-balance text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.04em] text-ink lg:text-[1.65rem]">
                {services.partnership.title}
              </h3>
              <p className="mt-4 max-w-[35ch] text-pretty text-body-sm leading-relaxed text-ink-muted">
                {services.partnership.description}
              </p>
              <div className="mt-auto w-full pt-7">
                <a
                  href={services.cta.href}
                  onClick={(event) => {
                    if (
                      event.button === 0 &&
                      !event.metaKey &&
                      !event.ctrlKey &&
                      !event.shiftKey &&
                      !event.altKey &&
                      scrollToHash(services.cta.href)
                    ) {
                      event.preventDefault();
                    }
                  }}
                  className="btn-outline w-full gap-2 px-4 text-body-sm"
                >
                  {services.cta.label}
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
