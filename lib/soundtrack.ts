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

/**
 * Everything a browser actually counts as a user gesture. Scrolling is not on
 * the list — neither `scroll` nor `wheel` grants user activation in Chrome or
 * Safari, so they can never unlock audio, and with Lenis driving smooth scroll
 * they fire every frame: all cost, no unlock.
 */
const GESTURE_EVENTS = [
  'pointerdown',
  'touchstart',
  'mousedown',
  'click',
  'keydown',
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
  // Already running: nothing to retry, and this fires on every click on the
  // page, so it has to stay a single boolean read.
  if (unlocked) return;

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
 * The browser refused audio before a gesture — the common case on a cold
 * visit. `wanted` is untouched, so the visitor's preference survives; only
 * `unlocked` drops, which re-arms `onGesture` and lets the speaker icon tell
 * the truth. Without this the icon would read "sound on" over a silent page,
 * and the first press of it would mute rather than unmute.
 */
export function reportSoundtrackBlocked() {
  if (!unlocked) return;
  unlocked = false;
  emit();
}

export type { Channel, Snapshot };
