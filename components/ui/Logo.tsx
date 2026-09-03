import Image from 'next/image';
import { cn } from '@/lib/cn';

type LogoProps = {
  className?: string;
  /** `light` = placed on a royal surface. */
  tone?: 'dark' | 'light';
  /**
   * `lockup` pairs the heart mark with the wordmark horizontally — the brand
   * logo is a tall stack, which does not fit an 80px navigation bar.
   * `stacked` renders the full artwork as supplied.
   */
  variant?: 'lockup' | 'stacked';
};

export function Logo({
  className,
  tone = 'dark',
  variant = 'lockup',
}: LogoProps) {
  const onDark = tone === 'light';

  if (variant === 'stacked') {
    return (
      <Image
        // The navy wordmark is unreadable on a royal surface, so dark placements
        // get the knockout artwork instead.
        src={onDark ? '/osps-logo-light.webp' : '/osps-logo.webp'}
        alt="Om Sai Pharma & Surgicals"
        width={321}
        height={400}
        sizes="132px"
        className={cn('h-auto w-[132px]', className)}
      />
    );
  }

  return (
    <span className={cn('flex min-w-0 items-center gap-2 sm:gap-2.5', className)}>
      {/* `sizes` matters more than it looks: without it Next builds a 1x/2x
          srcset off the intrinsic width and preloads a large asset for a
          mark that renders at ~40px — bandwidth taken directly from the hero
          image on the critical path. */}
      <Image
        src="/osps-mark.webp"
        alt=""
        aria-hidden="true"
        width={128}
        height={110}
        sizes="44px"
        className="h-8 w-auto shrink-0 xs:h-9"
        priority
      />
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            'text-[17px] font-semibold tracking-tight',
            onDark ? 'text-ink' : 'text-ink'
          )}
        >
          OSPS
        </span>
        {/**
         * The descriptor needs ~185px, and the bar has ~155px to give it at
         * 320px once the mark and the 44px menu button are placed — it used to
         * wrap the header onto a second line there. 370px is where the space
         * comes back with margin, which covers every current phone from the
         * 375px iPhone SE upwards; below it the lockup falls back to the mark
         * plus "OSPS". The full name is still on the link's `aria-label`, so
         * assistive tech loses nothing either way.
         */}
        <span
          className={cn(
            'mt-1 hidden truncate text-[10px] font-medium uppercase tracking-[0.16em] min-[370px]:block',
            onDark ? 'text-royal-mist' : 'text-ink-soft'
          )}
        >
          Om Sai Pharma &amp; Surgicals
        </span>
      </span>
    </span>
  );
}
