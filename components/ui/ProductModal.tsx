'use client';

import { useEffect, useId, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { ArrowRight, X } from 'lucide-react';
import { scrollToHash } from '@/lib/scroll';
import { lockScroll, unlockScroll } from '@/lib/scroll-lock';
import { trapFocus } from '@/lib/focus-trap';
import type { Product } from '@/lib/content';

type ProductModalProps = {
  product: Product;
  groupTitle: string;
  open: boolean;
  onClose: () => void;
};

/**
 * Product detail popup — image, variants, and a path into the quote form.
 */
export function ProductModal({
  product,
  groupTitle,
  open,
  onClose,
}: ProductModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    /**
     * `document.body.style.overflow` alone was not enough: Lenis drives the page
     * from its own rAF loop and does not read `overflow`, so on a phone the page
     * kept scrolling underneath the open modal. The shared lock stops both, and
     * refcounts so the drawer and the modal cannot release each other's lock.
     */
    lockScroll();

    const dialog = dialogRef.current;
    const releaseFocus = dialog ? trapFocus(dialog, false) : undefined;
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      releaseFocus?.();
      unlockScroll();
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const enquire = () => {
    onClose();
    window.setTimeout(() => scrollToHash('#contact'), 80);
  };

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close product details"
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-card-elevated border border-line bg-surface shadow-card-hover sm:max-h-[88svh] sm:rounded-card-elevated"
      >
        {/* Shallower crop on a phone: the sheet opens from the bottom edge, so
            every pixel the image takes is a pixel the configurations list and
            the enquiry button lose. */}
        <div className="relative aspect-[16/9] w-full shrink-0 bg-royal-tint xs:aspect-[16/10] sm:aspect-[16/9]">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
          {/* No scrim. This is the one view where the product is being
              examined, and the only things over the image — the number pill and
              the close button — already carry their own backgrounds. */}
          <span className="absolute left-5 top-5 rounded-pill bg-white/90 px-3 py-1.5 text-caption font-semibold tracking-[0.12em] text-royal backdrop-blur-sm">
            {product.number}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-pill border border-white/35 bg-ink/55 text-white backdrop-blur-md transition-colors hover:bg-ink/75 sm:h-10 sm:w-10"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="overscroll-lock flex flex-1 flex-col gap-6 overflow-y-auto p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] xs:p-6 sm:p-8">
          <div>
            <p className="text-caption font-medium uppercase tracking-[0.14em] text-royal">
              {groupTitle}
            </p>
            <h2
              id={titleId}
              className="mt-2 text-balance text-[1.75rem] font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-[2.1rem]"
            >
              {product.name}
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-body text-ink-muted">
              Available in the configurations below. Send a requirement list and
              we will quote this line the same working day.
            </p>
          </div>

          <div>
            <h3 className="text-caption font-medium uppercase tracking-[0.14em] text-ink-soft">
              Configurations
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <li
                  key={variant}
                  className="rounded-pill border border-royal-wash bg-royal-tint px-3.5 py-2 text-body-sm font-medium text-royal"
                >
                  {variant}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={enquire}
              className="btn-accent w-full px-6 py-3.5 sm:w-auto"
            >
              Enquire about this line
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline w-full px-6 py-3.5 sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
