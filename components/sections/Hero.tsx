'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Pause, Play } from 'lucide-react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import { shouldLoadLoopVideo } from '@/lib/media';
import { scrollToHash } from '@/lib/scroll';
import { hero, site } from '@/lib/content';
import { RotatingWord } from '@/components/ui/RotatingWord';

const HERO_WORDS = ['depend', 'rely', 'trust', 'count'];

/**
 * Full-screen video hero: warehouse footage under two scrims, copy centred on
 * top. One viewport, no scroll choreography — the section is `min-height` so it
 * grows rather than overflows when the copy needs more room than the screen.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const manualPauseRef = useRef(false);

  /** Mounts the video element. False on the server and on first paint. */
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);

  /**
   * Entrance only. This is a one-shot stagger on load, not a scroll-linked
   * tween, so it cannot leave anything stranded part-way through.
   */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-reveal]',
        { opacity: 0, y: reduced ? 0 : 26 },
        {
          opacity: 1,
          y: 0,
          duration: reduced ? 0.5 : 0.95,
          ease: 'power3.out',
          stagger: reduced ? 0.04 : 0.08,
          delay: 0.15,
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  /**
   * The video is deliberately kept out of the first render and out of the load
   * event. The still is the LCP element and is preloaded; letting a 3.9MB file
   * compete with it for bandwidth is the fastest way to lose the metric on a
   * phone. Waiting for `load` means the footage arrives after everything that
   * is actually measured has settled.
   */
  useEffect(() => {
    if (!shouldLoadLoopVideo()) return;

    if (document.readyState === 'complete') {
      setVideoEnabled(true);
      return;
    }

    const onLoad = () => setVideoEnabled(true);
    window.addEventListener('load', onLoad, { once: true });
    return () => window.removeEventListener('load', onLoad);
  }, []);

  /**
   * Playback follows the hero. Once the section has scrolled away the footage is
   * completely hidden behind the rest of the page, and decoding frames nobody
   * can see is the kind of thing that keeps a phone warm for no reason.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoEnabled) return;

    let onScreen = true;

    const sync = () => {
      // A deliberate pause outranks the observer: scrolling the hero back into
      // view must not restart something the visitor just stopped.
      if (manualPauseRef.current) return;

      if (onScreen && document.visibilityState === 'visible') {
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 }
    );

    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [videoEnabled]);

  const toggleVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      manualPauseRef.current = false;
      void video.play().catch(() => {});
    } else {
      manualPauseRef.current = true;
      video.pause();
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label={`${site.name}: introduction`}
      className="hero-shell section-invert on-invert relative isolate flex w-full items-center overflow-hidden"
    >
      {/* Backdrop. `isolate` on the section plus `-z-10` here keeps the whole
          media stack behind the copy without any of it escaping into the rest
          of the page's z-order. */}
      <div
        className="absolute inset-0 -z-10"
        role="img"
        aria-label={hero.backdrop.alt}
      >
        <div
          aria-hidden="true"
          className="hero-media absolute inset-0"
          style={{ backgroundImage: `url(${hero.backdrop.src})` }}
        />

        {videoEnabled ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-smooth data-[ready=true]:opacity-100"
            src={hero.backdrop.video}
            poster={hero.backdrop.src}
            muted
            loop
            playsInline
            /* `metadata`, not `auto`: playback starts the fetch anyway, and the
               stronger hint makes the browser buffer far ahead of the frame it
               needs — on a 3G phone that bandwidth is taken from the images the
               visitor is about to scroll into. */
            preload="metadata"
            disablePictureInPicture
            aria-hidden="true"
            /* Fades in on its first painted frame rather than on mount, so the
               cut from still to footage is never a flash of black. */
            onLoadedData={(event) => {
              event.currentTarget.dataset.ready = 'true';
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        ) : null}

        {/**
         * One scrim, not two.
         *
         * The first used to be `mix-blend-multiply`, which pulled the footage
         * into the brand blue — but a blend mode over a full-viewport, actively
         * decoding video is the most expensive composite on the page: the
         * browser cannot keep the layers independent, so every frame of the
         * hero forces the whole stack to be re-blended, and it does so while
         * the visitor is scrolling past it.
         *
         * A flat royal fill under the existing gradient reaches the same
         * colour and the same contrast floor with a plain opaque paint.
         */}
        <div aria-hidden="true" className="absolute inset-0 bg-royal-deep/55" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-royal-deep via-royal-deep/45 to-royal-deep/65"
        />
      </div>

      {/* The vertical rhythm tightens as the viewport gets shorter, because the
          composition has to live inside one 100svh screen — on a 667px-tall
          phone the desktop spacing alone would push the CTAs past the fold. */}
      <div className="shell flex flex-col items-center pb-14 pt-24 text-center sm:pb-20 sm:pt-28">
        <p className="heading-kicker heading-kicker-invert" data-hero-reveal>
          {hero.eyebrow}
        </p>

        <h1
          className="heading-display mt-2 max-w-4xl text-white"
          data-hero-reveal
        >
          Healthcare supplies you can{' '}
          <RotatingWord words={HERO_WORDS} intervalMs={3000} /> on.
        </h1>

        <p
          className="mt-5 max-w-xl text-pretty text-[0.95rem] leading-[1.55] text-royal-mist xs:text-body sm:mt-6 sm:text-subheading"
          data-hero-reveal
        >
          Pharmaceuticals, surgical consumables, medical devices and hospital
          essentials, sourced from certified manufacturers and delivered on the
          day we commit to.
        </p>

        {/* Full-width and stacked on a phone: at 320–414px the two labels never
            fit on one line anyway, so a centred pair of part-width pills just
            reads as ragged. */}
        <div
          className="mt-7 flex w-full max-w-xs flex-col items-stretch gap-3 sm:mt-8 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
          data-hero-reveal
        >
          <a
            href={hero.primaryCta.href}
            onClick={(event) => {
              if (scrollToHash(hero.primaryCta.href)) event.preventDefault();
            }}
            className="btn-accent px-6 py-3.5"
          >
            {hero.primaryCta.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={hero.secondaryCta.href}
            onClick={(event) => {
              if (scrollToHash(hero.secondaryCta.href)) event.preventDefault();
            }}
            className="btn-ghost px-6 py-3.5"
          >
            {hero.secondaryCta.label}
          </a>
        </div>

        {/* Decorative affordance, and the first thing to give up when the
            viewport is too short to hold the composition. */}
        <p
          className="mt-8 hidden items-center gap-2 text-caption font-medium uppercase tracking-[0.16em] text-royal-mist [@media(min-height:700px)]:inline-flex sm:mt-12"
          data-hero-reveal
        >
          <ArrowDown className="h-3.5 w-3.5 animate-float" aria-hidden="true" />
          Scroll to explore
        </p>
      </div>

      {/* WCAG 2.2.2 — a backdrop that loops indefinitely needs a way to stop it.
          Sits outside the `role="img"` backdrop so it stays a real control. */}
      {videoEnabled ? (
        <button
          type="button"
          onClick={toggleVideo}
          aria-pressed={playing}
          className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-10 grid h-11 w-11 place-items-center rounded-pill border border-white/25 bg-royal-deep/80 text-white/80 transition-colors hover:border-white/60 hover:text-white lg:bg-royal-deep/40 lg:backdrop-blur-md sm:bottom-6 sm:right-6"
        >
          <span className="sr-only">
            {playing
              ? `Pause background video: ${hero.backdrop.videoLabel}`
              : `Play background video: ${hero.backdrop.videoLabel}`}
          </span>
          {playing ? (
            <Pause className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4 translate-x-px" aria-hidden="true" />
          )}
        </button>
      ) : null}
    </section>
  );
}
