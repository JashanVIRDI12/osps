'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the InteractiveTravelCard component.
 */
export interface InteractiveTravelCardProps {
  /** The main title for the card, e.g. product name */
  title: string;
  /** A subtitle or location / product line */
  subtitle: string;
  /** The URL for the background image. */
  imageUrl: string;
  /** Accessible alt text for the image. */
  imageAlt?: string;
  /** Optional leading label, e.g. product number "01". */
  badge?: string;
  /** The text for the primary action button. */
  actionText: string;
  /** The destination URL for the top-right link. */
  href: string;
  /** Callback function when the primary action button is clicked. */
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
 *
 * Starts `false` so the server markup and the first client render agree, then
 * flips after mount — a touch device therefore never mounts the tilt at all,
 * which matters here because the catalogue renders twenty-odd of these and each
 * live `transformPerspective` promotes its own compositor layer.
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
 * A responsive product card with a light hover tilt.
 *
 * Intentionally flat: nested preserve-3d / translateZ / backdrop-blur stacks
 * left compositor gaps that showed as white bands across the catalogue photos.
 */
export const InteractiveTravelCard = React.forwardRef<
  HTMLDivElement,
  InteractiveTravelCardProps
>(
  (
    {
      title,
      subtitle,
      imageUrl,
      imageAlt,
      badge,
      actionText,
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

    const springConfig = { damping: 15, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(springY, [-0.5, 0.5], ['5deg', '-5deg']);
    const rotateY = useTransform(springX, [-0.5, 0.5], ['-5deg', '5deg']);

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

    return (
      <motion.div
        ref={ref}
        onMouseMove={finePointer ? handleMouseMove : undefined}
        onMouseLeave={finePointer ? handleMouseLeave : undefined}
        style={
          finePointer
            ? { rotateX, rotateY, transformPerspective: 900 }
            : undefined
        }
        /* Below `sm` the card sits in a two-up grid — roughly 134px wide at
           320px — so it is reproportioned rather than merely squeezed. From
           `sm` up the grid was already two columns and nothing here changes. */
        className={cn(
          'relative h-[14rem] w-full overflow-hidden rounded-card border border-line/60 bg-royal-deep shadow-card xs:h-[16.5rem] sm:h-[26rem]',
          className
        )}
      >
        <Image
          src={imageUrl}
          alt={imageAlt ?? `${title}, ${subtitle}`}
          fill
          /* Half the viewport on a phone now, not all of it — the two-up grid
             halves the pixels every one of these fifteen images has to ship. */
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-royal-deep/35 via-transparent to-royal-deep/75" />

        <div className="relative flex h-full flex-col justify-between p-3 text-white xs:p-3.5 sm:p-5">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="min-w-0">
              {badge ? (
                <span className="mb-1.5 inline-flex rounded-pill bg-white/90 px-2 py-0.5 text-[10px] font-semibold tracking-[0.1em] text-royal sm:mb-2 sm:px-2.5 sm:py-1 sm:text-caption sm:tracking-[0.12em]">
                  {badge}
                </span>
              ) : null}
              <Title className="text-balance text-[0.95rem] font-semibold leading-[1.15] tracking-[-0.03em] xs:text-[1.05rem] sm:text-2xl sm:leading-tight">
                {title}
              </Title>
              {/* Variant lists run long ("With Needle · Without Needle"), and in
                  a 110px column they would eat the card. Clamped on phones,
                  full text from `sm` where there is room for it. */}
              <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-snug text-white/80 xs:text-[12px] sm:line-clamp-none sm:text-pretty sm:text-body-sm">
                {subtitle}
              </p>
            </div>
            {/* Hidden on phones: it duplicates the button below, and at this
                width a 44px circle crowds out the title it sits beside. */}
            <motion.a
              href={href}
              onClick={(event) => {
                if (href.startsWith('#')) {
                  event.preventDefault();
                  onActionClick();
                }
              }}
              whileHover={{ scale: 1.1, rotate: '2.5deg' }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Show more about ${title}`}
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/25 ring-1 ring-inset ring-white/35 transition-colors hover:bg-white/35 sm:flex"
            >
              <ArrowUpRight className="h-5 w-5 text-white" aria-hidden="true" />
            </motion.a>
          </div>

          <motion.button
            type="button"
            onClick={onActionClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            /* `min-h` holds the 44px tap target even though the type and
               padding shrink — this is the card's only control on a phone. */
            className={cn(
              'min-h-[44px] w-full rounded-input px-2 py-2 text-center text-[13px] font-semibold text-white transition-colors xs:text-[14px] sm:py-3 sm:text-body',
              'bg-royal-deep/55 ring-1 ring-inset ring-white/25 hover:bg-royal-deep/70'
            )}
          >
            {actionText}
          </motion.button>
        </div>
      </motion.div>
    );
  }
);
InteractiveTravelCard.displayName = 'InteractiveTravelCard';
