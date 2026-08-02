'use client';

import { useId } from 'react';

type HexPatternProps = {
  className?: string;
  /** Tile scale. Larger reads calmer; smaller reads as texture. */
  scale?: number;
  /** Stroke weight of the honeycomb lines. */
  strokeWidth?: number;
};

/**
 * Decorative honeycomb watermark.
 *
 * The pattern id is generated per instance — a hardcoded id collides if the
 * component is ever rendered twice on a page, and every instance after the first
 * silently picks up the first one's geometry.
 */
export function HexPattern({
  className,
  scale = 1.8,
  strokeWidth = 1,
}: HexPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={className}
      width="100%"
      height="100%"
      focusable="false"
    >
      <defs>
        <pattern
          id={id}
          width="56"
          height="97"
          patternUnits="userSpaceOnUse"
          patternTransform={`scale(${scale})`}
        >
          <path
            d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 64 L56 80 L56 112 M28 64 L0 80 L0 112"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
