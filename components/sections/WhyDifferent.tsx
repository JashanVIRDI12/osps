'use client';

import {
  BadgePercent,
  Headset,
  Layers,
  PackageSearch,
  Timer,
  Warehouse,
  Zap,
} from 'lucide-react';
import { useReveal } from '@/lib/motion';
import { differentiators } from '@/lib/content';
import { LoopGraphic } from '@/components/ui/LoopGraphic';

/**
 * Seven procurement notices, as a numbered ledger rather than a staircase of
 * bars. The heading counts them, so the index is information, not decoration —
 * and equal-width rows let a buyer scan the list the way they scan a spec,
 * instead of decoding overlapping pills.
 *
 * The bedside illustration is the reason the list exists. It leads on a phone
 * (proof, then claims) and sits sticky beside the ledger from `lg`.
 */
const ICONS = [
  PackageSearch,
  Zap,
  Layers,
  Warehouse,
  BadgePercent,
  Headset,
  Timer,
] as const;

export function WhyDifferent() {
  const sectionRef = useReveal<HTMLElement>({ stagger: 0.06 });

  return (
    <section
      ref={sectionRef}
      className="section-base relative overflow-hidden py-16 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <div className="max-w-3xl">
          <h2 className="heading-section max-w-none" data-reveal>
            <span className="heading-kicker">{differentiators.eyebrow}</span>
            {differentiators.heading}
          </h2>
        </div>

        <div className="mt-10 grid items-start gap-10 sm:mt-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <ol className="order-2 divide-y divide-line border-y border-line lg:order-1">
            {differentiators.items.map((item, index) => {
              const Icon = ICONS[index];

              return (
                <li
                  key={item}
                  data-reveal
                  className="group flex items-start gap-4 py-5 xs:gap-5 xs:py-6"
                >
                  <span className="icon-well mt-0.5 h-10 w-10 shrink-0 transition-colors duration-300 group-hover:border-royal group-hover:text-royal xs:h-12 xs:w-12">
                    <Icon className="h-4 w-4 xs:h-5 xs:w-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1 pt-1.5 xs:pt-2">
                    <span className="font-utility text-[0.68rem] tracking-[0.16em] text-royal">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="mt-1.5 text-pretty text-[1.05rem] font-semibold leading-snug tracking-[-0.03em] text-ink xs:text-[1.15rem] sm:text-[1.25rem]">
                      {item}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <figure
            className="order-1 lg:sticky lg:top-32 lg:order-2"
            data-reveal
          >
            <div className="overflow-hidden rounded-card-elevated border border-line bg-royal-tint">
              <LoopGraphic
                src={differentiators.graphic.src}
                poster={differentiators.graphic.poster}
                alt={differentiators.graphic.alt}
                width={720}
                height={540}
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-4 max-w-[34ch] text-pretty text-body-sm leading-relaxed text-ink-soft">
              {differentiators.graphic.caption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
