'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { shouldLoadLoopVideo } from '@/lib/media';
import { cn } from '@/lib/cn';

type LoopVideoProps = {
  src: string;
  poster: string;
  alt: string;
  label: string;
  className?: string;
  children?: ReactNode;
  /** Marks the poster as the LCP candidate — only ever one per page. */
  priority?: boolean;
};

/**
 * Muted looping clip over a still poster. Skips the file on phones, reduced
 * motion, and metered connections — the poster is the whole composition then.
 */
export function LoopVideo({
  src,
  poster,
  alt,
  label,
  className,
  children,
  priority = false,
}: LoopVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const manualPauseRef = useRef(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoEnabled) return;

    let onScreen = true;

    const sync = () => {
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
      { threshold: 0.15 }
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
    <div className={cn('relative overflow-hidden bg-royal-deep', className)}>
      <Image
        src={poster}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 42vw"
        className="object-cover"
        priority={priority}
      />

      {videoEnabled ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-smooth data-[ready=true]:opacity-100"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-hidden="true"
          onLoadedData={(event) => {
            event.currentTarget.dataset.ready = 'true';
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      ) : null}

      {children}

      {videoEnabled ? (
        <button
          type="button"
          onClick={toggleVideo}
          aria-pressed={playing}
          className="absolute bottom-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-pill border border-white/25 bg-royal-deep/80 text-white/80 transition-colors hover:border-white/60 hover:text-white"
        >
          <span className="sr-only">
            {playing
              ? `Pause background video: ${label}`
              : `Play background video: ${label}`}
          </span>
          {playing ? (
            <Pause className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4 translate-x-px" aria-hidden="true" />
          )}
        </button>
      ) : null}
    </div>
  );
}
