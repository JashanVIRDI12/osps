'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
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

    const steps = Array.from(
      list.querySelectorAll<HTMLElement>('[data-step]')
    );

    /* -------------------------------------------------- step entrance + state
     *
     * IntersectionObserver rather than ScrollTrigger, for the same reason the
     * shared reveal moved: a `once` trigger that resolves against a stale
     * measurement leaves its step at `opacity: 0` for good, and a column of
     * invisible steps is the most obviously broken thing on the page.
     */
    steps.forEach((step, index) => {
      step.style.setProperty('--reveal-y', reduced ? '0px' : '30px');
      step.style.setProperty('--reveal-duration', `${reduced ? 0.4 : 0.8}s`);
      step.style.setProperty(
        '--reveal-delay',
        `${index * (reduced ? 0.03 : 0.09)}s`
      );
    });

    const entrance = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        steps.forEach((step) => step.classList.add('is-revealed'));
        entrance.disconnect();
      },
      { rootMargin: '0px 0px -15% 0px' }
    );
    entrance.observe(list);

    /**
     * The chip highlight is a plain "is this step near the middle of the
     * screen" question, which is exactly what an observer margin expresses —
     * and it costs nothing per frame, unlike a ScrollTrigger per step.
     */
    const active = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-active', entry.isIntersecting);
        });
      },
      { rootMargin: '-30% 0px -40% 0px' }
    );
    steps.forEach((step) => active.observe(step));

    if (reduced) {
      gsap.set(progress, { scaleY: 1 });
      return () => {
        entrance.disconnect();
        active.disconnect();
      };
    }

    /* ------------------------------------------------------- progress fill
     *
     * The one genuinely scroll-linked element here, and desktop-only. Scrubbing
     * a transform against scroll means a GSAP tick on every frame of every
     * scroll through this section; on a phone the rail is a 1px line beside the
     * steps, and it is not worth a frame of the budget. There it simply sits
     * filled, which is what the reduced-motion path already did.
     */
    const mm = gsap.matchMedia(section);

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023.98px)',
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };

        if (!isDesktop) {
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
              invalidateOnRefresh: true,
            },
          }
        );
      }
    );

    return () => {
      entrance.disconnect();
      active.disconnect();
      mm.revert();
    };
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
                /* Also a reveal target, so it starts hidden in CSS before first
                   paint rather than being hidden by script afterwards. */
                data-reveal
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
