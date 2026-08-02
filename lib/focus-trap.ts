'use client';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function focusableWithin(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE)
  ).filter(
    (element) =>
      // `visibility: hidden` (how the drawer parks itself between opens) and
      // `display: none` both take an element out of the tab order, so they must
      // come out of the cycle too or Tab lands on something invisible.
      element.offsetWidth > 0 ||
      element.offsetHeight > 0 ||
      element === document.activeElement
  );
}

/**
 * Confines Tab / Shift+Tab to `container` and restores focus to whatever was
 * focused before, so keyboard users cannot walk out of an open overlay into the
 * page behind it.
 *
 * Returns the teardown. Call it when the overlay closes.
 */
export function trapFocus(container: HTMLElement, moveFocus = true) {
  const previouslyFocused = document.activeElement as HTMLElement | null;

  if (moveFocus) {
    const [first] = focusableWithin(container);
    (first ?? container).focus({ preventScroll: true });
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const items = focusableWithin(container);
    if (!items.length) {
      event.preventDefault();
      return;
    }

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    /**
     * Focus can legitimately be outside the container when the trap starts —
     * the drawer is still fading in on the frame the trap is installed, and a
     * `visibility: hidden` element cannot take focus, so the caller's button
     * keeps it. Pulling focus in on the first Tab covers that window without
     * depending on animation timing.
     */
    if (!container.contains(active)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
      return;
    }

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener('keydown', onKeyDown, true);

  return () => {
    document.removeEventListener('keydown', onKeyDown, true);
    previouslyFocused?.focus?.({ preventScroll: true });
  };
}
