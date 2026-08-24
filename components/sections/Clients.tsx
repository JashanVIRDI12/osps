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
          {clients.items.map((client) => (
            <li
              key={client.name}
              data-client-tile
              className="group grid min-h-[8rem] place-items-center bg-surface p-6 transition-colors duration-300 hover:bg-royal-tint sm:min-h-[9.5rem] sm:p-7"
            >
              {client.logo ? (
                /**
                 * Fixed box + `object-contain`, because these marks arrive at
                 * whatever size and ratio each hospital publishes — Yatharth is
                 * a wide lockup, Nivok a circular seal. Sizing the box rather
                 * than the image is what keeps ten of them optically level.
                 *
                 * Greyscale at rest is not a stylistic tic: between them these
                 * logos use red, green, orange, teal and two different blues,
                 * and at full saturation the wall reads as a jumble that
                 * competes with the page's own palette. Desaturating settles it
                 * into one texture and lets the row say "these are our clients"
                 * rather than ten brands shouting at once. Colour returns on
                 * hover, so each mark is still shown as its owner intends it.
                 */
                <div className="relative h-16 w-full sm:h-20">
                  {/**
                   * The scale sits on the image, not this wrapper, and that is
                   * load-bearing. A transform creates a stacking context, and a
                   * blend mode only composites against the backdrop *inside* its
                   * nearest one — so scaling the wrapper would cut
                   * `mix-blend-multiply` off from the tile's white background and
                   * the blend would silently do nothing.
                   *
                   * Multiply is what hides the off-white rectangles baked into
                   * the flattened files (Paliwal is a JPEG and cannot carry
                   * transparency at all): white multiplied against the tile is
                   * the tile. It also means the marks pick up the royal tint on
                   * hover instead of sitting on their own pale islands.
                   */}
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    sizes="(max-width: 640px) 40vw, (max-width: 1024px) 28vw, 17vw"
                    style={{ transform: `scale(${client.scale ?? 1})` }}
                    className="object-contain opacity-70 mix-blend-multiply grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                </div>
              ) : (
                <span className="text-balance text-center text-body-sm font-semibold leading-tight tracking-[-0.02em] text-ink-muted transition-colors duration-300 group-hover:text-royal">
                  {client.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
