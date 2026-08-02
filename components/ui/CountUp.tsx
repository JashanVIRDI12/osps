'use client';

import { useCountUp } from '@/lib/motion';

type CountUpProps = {
  value: number;
  suffix?: string;
  className?: string;
};

/**
 * Animated number that counts up once when scrolled into view.
 * The final value is rendered server-side and exposed to assistive tech, so the
 * animating digits never have to be announced.
 */
export function CountUp({ value, suffix = '', className }: CountUpProps) {
  const ref = useCountUp(value);

  return (
    <span className={className}>
      <span className="sr-only">{`${value.toLocaleString('en-IN')}${suffix}`}</span>
      <span aria-hidden="true">
        <span ref={ref}>{value.toLocaleString('en-IN')}</span>
        {suffix}
      </span>
    </span>
  );
}
