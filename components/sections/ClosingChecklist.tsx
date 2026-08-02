'use client';

import { Check } from 'lucide-react';
import { useReveal } from '@/lib/motion';
import { checklist } from '@/lib/content';

/** The whole argument, compressed to eight lines, immediately before the ask. */
export function ClosingChecklist() {
  const ref = useReveal<HTMLElement>({ stagger: 0.05 });

  return (
    <section ref={ref} className="section-base py-20 sm:py-24">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
          <div>
            <h2 className="heading-section" data-reveal>
              <span className="heading-kicker">{checklist.eyebrow}</span>
              {checklist.heading}
            </h2>
          </div>

          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {checklist.items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 border-b border-line pb-4"
                data-reveal
              >
                <span
                  aria-hidden="true"
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-pill border border-accent/40 bg-accent-tint text-accent"
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-body text-ink-muted">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
