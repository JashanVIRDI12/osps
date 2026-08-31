'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/cn';

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.maxLife = 70 + Math.random() * 50;
    this.life = this.maxLife;
    this.size = 1 + Math.random() * 1.8;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 1;
    this.vx *= 0.98;
    this.vy *= 0.98;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return;
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

type AetherRibbonMeshProps = {
  className?: string;
};

/**
 * Ambient canvas backdrop for the hero: trigonometric ribbon mesh in the OSPS
 * royal/teal pairing, drifting toward the cursor with a small particle burst
 * on click. Sized to its parent section rather than the viewport, so it sits
 * behind whatever content is on top of it instead of owning the page.
 *
 * A no-op under reduced motion or once scrolled off screen — the same
 * philosophy `shouldLoadLoopVideo` applies to the hero's video, just for a
 * layer that is decorative rather than informative, so here it is fine to
 * simply not render at all rather than fall back to a still frame.
 */
export function AetherRibbonMesh({ className }: AetherRibbonMeshProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(max-width: 1023px)').matches) return;

    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let onScreen = true;
    let animationFrameId = 0;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const particles: Particle[] = [];
    const ripple = { x: 0, y: 0, radius: 0, maxRadius: 360, speed: 14 };

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const pointerXY = (event: MouseEvent | TouchEvent) => {
      const point = 'touches' in event ? event.touches[0] : event;
      return point ? { x: point.clientX, y: point.clientY } : null;
    };

    const onPointerMove = (event: MouseEvent | TouchEvent) => {
      const point = pointerXY(event);
      if (!point) return;
      const rect = wrapper.getBoundingClientRect();
      mouse.targetX = point.x - rect.left - width / 2;
      mouse.targetY = point.y - rect.top - height / 2;
    };

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const point = pointerXY(event);
      if (!point) return;
      const rect = wrapper.getBoundingClientRect();
      if (
        point.x < rect.left ||
        point.x > rect.right ||
        point.y < rect.top ||
        point.y > rect.bottom
      ) {
        return;
      }

      ripple.x = point.x - rect.left;
      ripple.y = point.y - rect.top;
      ripple.radius = 0;

      for (let i = 0; i < 16; i++) {
        particles.push(new Particle(ripple.x, ripple.y, rgba(47, 98, 232, 0.7)));
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('touchstart', onPointerDown, { passive: true });

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(wrapper);

    let lastTime = performance.now();
    let time = 0;

    const noise = (x: number, t: number, o: number) =>
      (Math.sin(x * 0.0012 + t * 0.25 + o) + Math.cos(x * 0.0028 - t * 0.4 + o * 2)) / 2;

    const layers = [
      {
        ribbonCount: 14,
        step: 5,
        offsetMod: 0,
        freqScale: 0.0035,
        ampScale: 46,
        speedScale: 1.1,
        primary: true,
      },
      {
        ribbonCount: 9,
        step: 7,
        offsetMod: 1.2,
        freqScale: 0.0075,
        ampScale: 26,
        speedScale: 0.7,
        primary: false,
      },
    ];

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (!onScreen || document.visibilityState !== 'visible') {
        lastTime = now;
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += dt * 0.85;

      const lerp = 1 - Math.exp(-9 * dt);
      mouse.x += (mouse.targetX - mouse.x) * lerp;
      mouse.y += (mouse.targetY - mouse.y) * lerp;

      // Matches --color-canvas, so the animated layer reads as one surface
      // with the rest of the page rather than a framed insert.
      ctx.fillStyle = '#f7f8fc';
      ctx.fillRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.draw(ctx);
        if (particle.life <= 0) particles.splice(i, 1);
      }

      if (ripple.radius < ripple.maxRadius) ripple.radius += ripple.speed;

      layers.forEach((layer) => {
        ctx.globalCompositeOperation = layer.primary ? 'source-over' : 'multiply';

        // Royal blue -> teal -> royal blue: the light theme's two accents.
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const royalEdge = rgba(47, 98, 232, layer.primary ? 0.05 : 0.015);
        gradient.addColorStop(0, royalEdge);
        gradient.addColorStop(0.5, rgba(13, 148, 136, layer.primary ? 0.22 : 0.09));
        gradient.addColorStop(1, royalEdge);

        for (let r = 0; r < layer.ribbonCount; r++) {
          const progress = r / layer.ribbonCount;
          // Spread proportionally across the measured height rather than a
          // fixed pixel step, so the band fills a tall hero the same way it
          // fills a short one.
          const bandStart = height * 0.12;
          const bandEnd = height * 0.88;
          const yOffset =
            bandStart +
            (r / (layer.ribbonCount - 1)) * (bandEnd - bandStart) +
            layer.offsetMod * 24;
          const baseAlpha = (1 - progress * 0.7) * 0.5;

          const rippleDistort =
            ripple.radius < ripple.maxRadius
              ? Math.sin((time * 2 + progress * Math.PI) * 2) *
                ((ripple.maxRadius / Math.max(ripple.radius, 1)) * 2)
              : 0;

          ctx.beginPath();

          for (let x = 0; x <= width + layer.step; x += layer.step) {
            const edge = Math.sin((x / width) * Math.PI);
            const nFreq = 1 + noise(x, time, progress) * 0.18;
            const nAmp = 1 + noise(x * 2, -time, progress * 0.5) * 0.15;

            const wave1 =
              Math.sin(x * (layer.freqScale * nFreq) + time * layer.speedScale + r * 0.18) *
              (layer.ampScale * edge * nAmp);
            const wave2 = Math.cos(x * 0.008 - time * 0.7 + r * 0.1) * (16 * edge);

            const cursorX = width / 2 + mouse.x;
            const distX = Math.abs(x - cursorX);
            const mouseRadius = layer.primary ? 320 : 200;
            const mouseFactor = Math.exp(-((distX / mouseRadius) ** 2));
            const mouseDisplacement =
              Math.sin(x * 0.015 + time * 2.6) *
              (mouseFactor * (layer.primary ? 34 : 18) * edge);

            const rippleFactor = Math.exp(
              -((Math.abs(distX - ripple.radius) / (25 + rippleDistort)) ** 2)
            );
            const rippleDisplacement = rippleFactor * rippleDistort * (1.6 - progress);

            const y =
              yOffset +
              wave1 +
              wave2 +
              mouseDisplacement +
              rippleDisplacement +
              mouse.y * (progress * 0.08);

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          ctx.globalAlpha = baseAlpha;
          ctx.strokeStyle = gradient;
          ctx.lineWidth = (layer.primary ? 1.2 : 0.7) + (1 - progress) * 0.4;
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('touchstart', onPointerDown);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden bg-canvas',
        className
      )}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
