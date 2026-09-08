'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import { clients } from '@/lib/content';

/**
 * The client wall.
 *
 * Reveal uses GSAP's `stagger: { from: 'center', grid: 'auto' }`, which orders
 * the tiles by their measured distance from the centre of the grid rather than
 * by DOM index. The wall therefore resolves outward as one object instead of
 * wiping left-to-right, and — because `grid: 'auto'` re-measures — it keeps
 * doing the right thing when the column count changes at each breakpoint,
 * without a second timeline per layout.
 *
 * Each tile falls back to a wordmark plate when no logo file is present, so the
 * section is complete before the artwork is, and a missing asset can never
 * render as a broken image on a page whose whole argument is reliability.
 */
const CLIENT_COLORS = [
  'text-royal group-hover:text-royal-bright',
  'text-teal-deep group-hover:text-teal',
  'text-blue-700 group-hover:text-blue-600',
  'text-accent-deep group-hover:text-accent',
  'text-indigo-700 group-hover:text-indigo-600',
  'text-emerald-700 group-hover:text-emerald-600',
  'text-cyan-800 group-hover:text-cyan-600',
  'text-violet-700 group-hover:text-violet-600',
];

export function Clients() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tiles = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll('[data-client-tile]')
    );
    if (!tiles.length) return;

    if (prefersReducedMotion()) {
      gsap.set(tiles, { opacity: 1, scale: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        tiles,
        { opacity: 0, scale: 0.9, y: 18 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          stagger: { each: 0.05, from: 'center', grid: 'auto' },
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="clients"
      className="section-surface relative border-y border-line py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <div className="max-w-2xl">
          <h2 className="heading-section max-w-none">
            <span className="heading-kicker">{clients.eyebrow}</span>
            {clients.heading}
          </h2>
          <p className="mt-6 text-pretty text-body text-ink-muted">
            {clients.lead}
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-card-elevated border border-line bg-line sm:mt-14 sm:grid-cols-3 lg:grid-cols-5">
          {clients.items.map((client, index) => {
            const colorClass = CLIENT_COLORS[index % CLIENT_COLORS.length];

            return (
              <li
                key={client.name}
                data-client-tile
                className="group flex flex-col items-center justify-between min-h-[9rem] bg-surface p-5 sm:min-h-[10.5rem] sm:p-6 transition-all duration-300 hover:bg-royal-tint/60"
              >
                {client.logo ? (
                  <div className="relative flex-1 flex items-center justify-center w-full min-h-[3.75rem] sm:min-h-[4.5rem]">
                    <div className="relative h-12 w-full sm:h-14">
                      <Image
                        src={client.logo}
                        alt={client.name}
                        fill
                        sizes="(max-width: 640px) 40vw, (max-width: 1024px) 28vw, 17vw"
                        style={{ transform: `scale(${client.scale ?? 1})` }}
                        className="object-contain opacity-85 transition duration-300 group-hover:opacity-100 group-hover:scale-105"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center w-full">
                    <span className="inline-block h-2 w-2 rounded-full bg-royal/40" />
                  </div>
                )}

                <span
                  className={`mt-2.5 block text-balance text-center text-[12.5px] sm:text-[13.5px] font-semibold leading-tight tracking-[-0.02em] ${colorClass} transition-colors duration-300`}
                >
                  {client.name}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
