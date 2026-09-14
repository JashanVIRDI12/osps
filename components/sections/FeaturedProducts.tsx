'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ArrowRight, PackageCheck } from 'lucide-react';
import { useReveal } from '@/lib/motion';
import { scrollToHash } from '@/lib/scroll';
import { productGroups, type Product } from '@/lib/content';

const ProductModal = dynamic(
  () => import('@/components/ui/ProductModal').then((mod) => mod.ProductModal),
  { ssr: false }
);

const FEATURED_NUMBERS = new Set(['01', '02', '03', '06', '08', '13']);

const featuredProducts = productGroups.flatMap((group) =>
  group.products
    .filter((product) => FEATURED_NUMBERS.has(product.number))
    .map((product) => ({ product, groupTitle: group.title }))
);

type SelectedProduct = {
  product: Product;
  groupTitle: string;
};

export function FeaturedProducts() {
  const ref = useReveal<HTMLElement>({ stagger: 0.05 });
  const [selected, setSelected] = useState<SelectedProduct | null>(null);
  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <section ref={ref} id="featured-products" className="section-surface py-20 sm:py-24 lg:py-28">
      <div className="shell">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="heading-section max-w-none" data-reveal>
              <span className="heading-kicker">Featured products</span>
              High-demand medical supplies, ready for B2B enquiries.
            </h2>
          </div>
          <p className="max-w-md text-pretty text-body text-ink-muted" data-reveal>
            Key lines for distributors, retailers, hospitals and institutional procurement teams, with bulk quantities quoted on request.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {featuredProducts.map(({ product, groupTitle }) => (
            <li key={product.number} className="card group overflow-hidden" data-reveal>
              <article className="flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-royal-tint">
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.035]"
                  />
                  <span className="absolute left-4 top-4 rounded-pill border border-white/60 bg-white/90 px-3 py-1.5 text-caption font-semibold tracking-[0.1em] text-royal backdrop-blur-sm">
                    {product.number}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 xs:p-6">
                  <p className="text-caption font-medium uppercase tracking-[0.12em] text-royal">
                    {groupTitle}
                  </p>
                  <h3 className="mt-2 text-[1.25rem] font-semibold leading-tight tracking-[-0.03em] text-ink">
                    {product.name}
                  </h3>
                  <div className="mt-4 flex items-start gap-2.5 rounded-input bg-royal-tint px-3.5 py-3">
                    <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-royal" aria-hidden="true" />
                    <p className="text-body-sm leading-relaxed text-ink-muted">
                      <span className="font-semibold text-ink">Key specification: </span>
                      {product.variants.join(' · ')}
                    </p>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-2.5 pt-6">
                    <button
                      type="button"
                      onClick={() => setSelected({ product, groupTitle })}
                      className="btn-outline px-3 py-2.5 !text-[13px]"
                    >
                      View Details
                    </button>
                    <a
                      href="#contact"
                      onClick={(event) => {
                        if (scrollToHash('#contact')) event.preventDefault();
                      }}
                      className="btn-accent px-3 py-2.5 !text-[13px]"
                    >
                      Request Quote
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
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
