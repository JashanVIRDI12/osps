'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import { scrollToHash } from '@/lib/scroll';
import { cn } from '@/lib/cn';

/**
 * Stacking scroll cards — adapted from ui-layout's Stacking Cards
 * (21st.dev), rebuilt on this project's GSAP + ScrollTrigger runtime.
 *
 * Each card is sticky inside its own viewport-height track and is pulled up by a
 * per-index offset, so the cards gather into a deck. A single scrubbed timeline
 * shrinks every card as the ones after it land on top — card `i` scales from 1 to
 * `1 - (count - i) * 0.05` across the remainder of the section — and each card's
 * image settles from 2x as its track rises into view.
 *
 * Two deliberate departures from the source component:
 *   - No `<ReactLenis root>`. Smooth scrolling is already owned by MotionRoot; a
 *     second root instance would fight the first for the scroll position.
 *   - GSAP rather than `motion/react`, so the page keeps one animation runtime
 *     and ScrollTrigger stays in sync with Lenis.
 *
 * Under `prefers-reduced-motion` the `motion-reduce:` variants un-stick the tracks
 * and drop the peek offset, so the deck degrades to a plain vertical list without
 * any JavaScript involved.
 */

export type StackingCardItem = {
  /** Small leading label — the supply-line number. */
  number: string;
  title: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
  /** Card surface colour. Expects white text to sit on it. */
  tone: string;
  href: string;
  ctaLabel: string;
  image: { src: string; alt: string };
};

type StackingCardsProps = {
  cards: StackingCardItem[];
  className?: string;
};

/**
 * Vertical offset per card, in px, that keeps earlier cards peeking out from
 * under the ones stacked on top of them. Desktop only — a phone renders the
 * cards as a plain list, where there is nothing to peek out from behind.
 */
const PEEK = 25;

export function StackingCards({ cards, className }: StackingCardsProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  /**
   * The deck is a desktop-only effect.
   *
   * Every ingredient of it is something a phone pays for on every single frame
   * of the scroll: four viewport-tall sticky tracks, a scrubbed `scale` on each
   * card, a second scrubbed `scale` on each card's image, and an
   * `0 30px 80px -40px` shadow that has to be re-rastered at every intermediate
   * scale because a blurred shadow cannot be composited from a cached texture.
   * Four cards' worth of that, mid-scroll, is where the frame budget goes.
   *
   * `gsap.matchMedia` is what gates it — the tweens are never created below
   * `lg`, and `revert()` on the way out restores the inline styles — so on a
   * phone the markup below falls through to the `motion-reduce`-style static
   * layout and the deck simply reads as four stacked cards.
   */
  useIsomorphicLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope || prefersReducedMotion()) return;

    const mm = gsap.matchMedia(scope);

    mm.add('(min-width: 1024px)', () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-stack-card]');
      if (items.length < 2) return;

      // One scrubbed timeline across the whole deck, normalised to a duration of
      // 1 so each card can be positioned by its share of the scroll.
      const step = 1 / items.length;
      const deck = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      items.forEach((card, index) => {
        deck.fromTo(
          card,
          { scale: 1 },
          {
            scale: 1 - (items.length - index) * 0.05,
            ease: 'none',
            duration: 1 - index * step,
          },
          index * step
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-stack-image]').forEach((image) => {
        const track = image.closest('[data-stack-track]');
        if (!track) return;

        gsap.fromTo(
          image,
          { scale: 2 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: track,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={scopeRef} className={cn('relative', className)}>
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={card.number}
            data-stack-track
            /**
             * Static below `lg`, sticky from `lg` up.
             *
             * A phone gets four cards in a plain vertical list: no
             * viewport-height track, nothing pinned, nothing to keep in sync
             * with a scroll position. That is both the cheap layout and the
             * honest one — the deck's whole point is the gather-on-scroll, and a
             * phone screen is barely taller than one card, so the effect never
             * had room to read there anyway.
             *
             * `min-h` rather than `h` on the desktop track, because a card grows
             * past the viewport once its description and pills wrap, and a hard
             * `h-svh` would let it spill over the tracks either side of it.
             */
            className="relative flex items-center justify-center pb-4 last:pb-0 sm:pb-5 lg:sticky lg:top-0 lg:min-h-svh lg:pb-0 lg:last:pb-0"
          >
            <article
              data-stack-card
              style={
                {
                  backgroundColor: card.tone,
                  '--peek': `${index * PEEK}px`,
                } as React.CSSProperties
              }
              /**
               * The deep blurred shadow is desktop-only. It is what sells the
               * cards as a stack of physical panels, but it is also the reason
               * the scrubbed `scale` was so expensive — and with the deck
               * flattened on a phone there is nothing left for it to separate.
               */
              className="relative flex w-full origin-top flex-col rounded-card-elevated p-5 text-white shadow-card xs:p-6 sm:p-8 lg:top-[calc(-5vh+var(--peek))] lg:h-[460px] lg:w-[84%] lg:p-10 lg:shadow-[0_30px_80px_-40px_rgba(8,16,50,0.7)]"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Red as a filled pill rather than as text — the card tones run
                    from deep to bright, and red text only clears contrast on the
                    darkest of them. White on accent holds at 4.8:1 throughout. */}
                <span className="rounded-pill bg-accent px-2.5 py-1 text-caption font-semibold tracking-[0.16em] text-white">
                  {card.number}
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-icon border border-white/25 bg-white/10">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <h3 className="mt-4 text-balance text-[1.45rem] font-semibold leading-[1.05] tracking-[-0.03em] xs:text-[1.6rem] sm:mt-5 sm:text-[2rem] lg:text-[2.25rem]">
                {card.title}
              </h3>

              <div className="mt-5 grid flex-1 gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
                <div className="flex flex-col justify-between gap-4 sm:gap-5">
                  <p className="text-pretty text-body-sm leading-relaxed text-white/85">
                    {card.description}
                  </p>

                  <div className="flex flex-col gap-4">
                    <ul className="flex flex-wrap gap-2">
                      {card.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="rounded-pill border border-white/20 bg-white/10 px-3 py-1.5 text-caption font-medium"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={card.href}
                      onClick={(event) => {
                        if (scrollToHash(card.href)) event.preventDefault();
                      }}
                      className="tap-target group inline-flex w-fit items-center gap-2 border-b border-white/40 pb-1 text-body-sm font-medium text-white/90 transition-colors hover:border-white hover:text-white"
                    >
                      {card.ctaLabel}
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                      <span className="sr-only">{` about ${card.title}`}</span>
                    </a>
                  </div>
                </div>

                <div className="relative h-36 overflow-hidden rounded-2xl bg-white/10 xs:h-44 sm:h-52 lg:h-full">
                  <div data-stack-image className="absolute inset-0">
                    <Image
                      src={card.image.src}
                      alt={card.image.alt}
                      fill
                      sizes="(max-width: 1024px) 90vw, 46vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
