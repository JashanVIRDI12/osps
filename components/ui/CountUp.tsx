'use client';

import { useCountUp } from '@/lib/motion';

type CountUpProps = {
  value: number;
  suffix?: string;
  className?: string;
};

/**
 * Animated number that counts up once when scrolled into view.
 *
 * The accessible name lives on the wrapper (`aria-label`) so screen readers
 * hear the final figure once. A separate visually-hidden copy of the same
 * number used to sit next to the animating digits, which meant selecting the
 * section — or a reader that ignores `sr-only` — announced "15 15".
 */
export function CountUp({ value, suffix = '', className }: CountUpProps) {
  const ref = useCountUp(value);
  const label = `${value.toLocaleString('en-IN')}${suffix}`;

  return (
    <span className={className} aria-label={label}>
      <span aria-hidden="true">
        <span ref={ref}>{value.toLocaleString('en-IN')}</span>
        {suffix}
      </span>
    </span>
  );
}
