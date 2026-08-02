'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface GalleryItem {
  common: string;
  binomial: string;
  photo: {
    url: string;
    text: string;
    pos?: string;
    by: string;
  };
}

interface CircularGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** How far the items sit from the centre. */
  radius?: number;
  /**
   * Element that provides the sticky scroll runway. While that track moves
   * through the viewport, the gallery completes `scrollTurns` full rotations
   * so every card can face forward before the section ends.
   */
  trackRef?: React.RefObject<HTMLElement | null>;
  /** Full 360° spins across the track. Default 1.5. */
  scrollTurns?: number;
}

/**
 * Circular 3D gallery — cards orbit on a ring, driven by the local sticky
 * scroll track so you can see every card before leaving the section.
 */
const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    { items, className, radius = 560, trackRef, scrollTurns = 1.5, ...props },
    ref
  ) => {
    const [rotation, setRotation] = useState(0);
    const [activeRadius, setActiveRadius] = useState(radius);
    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const updateRadius = () => {
        const width = window.innerWidth;
        if (width < 640) setActiveRadius(Math.min(radius, 280));
        else if (width < 1024) setActiveRadius(Math.min(radius, 420));
        else setActiveRadius(radius);
      };

      updateRadius();
      window.addEventListener('resize', updateRadius);
      return () => window.removeEventListener('resize', updateRadius);
    }, [radius]);

    useEffect(() => {
      const updateFromTrack = () => {
        const track = trackRef?.current;
        if (!track) return;

        const rect = track.getBoundingClientRect();
        const trackHeight = track.offsetHeight;
        const viewport = window.innerHeight;
        const scrollable = Math.max(trackHeight - viewport, 1);
        // 0 when the track top hits the viewport top; 1 when the track bottom
        // reaches the viewport bottom (sticky section about to release).
        const scrolled = Math.min(
          Math.max(-rect.top, 0),
          scrollable
        );
        const progress = scrolled / scrollable;
        setRotation(progress * 360 * scrollTurns);
      };

      updateFromTrack();
      window.addEventListener('scroll', updateFromTrack, { passive: true });
      window.addEventListener('resize', updateFromTrack);
      return () => {
        window.removeEventListener('scroll', updateFromTrack);
        window.removeEventListener('resize', updateFromTrack);
      };
    }, [trackRef, scrollTurns]);

    const anglePerItem = items.length > 0 ? 360 / items.length : 0;

    return (
      <div
        ref={(node) => {
          sectionRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        role="region"
        aria-label="Industries circular gallery"
        className={cn(
          'relative flex h-full w-full items-center justify-center',
          className
        )}
        style={{ perspective: '2000px' }}
        {...props}
      >
        <div
          className="relative h-full w-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = ((rotation % 360) + 360) % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(
              relativeAngle > 180 ? 360 - relativeAngle : relativeAngle
            );
            const opacity = Math.max(0.35, 1 - normalizedAngle / 180);

            return (
              <div
                key={`${item.common}-${item.photo.url}`}
                role="group"
                aria-label={item.common}
                className="absolute h-[340px] w-[240px] sm:h-[380px] sm:w-[280px] lg:h-[400px] lg:w-[300px]"
                style={{
                  transform: `translate(-50%, -50%) rotateY(${itemAngle}deg) translateZ(${activeRadius}px)`,
                  left: '50%',
                  top: '50%',
                  opacity,
                  transition: 'opacity 0.3s linear',
                }}
              >
                <div className="group relative h-full w-full overflow-hidden rounded-card border border-white/40 bg-royal-deep/20 shadow-card backdrop-blur-lg sm:rounded-card-elevated">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                    draggable={false}
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-royal-deep/90 via-royal-deep/45 to-transparent p-4 text-white sm:p-5">
                    <p className="text-caption font-semibold uppercase tracking-[0.14em] text-accent-soft">
                      {item.photo.by}
                    </p>
                    <h3 className="mt-1 text-balance text-lg font-semibold leading-tight tracking-[-0.03em] sm:text-xl">
                      {item.common}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-pretty text-body-sm text-white/80">
                      {item.binomial}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
