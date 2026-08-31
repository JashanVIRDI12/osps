'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import { differentiators } from '@/lib/content';
import { LoopGraphic } from '@/components/ui/LoopGraphic';

/**
 * Seven claims as a staircase of bars that draw themselves in.
 *
 * Each row's fill is its own absolutely-positioned layer, scaled on `scaleX`
 * from a left origin — not an animated `width`. Width is a layout property, so
 * animating it would reflow the row and re-wrap its text on every frame of
 * seven simultaneous bars; `scaleX` on a background layer is a compositor
 * transform and the text above it never moves. The label fades in just behind
 * the leading edge, so the bar appears to carry it in.
 *
 * The widths themselves step down the list. That is the deck's staircase, and
 * it also stops seven identical full-width bars from reading as a table.
 */
const WIDTHS = ['100%', '94%', '88%', '82%', '90%', '76%', '84%'];

export function WhyDifferent() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rows = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll('[data-diff-row]')
    );
    if (!rows.length) return;

    const reduced = prefersReducedMotion();

    if (reduced) {
      rows.forEach((row) => {
        const fill = row.querySelector('[data-diff-fill]');
        const label = row.querySelector('[data-diff-label]');
        if (fill) gsap.set(fill, { scaleX: 1 });
        if (label) gsap.set(label, { opacity: 1, x: 0 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      rows.forEach((row, index) => {
        const fill = row.querySelector('[data-diff-fill]');
        const label = row.querySelector('[data-diff-label]');
        const node = row.querySelector('[data-diff-node]');

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
          delay: index * 0.06,
        });

        if (fill) {
          timeline.fromTo(
            fill,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.75, ease: 'power3.out', transformOrigin: 'left center' },
            0
          );
        }

        if (label) {
          timeline.fromTo(
            label,
            { opacity: 0, x: -14 },
            { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out' },
            0.18
          );
        }

        if (node) {
          timeline.fromTo(
            node,
            { scale: 0 },
            { scale: 1, duration: 0.45, ease: 'back.out(2)' },
            0.45
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-base relative overflow-hidden py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <div className="max-w-3xl">
          <h2 className="heading-section max-w-none">
            <span className="heading-kicker">{differentiators.eyebrow}</span>
            {differentiators.heading}
          </h2>
        </div>

        <div className="mt-12 grid gap-12 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)] lg:items-center lg:gap-16">
          <ul className="space-y-3 sm:space-y-3.5">
          {differentiators.items.map((item, index) => {
            const dark = index % 2 === 1;

            return (
              <li
                key={item}
                data-diff-row
                className="relative"
                style={{ maxWidth: WIDTHS[index] ?? '100%' }}
              >
                <div className="relative overflow-hidden rounded-pill">
                  {/* The fill. Transform-only, so the label above never reflows. */}
                  <span
                    data-diff-fill
                    aria-hidden="true"
                    className="absolute inset-0 block origin-left"
                    style={{ backgroundColor: dark ? '#1f56d8' : '#5b82f5' }}
                  />

                  <p
                    data-diff-label
                    className="relative px-6 py-4 text-pretty text-body-sm font-semibold leading-snug text-white xs:px-7 sm:px-8 sm:py-5 sm:text-body"
                  >
                    {item}
                  </p>
                </div>

                {/* Terminal node, echoing the deck's circles on the bar ends. */}
                <span
                  data-diff-node
                  aria-hidden="true"
                  className="absolute right-0 top-1/2 hidden h-9 w-9 -translate-y-1/2 translate-x-1/2 rounded-full border-[3px] border-canvas sm:block"
                  style={{ backgroundColor: dark ? '#5b82f5' : '#1f56d8' }}
                />
              </li>
            );
          })}
          </ul>

          {/**
           * The payoff for the list beside it. Ordered after the bars in the
           * DOM so a screen reader hears the seven claims before the aside, and
           * the illustration itself is inert decoration — the caption carries
           * whatever meaning it adds.
           */}
          <figure data-diff-graphic className="lg:pl-4">
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
            <figcaption className="mt-5 max-w-[34ch] text-pretty text-body-sm leading-relaxed text-ink-soft">
              {differentiators.graphic.caption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
