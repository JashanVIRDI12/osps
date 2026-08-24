'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import { scrollToHash } from '@/lib/scroll';
import { cn } from '@/lib/cn';
import { LoopVideo } from '@/components/ui/LoopVideo';

/**
 * Stacking scroll cards — adapted from ui-layout's Stacking Cards
 * (21st.dev), rebuilt on this project's motion runtime.
 *
 * The deck gathers the same way at every size, but it is built two different
 * ways, because the two platforms can afford different things.
 *
 * Desktop — each card is sticky inside its own viewport-height track, and a
 * scrubbed GSAP timeline shrinks every card as the ones after it land on top:
 * card `i` scales from 1 to `1 - (count - i) * 0.05` across the remainder of the
 * section, and each card's image settles from 2x as its track rises into view.
 *
 * Mobile — the same gather, expressed entirely in CSS. Each track is sticky at
 * `header + index * PEEK_MOBILE`, so card 2 comes to rest ten pixels below card
 * 1, card 3 ten below that, and each card slides over the one before it leaving
 * a sliver of its top edge showing. No JavaScript runs while scrolling: sticky
 * positioning is resolved by the compositor, so the deck costs a phone nothing
 * per frame.
 *
 * The scrubbed `scale` is deliberately *not* reinstated on mobile. It was the
 * measured cause of the dropped frames through this section — animating scale on
 * a card carrying a large blurred shadow forces that shadow to be re-rastered at
 * every intermediate size, four cards deep, on every frame. Sticky alone gives
 * the stack; the scale only added depth to it.
 *
 * One deliberate departure from the source component: no `<ReactLenis root>`.
 * Smooth scrolling is owned by MotionRoot, and a second root instance would
 * fight the first for the scroll position.
 *
 * Under `prefers-reduced-motion` the tracks un-stick and the deck degrades to a
 * plain vertical list, without any JavaScript involved.
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
  /** `video` is optional: when absent the still carries the card on its own. */
  image: { src: string; alt: string; video?: string };
};

type StackingCardsProps = {
  cards: StackingCardItem[];
  className?: string;
};

/**
 * Vertical offset per card that keeps earlier cards peeking out from under the
 * ones stacked on top of them.
 *
 * The offsets accumulate, so the phone value has to stay small: at 25px the
 * fourth card would come to rest 75px further down than the first, and on a
 * 667px screen that is height the card itself needs. 10px is still a legible
 * sliver of the card underneath.
 */
const PEEK = 25;
const PEEK_MOBILE = 10;

/** Clearance for the fixed header, so a stuck card never lands behind it. */
const HEADER_CLEARANCE = '4.75rem';

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
            style={
              {
                '--stack-top': `calc(${HEADER_CLEARANCE} + ${
                  index * PEEK_MOBILE
                }px)`,
                /**
                 * Later cards paint over earlier ones — which DOM order already
                 * gives, right up until the deck's bottom edge is reached and
                 * the tracks stop sticking. They release at different scroll
                 * positions, because the cards are not all the same height, and
                 * for those few hundred pixels a card can slide up past one that
                 * should still be covering it. Pinning the order explicitly
                 * makes the exit read as the whole stack leaving together.
                 */
                zIndex: index + 1,
              } as React.CSSProperties
            }
            /**
             * Sticky at both sizes, but resolved differently.
             *
             * Below `lg` the track sticks at its own accumulated offset, which
             * is what produces the stack: each card comes to rest 10px lower
             * than the one before it and covers everything but that sliver. The
             * gap in flow (`mb`) is the breathing room between cards while they
             * are still scrolling past — it is margin rather than padding so it
             * does not travel with the stuck card.
             *
             * From `lg` the track becomes its own viewport-height stage with the
             * card centred in it, which is what the scrubbed timeline expects.
             * `min-h` rather than `h`, because a card grows past the viewport
             * once its description and pills wrap, and a hard `h-svh` would let
             * it spill over the tracks either side of it.
             *
             * `motion-reduce` un-sticks everything: no gather, just a list.
             */
            className="sticky top-[var(--stack-top)] mb-5 flex items-center justify-center last:mb-0 motion-reduce:static sm:mb-6 lg:top-0 lg:mb-0 lg:min-h-svh lg:last:mb-0"
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
               * The mobile shadow is cast *upwards*, because on a phone the
               * card that needs separating is the one underneath — the deck
               * gathers downward, so each card's top edge is the seam.
               *
               * A blurred shadow is affordable here in a way it was not before:
               * a sticky card is composited as its own layer and its shadow is
               * rastered once, then simply moved. It was only expensive while a
               * scrubbed `scale` kept changing the size it had to be drawn at.
               */
              className="relative flex w-full origin-top flex-col rounded-card-elevated p-5 text-white shadow-[0_-12px_32px_-16px_rgba(8,16,50,0.55)] xs:p-6 sm:p-8 lg:top-[calc(-5vh+var(--peek))] lg:h-[460px] lg:w-[84%] lg:p-10 lg:shadow-[0_30px_80px_-40px_rgba(8,16,50,0.7)]"
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
                  {/**
                   * The still is the default and the clip is the upgrade: when a
                   * card has no footage yet, or the visitor is on a phone, on a
                   * metered connection or has asked for less motion, LoopVideo
                   * renders the same photograph and nothing is downloaded. So a
                   * card can be given a clip whenever one exists, without any
                   * other part of the deck changing.
                   */}
                  <div data-stack-image className="absolute inset-0">
                    {card.image.video ? (
                      <LoopVideo
                        src={card.image.video}
                        poster={card.image.src}
                        alt={card.image.alt}
                        label={card.image.alt}
                        className="h-full w-full"
                      />
                    ) : (
                      <Image
                        src={card.image.src}
                        alt={card.image.alt}
                        fill
                        sizes="(max-width: 1024px) 90vw, 46vw"
                        className="object-cover"
                      />
                    )}
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
