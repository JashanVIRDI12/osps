'use client';

import { ArrowRight } from 'lucide-react';
import { useReveal } from '@/lib/motion';
import { scrollToHash } from '@/lib/scroll';
import { productAccent, productCategories } from '@/lib/content';
import {
  StackingCards,
  type StackingCardItem,
} from '@/components/ui/StackingCards';

/**
 * The four supply lines, as a deck that assembles itself on scroll.
 *
 * The cards step down the royal ramp from deep to bright, so the deck reads as
 * one system rather than four unrelated panels, and each card keeps enough room
 * for its description, its sub-lines and a photograph at the size the type
 * scale needs.
 */
const cards: StackingCardItem[] = productCategories.map((category) => ({
  number: category.number,
  title: category.title,
  description: category.description,
  bullets: category.items,
  icon: category.icon,
  tone: category.tone,
  image: category.image,
  href: '#contact',
  ctaLabel: 'Enquire about this line',
}));

export function Capabilities() {
  const headerRef = useReveal<HTMLDivElement>({ stagger: 0.1 });

  return (
    <section id="products" className="section-base relative">
      <div ref={headerRef} className="shell pt-20 sm:pt-24 lg:pt-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="heading-section max-w-none" data-reveal>
              <span className="heading-kicker">What we supply</span>
              Four supply lines, one accountable partner.
            </h2>
          </div>

          <p
            className="max-w-sm text-pretty text-body-sm leading-relaxed text-ink-muted lg:pb-2"
            data-reveal
          >
            {productAccent.body}
          </p>
        </div>
      </div>

      {/* The desktop deck opens with a full viewport-height track, which is its
          own separation from the header and from the CTA below it. The mobile
          stack has no such stage, so it asks for the spacing explicitly. */}
      <StackingCards cards={cards} className="shell mt-10 sm:mt-12 lg:mt-0" />

      <div className="shell mt-14 pb-20 sm:mt-16 sm:pb-24 lg:mt-0 lg:pb-28">
        <div className="card-metric flex flex-col gap-6 p-6 xs:p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <p className="max-w-xl text-balance text-[1.35rem] font-semibold leading-tight tracking-[-0.03em] xs:text-heading-sm">
            {productAccent.title}
          </p>
          {/* Full-bleed on a phone — a right-aligned pill under a stacked
              paragraph reads as an orphan, and this is a primary action. */}
          <a
            href={productAccent.cta.href}
            onClick={(event) => {
              if (scrollToHash(productAccent.cta.href)) event.preventDefault();
            }}
            className="btn-light w-full shrink-0 px-6 py-3.5 sm:w-auto"
          >
            {productAccent.cta.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
