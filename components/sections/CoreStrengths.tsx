'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import { coreStrengths } from '@/lib/content';

/**
 * The four pillars, as the deck's hexagon rank.
 *
 * The hexagon is a `clip-path` on the tile rather than an SVG or a background
 * image, so the shape costs nothing to render, scales with the type inside it,
 * and inherits the card's own hover colour without a second element to keep in
 * sync.
 *
 * Each tile arrives on its own trigger with a rise-and-settle: up from below
 * with a slight counter-rotation that unwinds to zero, staggered along the rank.
 * The rotation is what separates this from every other fade-up on the page — the
 * tiles read as being set into place rather than appearing.
 *
 * The alternating vertical offset is the deck's zig-zag, and it is desktop-only:
 * stacked two-up on a phone the offset would just look like a broken grid.
 */
export function CoreStrengths() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tiles = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll('[data-hex]')
    );
    const copy = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll('[data-hex-copy]')
    );
    if (!tiles.length) return;

    if (prefersReducedMotion()) {
      gsap.set([...tiles, ...copy], { opacity: 1, y: 0, rotate: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        tiles,
        { opacity: 0, y: 56, rotate: -8, scale: 0.86 },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 76%',
            toggleActions: 'play none none none',
          },
        }
      );

      if (copy.length) {
        gsap.fromTo(
          copy,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.08,
            delay: 0.25,
            scrollTrigger: {
              trigger: section,
              start: 'top 76%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="strengths"
      className="section-base relative overflow-hidden py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <div className="max-w-3xl">
          <h2 className="heading-section max-w-none">
            <span className="heading-kicker">{coreStrengths.eyebrow}</span>
            {coreStrengths.heading}
          </h2>
          <p className="mt-6 max-w-2xl text-pretty text-body text-ink-muted">
            {coreStrengths.lead}
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-x-3 gap-y-10 xs:gap-x-4 sm:gap-x-6 lg:mt-20 lg:grid-cols-4 lg:gap-x-6">
          {coreStrengths.items.map((item, index) => {
            const Icon = item.icon;
            const dark = index % 2 === 1;

            return (
              <li
                key={item.title}
                className="flex flex-col items-center text-center lg:[&:nth-child(even)]:translate-y-10"
              >
                <div
                  data-hex
                  className="grid aspect-[0.88] w-full max-w-[11rem] place-items-center px-3 will-change-transform xs:px-4"
                  style={{
                    clipPath:
                      'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    backgroundColor: dark ? '#1f56d8' : '#5b82f5',
                  }}
                >
                  <span className="grid place-items-center gap-2 xs:gap-2.5">
                    <Icon
                      className="h-6 w-6 text-white/85 xs:h-7 xs:w-7 sm:h-8 sm:w-8"
                      aria-hidden="true"
                    />
                    <h3 className="text-balance px-0.5 text-[0.78rem] font-semibold leading-tight tracking-[-0.03em] text-white xs:text-[0.9rem] sm:text-body-sm">
                      {item.title}
                    </h3>
                  </span>
                </div>

                <p
                  data-hex-copy
                  className="mt-4 max-w-[26ch] text-pretty text-[0.85rem] leading-relaxed text-ink-muted xs:mt-5 xs:text-body-sm"
                >
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
