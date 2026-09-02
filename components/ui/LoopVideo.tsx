'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { shouldLoadLoopVideo } from '@/lib/media';
import {
  reportSoundtrackBlocked,
  setChannelVisible,
  setSoundtrackWanted,
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
   * Homepage clips that carry a soundtrack. Only the active channel is
   * audible; About preempts the hero as soon as it is on screen.
   */
  channel?: Channel;
  /**
   * The channel's soundtrack or audio source file.
   */
  audioSrc?: string;
};

/** How far the soundtrack may drift from the picture before it is nudged. */
const DRIFT_TOLERANCE = 0.35;

const fades = new WeakMap<HTMLAudioElement, number>();

/** Short ramp, so sound arriving on a click is not a slam. */
function fadeAudio(
  audio: HTMLAudioElement,
  target: number,
  ms: number,
  onDone?: () => void
) {
  const running = fades.get(audio);
  if (running) cancelAnimationFrame(running);

  const from = audio.volume;
  const delta = target - from;

  if (Math.abs(delta) < 0.01) {
    audio.volume = target;
    onDone?.();
    return;
  }

  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    audio.volume = Math.min(1, Math.max(0, from + delta * t));
    if (t < 1) {
      fades.set(audio, requestAnimationFrame(step));
    } else {
      fades.delete(audio);
      onDone?.();
    }
  };

  fades.set(audio, requestAnimationFrame(step));
}

/** Pull the soundtrack back onto the picture's clock. */
function alignAudio(
  audio: HTMLAudioElement,
  video: HTMLVideoElement,
  force = false
) {
  const span = audio.duration;
  if (!Number.isFinite(span) || span <= 0) return;

  const target = video.currentTime % span;
  if (force || Math.abs(audio.currentTime - target) > DRIFT_TOLERANCE) {
    audio.currentTime = target;
  }
}

/**
 * Looping video clip over a still poster, unmuted by default when active.
 * Skips the file on reduced motion and metered connections — the poster is
 * the whole composition then.
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
  audioSrc,
}: LoopVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const manualPauseRef = useRef(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(!channel);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    if (!shouldLoadLoopVideo()) return;
    setVideoEnabled(true);
  }, []);

  const onScreenRef = useRef(false);
  const activeRef = useRef(active);
  const soundOnRef = useRef(soundOn);
  const syncRef = useRef<() => void>(() => {});

  activeRef.current = active;

  useEffect(() => {
    if (!channel) return;
    return subscribeSoundtrack((snapshot) => {
      const isActive = snapshot.active === channel;
      // Both halves matter: `wanted` is the visitor's choice, `unlocked` is
      // whether the browser is currently letting audio through.
      const audible = snapshot.wanted && snapshot.unlocked;

      activeRef.current = isActive;
      soundOnRef.current = audible;
      setActive(isActive);
      setSoundOn(audible);

      // Synchronous on purpose: when this runs from a gesture handler, the
      // play() inside sync() is still inside that gesture.
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
      const audio = audioRef.current;

      const onAir =
        document.visibilityState === 'visible' &&
        !manualPauseRef.current &&
        (channel
          ? activeRef.current && onScreenRef.current
          : onScreenRef.current);

      const wantSound = Boolean(channel) && soundOnRef.current;

      video.muted = !wantSound;

      if (onAir) {
        void video.play().catch(() => {
          if (video.muted) return;
          // Unmuted playback refused by browser autoplay policy — temporarily mute
          // to maintain smooth visual playback, and allow gesture to unmute.
          video.muted = true;
          reportSoundtrackBlocked();
          void video.play().catch(() => {});
        });
      } else {
        video.pause();
      }

      if (!audio) return;

      if (onAir && wantSound) {
        // If video itself is unmuted and active, keep separate audio track silent
        if (!video.muted) {
          if (!audio.paused) audio.pause();
          return;
        }

        if (audio.paused) {
          alignAudio(audio, video, true);
          audio.volume = 0;
          void audio
            .play()
            .then(() => fadeAudio(audio, 1, 450))
            .catch(() => reportSoundtrackBlocked());
        } else if (audio.volume < 1) {
          fadeAudio(audio, 1, 450);
        }
      } else if (!audio.paused) {
        fadeAudio(audio, 0, 220, () => {
          if (audio.volume === 0) audio.pause();
        });
      }
    };

    const correctDrift = () => {
      const audio = audioRef.current;
      if (!audio || audio.paused) return;
      alignAudio(audio, video);
    };

    const audio = audioRef.current;

    syncRef.current = sync;
    sync();

    document.addEventListener('visibilitychange', sync);
    video.addEventListener('timeupdate', correctDrift);

    return () => {
      document.removeEventListener('visibilitychange', sync);
      video.removeEventListener('timeupdate', correctDrift);
      audio?.pause();
    };
  }, [videoEnabled, channel]);

  const toggleVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    manualPauseRef.current = !video.paused;
    syncRef.current();
  }, []);

  const toggleSound = useCallback(() => {
    setSoundtrackWanted(!soundOn);
  }, [soundOn]);

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
          muted={!soundOn}
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

      {videoEnabled && channel && audioSrc ? (
        <audio
          ref={audioRef}
          src={audioSrc}
          loop
          preload="auto"
          onCanPlay={() => syncRef.current()}
        />
      ) : null}

      {children}

      {withAudio || videoEnabled ? (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
          {withAudio ? (
            <button
              type="button"
              data-soundtrack-toggle
              onClick={toggleSound}
              aria-pressed={soundOn}
              className="grid h-11 w-11 place-items-center rounded-pill border border-white/25 bg-royal-deep/80 text-white/80 transition-colors hover:border-white/60 hover:text-white"
            >
              <span className="sr-only">
                {soundOn ? 'Mute video soundtrack' : 'Unmute video soundtrack'}
              </span>
              {soundOn ? (
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
