'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the InteractiveTravelCard (Product Card) component.
 */
export interface InteractiveTravelCardProps {
  /** The main title for the card, e.g. product name */
  title: string;
  /** A subtitle or comma/dot-separated product line */
  subtitle?: string;
  /** Specific variant tags or configurations */
  variants?: string[];
  /** The URL for the product image. */
  imageUrl: string;
  /** Accessible alt text for the image. */
  imageAlt?: string;
  /** Optional leading label, e.g. product number "01". */
  badge?: string;
  /** The text for the primary action button. */
  actionText?: string;
  /** The destination URL for the top-right link. */
  href?: string;
  /** Callback function when the primary action button or card is clicked. */
  onActionClick: () => void;
  /** Optional additional class names for custom styling. */
  className?: string;
  /**
   * Heading level for the card title. The catalogue nests these under a group
   * `h3`, so they need to be `h4` to keep the outline in order.
   */
  titleAs?: 'h2' | 'h3' | 'h4';
}

/**
 * True only on devices that can actually hover with a precise pointer.
 */
function useFinePointer() {
  const [fine, setFine] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setFine(query.matches);

    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return fine;
}

/**
 * Premium Hospital & Surgical Product Card with smooth 3D tilt,
 * framed medical photography, specification chips, and micro-interactions.
 */
export const InteractiveTravelCard = React.forwardRef<
  HTMLDivElement,
  InteractiveTravelCardProps
>(
  (
    {
      title,
      subtitle,
      variants,
      imageUrl,
      imageAlt,
      badge,
      actionText = 'View Specifications',
      href,
      onActionClick,
      className,
      titleAs: Title = 'h3',
    },
    ref
  ) => {
    const finePointer = useFinePointer();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 18, stiffness: 140 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(springY, [-0.5, 0.5], ['4deg', '-4deg']);
    const rotateY = useTransform(springX, [-0.5, 0.5], ['-4deg', '4deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const { width, height, left, top } = rect;
      const mouseXVal = e.clientX - left;
      const mouseYVal = e.clientY - top;
      const xPct = mouseXVal / width - 0.5;
      const yPct = mouseYVal / height - 0.5;
      mouseX.set(xPct);
      mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const parsedVariants = variants && variants.length > 0
      ? variants
      : subtitle
        ? subtitle.split(/·|,/).map((s) => s.trim()).filter(Boolean)
        : [];

    return (
      <motion.div
        ref={ref}
        onMouseMove={finePointer ? handleMouseMove : undefined}
        onMouseLeave={finePointer ? handleMouseLeave : undefined}
        style={
          finePointer
            ? { rotateX, rotateY, transformPerspective: 1000 }
            : undefined
        }
        className={cn(
          'group relative flex h-full w-full flex-col overflow-hidden rounded-card-elevated border border-line bg-surface shadow-card transition-all duration-300 hover:border-royal/40 hover:shadow-card-hover',
          className
        )}
      >
        {/* Top Image Frame */}
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gradient-to-br from-royal-wash/60 via-slate-50 to-teal-tint/40 sm:aspect-[16/11]">
          <Image
            src={imageUrl}
            alt={imageAlt ?? `${title} - Surgical Supplies`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px"
            className="object-cover object-center transition-transform duration-500 ease-smooth group-hover:scale-105"
          />

          {/* Soft ambient gradient overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-black/10 opacity-70 transition-opacity duration-300 group-hover:opacity-40"
          />

          {/* Top Badge (Product Number) */}
          {badge ? (
            <div className="absolute left-2.5 top-2.5 z-10 xs:left-3 xs:top-3 sm:left-4 sm:top-4">
              <span className="inline-flex items-center rounded-pill border border-royal-line/60 bg-white/90 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-royal shadow-sm backdrop-blur-md xs:text-[11px] sm:px-2.5 sm:py-1 sm:text-xs">
                № {badge}
              </span>
            </div>
          ) : null}

          {/* Top Right Quick Expand Indicator */}
          <div className="absolute right-2.5 top-2.5 z-10 xs:right-3 xs:top-3 sm:right-4 sm:top-4">
            <button
              type="button"
              onClick={onActionClick}
              aria-label={`Open details for ${title}`}
              className="grid h-7 w-7 place-items-center rounded-full border border-white/60 bg-white/80 text-ink-muted shadow-sm backdrop-blur-md transition-all duration-300 group-hover:border-royal-line group-hover:bg-royal group-hover:text-white xs:h-8 xs:w-8 sm:h-9 sm:w-9"
            >
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="flex flex-1 flex-col justify-between p-3.5 xs:p-4 sm:p-5">
          <div>
            <Title className="text-balance text-[0.95rem] font-semibold leading-snug tracking-[-0.03em] text-ink transition-colors duration-300 group-hover:text-royal xs:text-[1.05rem] sm:text-[1.25rem]">
              {title}
            </Title>

            {/* Specification / Variant Chips */}
            {parsedVariants.length > 0 ? (
              <div className="mt-2.5 flex flex-wrap gap-1.5 xs:mt-3 sm:gap-2">
                {parsedVariants.slice(0, 3).map((variant) => (
                  <span
                    key={variant}
                    className="inline-flex items-center rounded-md border border-royal-line/40 bg-royal-tint/60 px-2 py-0.5 text-[10px] font-medium tracking-tight text-royal-shade xs:text-[11px] sm:text-xs"
                  >
                    {variant}
                  </span>
                ))}
                {parsedVariants.length > 3 ? (
                  <span className="inline-flex items-center rounded-md border border-line bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted xs:text-[11px]">
                    +{parsedVariants.length - 3}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Action Button */}
          <div className="mt-4 pt-3 border-t border-line/70 xs:mt-5 sm:pt-4">
            <button
              type="button"
              onClick={onActionClick}
              className="group/btn relative flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl border border-royal-line/70 bg-royal-wash/60 px-3 py-2 text-center text-[12px] font-semibold text-royal shadow-sm transition-all duration-300 hover:border-royal hover:bg-royal hover:text-white active:scale-[0.98] xs:text-[13px] sm:min-h-[44px] sm:py-2.5 sm:text-body-sm"
            >
              <span>{actionText}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
);

InteractiveTravelCard.displayName = 'InteractiveTravelCard';
