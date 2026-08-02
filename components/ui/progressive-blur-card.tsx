'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressiveBlurProps {
  className?: string;
  blurIntensity?: number;
}

function ProgressiveBlur({
  className = '',
  blurIntensity = 10,
}: ProgressiveBlurProps) {
  return (
    <div
      className={cn(className)}
      style={{
        backdropFilter: `blur(${blurIntensity}px)`,
        WebkitBackdropFilter: `blur(${blurIntensity}px)`,
        mask: 'linear-gradient(to top, black 0%, black 60%, rgba(0,0,0,0.95) 65%, rgba(0,0,0,0.9) 70%, rgba(0,0,0,0.8) 75%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.4) 85%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0.1) 95%, transparent 100%)',
        WebkitMask:
          'linear-gradient(to top, black 0%, black 60%, rgba(0,0,0,0.95) 65%, rgba(0,0,0,0.9) 70%, rgba(0,0,0,0.8) 75%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.4) 85%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0.1) 95%, transparent 100%)',
      }}
    />
  );
}

export type ProgressiveBlurCardProps = {
  title: string;
  subtitle: string;
  image: string;
  imageAlt?: string;
  /** Optional small label above the title. */
  badge?: string;
  onActionClick?: () => void;
  actionLabel?: string;
  className?: string;
};

/**
 * Progressive Blur Card — image-led card with a masked blur fade into readable
 * copy and a round arrow CTA. Adapted from 21st.dev / vvisedev Crafts.
 */
export function ProgressiveBlurCard({
  title,
  subtitle,
  image,
  imageAlt,
  badge,
  onActionClick,
  actionLabel = 'View details',
  className,
}: ProgressiveBlurCardProps) {
  return (
    <div
      className={cn(
        'group relative aspect-square w-full overflow-hidden rounded-card-elevated border-8 border-white shadow-[0_4px_24px_rgba(12,21,51,0.16)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_8px_40px_rgba(12,21,51,0.22)]',
        className
      )}
    >
      <Image
        src={image}
        alt={imageAlt ?? title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <ProgressiveBlur
        className="pointer-events-none absolute bottom-0 left-0 h-[45%] w-full rounded-b-[24px]"
        blurIntensity={8}
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-royal-deep/55 to-transparent transition-all duration-300 group-hover:from-royal-deep/65">
        <div className="flex items-end justify-between gap-3 px-5 py-5 sm:px-6 sm:py-6">
          <div className="min-w-0 transform transition-all duration-300 group-hover:-translate-y-0.5">
            {badge ? (
              <p className="mb-1 text-caption font-semibold uppercase tracking-[0.14em] text-white/80">
                {badge}
              </p>
            ) : null}
            <h3 className="text-balance text-lg font-semibold leading-tight tracking-[-0.03em] text-white transition-all duration-300 sm:text-[1.2rem]">
              {title}
            </h3>
            <p className="mt-1 line-clamp-2 text-pretty text-body-sm text-white/90">
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onActionClick}
            aria-label={actionLabel}
            className="group/button flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-royal-deep/10 transition-all duration-300 hover:scale-110 hover:rotate-12 hover:bg-royal-tint hover:shadow-xl active:scale-95"
          >
            <ArrowRight className="h-5 w-5 text-royal transition-all duration-300 group-hover/button:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
