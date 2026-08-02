'use client';

import createGlobe, { type COBEOptions } from 'cobe';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Export globe — a dotted sphere, slowly rotating and draggable.
 *
 * No route arcs: with two dozen destinations they knot up at the hub and bury
 * the map. Markers are kept to the two Indian hubs plus one anchor per region,
 * so the sphere reads as reach without turning back into a scatter of pins. The
 * region list beside the globe names the full set of markets.
 */

type Coord = [number, number];

const ROYAL: [number, number, number] = [29 / 255, 63 / 255, 191 / 255];
const ACCENT: [number, number, number] = [220 / 255, 36 / 255, 54 / 255];

const HUBS: Coord[] = [
  [19.076, 72.8777], // Mumbai
  [28.6139, 77.209], // Delhi
];

/** One anchor per export region, not one per city. */
const REGION_ANCHORS: Coord[] = [
  [25.2048, 55.2708], // Dubai — Gulf
  [1.3521, 103.8198], // Singapore — South-East Asia
  [-1.2921, 36.8219], // Nairobi — East Africa
  [6.5244, 3.3792], // Lagos — West Africa
  [51.5074, -0.1278], // London — Europe
  [40.7128, -74.006], // New York — Americas
];

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.28,
  dark: 0,
  diffuse: 0.55,
  // Fewer, larger dots. At 22000 the landmass turns into fine noise that reads
  // as texture rather than geography.
  mapSamples: 10000,
  mapBrightness: 1.5,
  mapBaseBrightness: 0.05,
  // Deep enough to separate from the white card behind it.
  baseColor: [0.76, 0.82, 0.94],
  markerColor: ROYAL,
  glowColor: [0.74, 0.8, 0.94],
  markerElevation: 0.015,
  markers: [
    ...HUBS.map((location) => ({ location, size: 0.038, color: ACCENT })),
    ...REGION_ANCHORS.map((location) => ({ location, size: 0.022 })),
  ],
};

/**
 * Rotation that puts South Asia at the centre on load, rather than the empty
 * Pacific.
 */
const START_PHI = 4.28;

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(START_PHI);
  const dragOffsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = canvas.offsetWidth;
    let frame = 0;
    let destroyed = false;
    let onScreen = false;

    const globe = createGlobe(canvas, {
      ...config,
      width: width * 2,
      height: width * 2,
      phi: START_PHI,
    });

    const animate = () => {
      if (destroyed) return;

      // Auto-rotate unless the visitor is dragging, or has asked for less motion.
      if (pointerInteracting.current === null && !reduced) {
        phiRef.current += 0.0032;
      }

      globe.update({
        phi: phiRef.current + dragOffsetRef.current,
        width: width * 2,
        height: width * 2,
      });
      frame = requestAnimationFrame(animate);
    };

    /**
     * A WebGL globe redrawing 60 times a second is the most expensive thing on
     * the page, and it sits two thirds of the way down it. Gating the loop on
     * visibility means a phone spends nothing on it until the section is
     * actually on screen, and stops again the moment it scrolls away or the tab
     * goes to the background.
     */
    const sync = () => {
      const shouldRun = onScreen && document.visibilityState === 'visible';

      if (shouldRun && !frame) {
        frame = requestAnimationFrame(animate);
      } else if (!shouldRun && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });

    observer.observe(canvas);
    document.addEventListener('visibilitychange', sync);

    /**
     * `ResizeObserver` rather than a window `resize` listener: on a phone the
     * address bar fires window resizes constantly without the canvas ever
     * changing width, and each one would otherwise force a re-read of layout.
     */
    const resizeObserver = new ResizeObserver(() => {
      width = canvas.offsetWidth;
    });

    resizeObserver.observe(canvas);
    canvas.style.opacity = '1';

    return () => {
      destroyed = true;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
      globe.destroy();
    };
  }, [config]);

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? 'grabbing' : 'grab';
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      dragOffsetRef.current = delta / 200;
    }
  };

  return (
    <div
      className={cn(
        'relative mx-auto aspect-square w-full max-w-[520px]',
        className
      )}
    >
      {/* Soft royal halo so the pale sphere separates from the white card. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[8%] rounded-full bg-royal/10 blur-2xl"
      />
      {/**
       * `touch-action: pan-y` keeps the drag horizontal-only: without it a
       * vertical swipe that starts on the globe is swallowed by the canvas and
       * the page refuses to scroll — on a full-width globe that is most of the
       * section.
       */}
      <canvas
        className="relative size-full touch-pan-y opacity-0 transition-opacity duration-700 [contain:layout_paint_size]"
        ref={canvasRef}
        aria-hidden="true"
        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onPointerCancel={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}
