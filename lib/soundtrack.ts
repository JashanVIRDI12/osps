/**
 * Exclusive soundtrack for the two homepage clips (hero four-hour delivery,
 * about dispatch). Only one plays at a time: About wins as soon as it is on screen,
 * and the hero resumes when About leaves.
 *
 * Sound is on by default. Browsers often still block unmuted autoplay until a
 * gesture, so a failed play() arms a one-shot pointer/key listener that resumes
 * with audio without requiring the speaker button. The speaker remains the
 * mute control (WCAG 1.4.2).
 */

type Channel = 'hero' | 'about';

type Snapshot = {
  active: Channel | null;
  unlocked: boolean;
};

const listeners = new Set<(snapshot: Snapshot) => void>();

let heroVisible = false;
let aboutVisible = false;
let unlocked = true;
let gestureArmed = false;

function snapshot(): Snapshot {
  return {
    active: aboutVisible ? 'about' : heroVisible ? 'hero' : null,
    unlocked,
  };
}

function emit() {
  const next = snapshot();
  listeners.forEach((listener) => listener(next));
}

export function subscribeSoundtrack(listener: (snapshot: Snapshot) => void) {
  listeners.add(listener);
  listener(snapshot());
  return () => {
    listeners.delete(listener);
  };
}

export function setChannelVisible(channel: Channel, visible: boolean) {
  if (channel === 'hero') heroVisible = visible;
  else aboutVisible = visible;
  emit();
}

export function setSoundtrackUnlocked(value: boolean) {
  unlocked = value;
  emit();
}

/**
 * After unmuted autoplay is rejected, wait for the next real user gesture and
 * re-emit so the active clip can play with sound.
 */
export function armSoundtrackGesture() {
  if (gestureArmed || !unlocked) return;
  gestureArmed = true;

  const resume = () => {
    gestureArmed = false;
    if (!unlocked) return;
    emit();
  };

  window.addEventListener('pointerdown', resume, { once: true, capture: true });
  window.addEventListener('keydown', resume, { once: true, capture: true });
}

export type { Channel };
