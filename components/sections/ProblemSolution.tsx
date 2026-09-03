'use client';

import { useRef } from 'react';
import { Check, X } from 'lucide-react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import { problemSolution } from '@/lib/content';

/**
 * The complaint and the answer, set as one ledger with a spine down the middle.
 *
 * The deck runs two separate stacks side by side. Here they are pinned to a
 * shared centre line and each pair is a single row, because that is the claim
 * being made: problem `n` is answered by solution `n`, and putting them on the
 * same baseline is what makes the correspondence readable rather than implied.
 *
 * Desktop animates each row's two halves inward from opposite sides as it
 * arrives, and fills the spine as the section passes. Below `lg` the pairs
 * stack — the left/right geometry has nowhere to go on a phone — and the rows
 * simply fade up in order.
 */
export function ProblemSolution() {
  const sectionRef = useRef<HTMLElement>(null);
  const spineRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const spine = spineRef.current;
    if (!section) return;

    const reduced = prefersReducedMotion();
    const rows = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll('[data-ps-row]')
    );

    /**
     * Reduced motion keeps the composition and drops the travel: the spine is
     * simply full, and every row is already in place. Nothing is left at
     * `opacity: 0` waiting for a trigger that will not run.
     */
    if (reduced) {
      if (spine) gsap.set(spine, { scaleY: 1 });
      gsap.set(rows, { opacity: 1, x: 0 });
      return;
    }

    const mm = gsap.matchMedia(section);

    mm.add(
      {
        desktop: '(min-width: 1024px)',
        mobile: '(max-width: 1023px)',
      },
      (context) => {
        const { desktop } = context.conditions as { desktop: boolean };

        if (spine) {
          gsap.fromTo(
            spine,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              transformOrigin: 'top center',
              scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                end: 'bottom 85%',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        rows.forEach((row) => {
          const problem = row.querySelector('[data-ps-problem]');
          const solution = row.querySelector('[data-ps-solution]');
          if (!problem || !solution) return;

          const trigger = {
            trigger: row,
            start: 'top 88%',
            toggleActions: 'play none none none' as const,
          };

          /**
           * On desktop the halves converge on the spine, which is the whole
           * point of the layout. Stacked, there is no centre to converge on, so
           * the same rows lift instead — one effect, expressed twice.
           */
          gsap.fromTo(
            problem,
            { opacity: 0, x: desktop ? -48 : 0, y: desktop ? 0 : 24 },
            { opacity: 1, x: 0, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: trigger }
          );

          gsap.fromTo(
            solution,
            { opacity: 0, x: desktop ? 48 : 0, y: desktop ? 0 : 24 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              delay: desktop ? 0.08 : 0.05,
              scrollTrigger: trigger,
            }
          );
        });
      }
    );

    return () => mm.revert();
  }, []);

  const { problems, solutions } = problemSolution;

  return (
    <section
      ref={sectionRef}
      className="section-base relative py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <div className="max-w-3xl">
          <h2 className="heading-section max-w-none">
            <span className="heading-kicker">{problemSolution.eyebrow}</span>
            {problemSolution.heading}
          </h2>
        </div>

        {/* Column captions. Hidden while stacked, where each row labels itself. */}
        <div className="mt-12 hidden items-end gap-8 sm:mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <p className="text-caption font-semibold uppercase tracking-[0.16em] text-ink-soft">
            {problems.label}
          </p>
          <span className="w-12" aria-hidden="true" />
          <p className="text-right text-caption font-semibold uppercase tracking-[0.16em] text-royal">
            {solutions.label}
          </p>
        </div>

        <div className="relative mt-6 lg:mt-8">
          {/* The spine, and the rail it fills against. */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-line lg:block"
          >
            <span
              ref={spineRef}
              className="absolute inset-0 block origin-top bg-royal-bright"
            />
          </div>

          <ul className="grid gap-4 sm:gap-5">
            {problems.items.map((problem, index) => (
              <li
                key={problem}
                data-ps-row
                className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8"
              >
                <div
                  data-ps-problem
                  className="flex items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-5 shadow-card sm:px-6 lg:justify-end lg:text-right"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink/[0.06] text-ink-soft lg:order-2">
                    <X className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-pretty text-body-sm font-medium leading-snug text-ink-muted lg:order-1">
                    {problem}
                  </p>
                </div>

                {/* The node where this pair meets the spine. */}
                <span
                  aria-hidden="true"
                  className="relative hidden w-12 shrink-0 lg:block"
                >
                  <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-royal bg-canvas" />
                </span>

                <div
                  data-ps-solution
                  className="flex items-center gap-4 rounded-2xl border border-royal-wash bg-royal-tint px-5 py-5 sm:px-6"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-royal text-white">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-pretty text-body-sm font-semibold leading-snug text-royal">
                    {solutions.items[index]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
