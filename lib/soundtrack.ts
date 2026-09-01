/**
 * Soundtrack and video audio for homepage clips (hero four-hour delivery, about
 * dispatch).
 *
 * Videos and their soundtracks are unmuted and active by default on load.
 * Only one channel is audible at a time: About wins as soon as it is on
 * screen, and the hero takes over again when About leaves. The speaker button
 * is the mute control (WCAG 1.4.2) and its setting survives a reload.
 */

type Channel = 'hero' | 'about';

type Snapshot = {
  /** The clip currently entitled to the soundtrack. */
  active: Channel | null;
  /** The visitor has not muted the speaker. */
  wanted: boolean;
  /** A gesture has landed or audio is unlocked, so the browser will let audio play. */
  unlocked: boolean;
};

const STORAGE_KEY = 'osps:soundtrack';

/** Everything a browser is willing to count as a user gesture or interaction. */
const GESTURE_EVENTS = [
  'pointerdown',
  'touchstart',
  'mousedown',
  'click',
  'keydown',
  'scroll',
  'wheel',
] as const;

const listeners = new Set<(snapshot: Snapshot) => void>();

let heroVisible = false;
let aboutVisible = false;
let wanted = true;
let unlocked = true;
let armed = false;

function snapshot(): Snapshot {
  return {
    active: aboutVisible ? 'about' : heroVisible ? 'hero' : null,
    wanted,
    unlocked,
  };
}

function emit() {
  const next = snapshot();
  listeners.forEach((listener) => listener(next));
}

function readPreference() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'muted';
  } catch {
    return true;
  }
}

function writePreference(value: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? 'on' : 'muted');
  } catch {
    /* private mode — the session default stands */
  }
}

/**
 * Handle user interactions to unlock audio playback if autoplay was restricted
 * by the browser before user interaction.
 */
function onGesture(event: Event) {
  const target = event.target;
  if (target instanceof Element && target.closest('[data-soundtrack-toggle]')) {
    return;
  }

  unlocked = true;
  emit();
}

function arm() {
  if (armed || typeof window === 'undefined') return;
  armed = true;
  wanted = readPreference();
  unlocked = true;

  GESTURE_EVENTS.forEach((type) =>
    window.addEventListener(type, onGesture, { capture: true, passive: true })
  );
}

export function subscribeSoundtrack(listener: (snapshot: Snapshot) => void) {
  arm();
  listeners.add(listener);
  listener(snapshot());
  return () => {
    listeners.delete(listener);
  };
}

export function setChannelVisible(channel: Channel, visible: boolean) {
  if (channel === 'hero') {
    if (heroVisible === visible) return;
    heroVisible = visible;
  } else {
    if (aboutVisible === visible) return;
    aboutVisible = visible;
  }
  emit();
}

/** The speaker button. Toggles soundtrack wanted preference. */
export function setSoundtrackWanted(value: boolean) {
  wanted = value;
  if (value) unlocked = true;
  writePreference(value);
  emit();
}

/**
 * The browser refused unprompted audio autoplay on load.
 * Keep listening for interactions to start audio as soon as the user interacts.
 */
export function reportSoundtrackBlocked() {
  // Keep wanted preference and keep gesture listeners armed.
}

export type { Channel, Snapshot };
