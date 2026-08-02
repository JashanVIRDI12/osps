'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useReveal } from '@/lib/motion';
import {
  highlights,
  productGroups,
  productImageCard,
  type Product,
} from '@/lib/content';
import { InteractiveTravelCard } from '@/components/ui/3d-card';

/**
 * The detail popup is only ever reached by a tap, so its code has no business
 * in the first load — it ships on demand instead. `ssr: false` because it
 * portals into `document.body` and renders nothing until it is opened.
 */
const ProductModal = dynamic(
  () => import('@/components/ui/ProductModal').then((mod) => mod.ProductModal),
  { ssr: false }
);

type SelectedProduct = {
  product: Product;
  groupTitle: string;
};

/**
 * Full surgical range as 3D tilt image cards — each product opens a detail
 * popup so the catalogue reads as a visual inventory, not only a list.
 */
export function Catalogue() {
  const ref = useReveal<HTMLElement>({ stagger: 0.04 });
  const [selected, setSelected] = useState<SelectedProduct | null>(null);

  const total = productGroups.reduce(
    (count, group) => count + group.products.length,
    0
  );

  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <section ref={ref} className="section-surface relative py-20 sm:py-24 lg:py-28">
      <div className="shell">
        <div className="max-w-3xl">
          <h2 className="heading-section max-w-none" data-reveal>
            <span className="heading-kicker">The range</span>
            Complete range of surgical products.
          </h2>
          <p className="mt-6 text-pretty text-body text-ink-muted" data-reveal>
            {`${total} categories, each supplied in the configurations below. Everything is quoted the same working day. Send a requirement list and we will price it line by line.`}
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight) => {
            const Icon = highlight.icon;

            return (
              <li
                key={highlight.label}
                className="flex items-center gap-3 rounded-pill border border-royal-wash bg-royal-tint px-4 py-3"
                data-reveal
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-royal"
                  aria-hidden="true"
                />
                <span className="text-body-sm font-medium text-royal">
                  {highlight.label}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-16 flex flex-col gap-14 sm:mt-20 sm:gap-16">
          {productGroups.map((group) => (
            <div key={group.title}>
              <div
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-4"
                data-reveal
              >
                <h3 className="text-heading-sm text-ink">{group.title}</h3>
                <span className="text-caption font-medium uppercase tracking-[0.14em] text-ink-soft">
                  {`${group.products.length} ${group.products.length === 1 ? 'category' : 'categories'}`}
                </span>
              </div>

              {/* Two-up on phones. Fifteen full-width 368px-tall cards was
                  roughly 8000px of scrolling to get through the range; paired
                  cards halve that and let the eye compare across a row, which
                  is how a catalogue is actually read. */}
              <ul className="mt-6 grid grid-cols-2 gap-3 xs:gap-4 sm:gap-5 lg:grid-cols-3">
                {group.products.map((product) => (
                  <li key={product.number} data-reveal>
                    <InteractiveTravelCard
                      title={product.name}
                      titleAs="h4"
                      subtitle={product.variants.join(' · ')}
                      imageUrl={product.image.src}
                      imageAlt={product.image.alt}
                      badge={product.number}
                      actionText="Show more"
                      href={`#product-${product.number}`}
                      onActionClick={() =>
                        setSelected({ product, groupTitle: group.title })
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <figure
          className="relative mt-16 overflow-hidden rounded-card-elevated border border-line sm:mt-20"
          data-reveal
        >
          {/* A 16:8 crop is only ~140px tall on a 320px phone — the caption
              alone needs more than that and would blanket the photograph. The
              crop deepens as the viewport narrows so the image keeps its own
              space. */}
          <div className="relative aspect-[3/2] w-full xs:aspect-[16/8] sm:aspect-[21/8]">
            <Image
              src={productImageCard.src}
              alt={productImageCard.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 1200px"
              className="object-cover object-[center_40%]"
              priority={false}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-royal-deep/90 via-royal-deep/35 to-royal-deep/10"
            />
          </div>
          <figcaption className="absolute inset-x-5 bottom-5 max-w-xl text-balance text-[1.05rem] font-semibold leading-snug tracking-[-0.03em] text-white xs:inset-x-6 xs:bottom-6 xs:text-[1.2rem] sm:inset-x-8 sm:bottom-8 sm:text-heading-sm">
            {productImageCard.caption}
          </figcaption>
        </figure>
      </div>

      {selected ? (
        <ProductModal
          product={selected.product}
          groupTitle={selected.groupTitle}
          open
          onClose={closeModal}
        />
      ) : null}
    </section>
  );
}
