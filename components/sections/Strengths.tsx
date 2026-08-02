'use client';

import { useReveal } from '@/lib/motion';
import { services } from '@/lib/content';

/**
 * Six reasons, laid out as a hairline grid rather than six floating cards —
 * the shared rules read as one table of capabilities instead of a card wall.
 */
export function Strengths() {
  const ref = useReveal<HTMLElement>({ stagger: 0.08 });

  return (
    <section
      ref={ref}
      id="services"
      className="section-base relative py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <div className="max-w-3xl">
          <h2 className="heading-section max-w-none" data-reveal>
            <span className="heading-kicker">{services.eyebrow}</span>
            {services.heading}
          </h2>
          <p
            className="mt-6 max-w-2xl text-pretty text-body text-ink-muted"
            data-reveal
          >
            {services.lead}
          </p>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-card-elevated border border-line bg-line sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item) => {
            const Icon = item.icon;

            return (
              <li
                key={item.title}
                className="group relative bg-surface px-6 py-8 transition-colors duration-300 hover:bg-royal-tint xs:px-7 xs:py-9"
                data-reveal
              >
                <span className="icon-well transition-colors duration-300 group-hover:border-royal group-hover:text-royal">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>

                <h3 className="mt-6 text-balance text-[1.3rem] font-semibold leading-tight tracking-[-0.03em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-pretty text-body-sm leading-relaxed text-ink-muted">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
