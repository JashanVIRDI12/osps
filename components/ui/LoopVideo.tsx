'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { shouldLoadLoopVideo } from '@/lib/media';
import {
  armSoundtrackGesture,
  setChannelVisible,
  setSoundtrackUnlocked,
  subscribeSoundtrack,
  type Channel,
} from '@/lib/soundtrack';
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
  /**
   * Homepage clips that carry their own audio. Only the active channel plays;
   * About preempts the hero as soon as it is on screen.
   */
  channel?: Channel;
};

/**
 * Muted looping clip over a still poster. Skips the file on reduced motion and
 * metered connections — the poster is the whole composition then.
 *
 * Clips with a `channel` play with sound on. If the browser blocks unmuted
 * autoplay, the next pointer or key press resumes audio; the speaker is only
 * a mute control after that.
 */
export function LoopVideo({
  src,
  poster,
  alt,
  label,
  className,
  children,
  priority = false,
  channel,
}: LoopVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const manualPauseRef = useRef(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(!channel);
  const [unlocked, setUnlocked] = useState(Boolean(channel));

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

  const onScreenRef = useRef(false);
  const activeRef = useRef(active);
  const unlockedRef = useRef(unlocked);
  const syncRef = useRef<() => void>(() => {});

  activeRef.current = active;
  unlockedRef.current = unlocked;

  useEffect(() => {
    if (!channel) return;
    return subscribeSoundtrack((snapshot) => {
      const isActive = snapshot.active === channel;
      activeRef.current = isActive;
      unlockedRef.current = snapshot.unlocked;
      setActive(isActive);
      setUnlocked(snapshot.unlocked);
      syncRef.current();
    });
  }, [channel]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoEnabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreenRef.current = entry.isIntersecting;
        if (channel) setChannelVisible(channel, entry.isIntersecting);
        syncRef.current();
      },
      { threshold: channel ? 0.35 : 0.15 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      if (channel) setChannelVisible(channel, false);
    };
  }, [videoEnabled, channel]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoEnabled) return;

    const sync = () => {
      if (manualPauseRef.current) return;

      const mayPlay =
        document.visibilityState === 'visible' &&
        (channel ? activeRef.current && onScreenRef.current : onScreenRef.current);

      if (mayPlay) {
        const wantSound = Boolean(channel) && unlockedRef.current;
        video.muted = !wantSound;
        void video.play().catch(() => {
          if (!wantSound) return;
          video.muted = true;
          void video.play().catch(() => {});
          armSoundtrackGesture();
        });
      } else {
        video.pause();
        if (channel) video.muted = true;
      }
    };

    syncRef.current = sync;
    sync();
    document.addEventListener('visibilitychange', sync);

    return () => {
      document.removeEventListener('visibilitychange', sync);
    };
  }, [videoEnabled, channel]);

  const toggleVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      manualPauseRef.current = false;
      if (channel && !active) return;
      video.muted = channel ? !unlocked : true;
      void video.play().catch(() => {});
    } else {
      manualPauseRef.current = true;
      video.pause();
    }
  }, [channel, unlocked, active]);

  const toggleSound = useCallback(() => {
    setSoundtrackUnlocked(!unlocked);
  }, [unlocked]);

  const withAudio = Boolean(channel);

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
          {...(channel ? {} : { muted: true })}
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

      {withAudio || videoEnabled ? (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
          {withAudio ? (
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={unlocked}
              className="grid h-11 w-11 place-items-center rounded-pill border border-white/25 bg-royal-deep/80 text-white/80 transition-colors hover:border-white/60 hover:text-white"
            >
              <span className="sr-only">
                {unlocked
                  ? 'Mute video soundtrack'
                  : 'Unmute video soundtrack'}
              </span>
              {unlocked ? (
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <VolumeX className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          ) : null}

          {videoEnabled ? (
            <button
              type="button"
              onClick={toggleVideo}
              aria-pressed={playing}
              className="grid h-11 w-11 place-items-center rounded-pill border border-white/25 bg-royal-deep/80 text-white/80 transition-colors hover:border-white/60 hover:text-white"
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
      ) : null}
    </div>
  );
}
