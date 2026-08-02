'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import { process } from '@/lib/content';

/**
 * The six steps from enquiry to delivery.
 *
 * A rule runs down the list and fills as the section scrolls, and each step
 * lights up as it reaches the middle of the viewport — the same scroll-linked
 * language as the hero, at a smaller scale.
 */
export function ProcessRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    const progress = progressRef.current;
    if (!section || !list || !progress) return;

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('[data-step]');

      gsap.fromTo(
        steps,
        { opacity: 0, y: reduced ? 0 : 30 },
        {
          opacity: 1,
          y: 0,
          duration: reduced ? 0.4 : 0.8,
          ease: 'power3.out',
          stagger: reduced ? 0.03 : 0.09,
          scrollTrigger: { trigger: list, start: 'top 80%', once: true },
        }
      );

      if (reduced) {
        gsap.set(progress, { scaleY: 1 });
        return;
      }

      gsap.fromTo(
        progress,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: list,
            start: 'top 65%',
            end: 'bottom 75%',
            scrub: true,
          },
        }
      );

      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 70%',
          end: 'bottom 40%',
          toggleClass: { targets: step, className: 'is-active' },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="section-base relative border-t border-line py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="heading-section">
              <span className="heading-kicker">{process.eyebrow}</span>
              {process.heading}
            </h2>
            <p className="mt-6 max-w-md text-pretty text-body text-ink-muted">
              {process.lead}
            </p>
          </div>

          <ol ref={listRef} className="relative pl-14 sm:pl-16">
            {/* Rule the steps hang off, plus the scroll-linked fill. The chip is
                40px wide and pulled out by exactly the list padding, so its
                centre sits on 20px at every breakpoint. */}
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-[19px] top-2 w-px bg-line-strong"
            >
              <span
                ref={progressRef}
                className="absolute inset-0 origin-top bg-gradient-to-b from-royal to-accent"
              />
            </span>

            {process.steps.map((step, index) => (
              <li
                key={step.title}
                data-step
                className="group relative pb-11 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-14 top-0 grid h-10 w-10 place-items-center rounded-pill border border-line bg-surface text-caption font-semibold text-ink-soft transition-colors duration-500 group-[.is-active]:border-royal group-[.is-active]:bg-royal group-[.is-active]:text-white sm:-left-16"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="text-balance text-[1.35rem] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-heading-sm">
                  {step.title}
                </h3>
                <p className="mt-2.5 max-w-lg text-pretty text-body-sm leading-relaxed text-ink-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
