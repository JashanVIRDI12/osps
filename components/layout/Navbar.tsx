'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { scrollToHash } from '@/lib/scroll';
import { lockScroll, unlockScroll } from '@/lib/scroll-lock';
import { trapFocus } from '@/lib/focus-trap';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import { contact, navLinks } from '@/lib/content';
import { Logo } from '@/components/ui/Logo';

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLSpanElement>(null);
  const bottomBarRef = useRef<HTMLSpanElement>(null);
  const drawerRef = useRef<gsap.core.Timeline | null>(null);

  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === '/';
  const { details } = contact;

  const navHref = useCallback(
    (href: string) => (onHome ? href : `/${href}`),
    [onHome]
  );

  /* ------------------------------------------------------- condensing bar */

  useIsomorphicLayoutEffect(() => {
    const header = headerRef.current;
    const bar = barRef.current;
    if (!header || !bar) return;

    const reduced = prefersReducedMotion();
    const duration = reduced ? 0 : 0.4;
    const condensed = {
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: 'rgba(16, 36, 99, 0.94)',
      borderColor: 'rgba(44, 74, 174, 0.85)',
    };
    const headerPad = {
      paddingTop: 'max(10px, env(safe-area-inset-top, 0px))',
      paddingBottom: 10,
    };

    // Interior pages have a light canvas, so the bar stays solid from the start.
    if (!onHome) {
      gsap.set(header, headerPad);
      gsap.set(bar, condensed);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline({ paused: true, defaults: { duration, ease: 'power2.out' } })
        .to(header, headerPad, 0)
        .to(bar, condensed, 0);

      ScrollTrigger.create({
        trigger: document.body,
        start: 'top -40',
        end: 'max',
        onEnter: () => tl.play(),
        onLeaveBack: () => tl.reverse(),
      });
    }, header);

    return () => ctx.revert();
  }, [onHome]);

  /* ------------------------------------------------------- drawer timeline */

  /**
   * One paused timeline, built once and replayed — so opening the drawer costs
   * a `play()` rather than a fresh tween construction, and closing can be made
   * instant by seeking it to 0.
   *
   * Everything animated here is `opacity` / `transform` only, which keeps the
   * whole sequence on the compositor. The panel travels 16px, not a screen
   * height: a long slide is the thing that reads as lag on a phone.
   */
  useIsomorphicLayoutEffect(() => {
    const scrim = scrimRef.current;
    const panel = panelRef.current;
    const topBar = topBarRef.current;
    const bottomBar = bottomBarRef.current;
    if (!scrim || !panel || !topBar || !bottomBar) return;

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.set([scrim, panel], { autoAlpha: 0 });
      gsap.set([topBar, bottomBar], { y: 0, rotate: 0 });

      const tl = gsap
        .timeline({ paused: true, defaults: { ease: 'power3.out' } })
        .to(scrim, { autoAlpha: 1, duration: reduced ? 0.001 : 0.28 }, 0)
        .fromTo(
          panel,
          { autoAlpha: 0, y: reduced ? 0 : -16 },
          { autoAlpha: 1, y: 0, duration: reduced ? 0.001 : 0.42 },
          0
        )
        .fromTo(
          '[data-nav-item]',
          { opacity: 0, y: reduced ? 0 : 12 },
          {
            opacity: 1,
            y: 0,
            duration: reduced ? 0.001 : 0.38,
            stagger: reduced ? 0 : 0.045,
          },
          reduced ? 0 : 0.1
        )
        // The bars close into an X on the same clock, so the button always
        // reflects the drawer's real state — including on an instant close.
        .to(
          topBar,
          { y: 6, rotate: 45, duration: reduced ? 0.001 : 0.34 },
          0
        )
        .to(
          bottomBar,
          { y: -6, rotate: -45, duration: reduced ? 0.001 : 0.34 },
          0
        );

      drawerRef.current = tl;
    }, panel);

    return () => {
      drawerRef.current = null;
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const tl = drawerRef.current;
    if (!tl) return;

    if (open) {
      tl.timeScale(1).play();
    } else {
      // Closing runs faster than opening — a drawer that lingers on the way out
      // is what makes a mobile menu feel heavy.
      tl.timeScale(1.5).reverse();
    }
  }, [open]);

  /* ------------------------------------------- scroll lock + focus + escape */

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    lockScroll();

    /**
     * Deferred by a frame: the panel is parked at `visibility: hidden` between
     * opens and only becomes focusable once the timeline's first tick lands, so
     * focusing it synchronously here would silently do nothing and leave the
     * visitor's focus on the toggle button.
     */
    let releaseFocus: (() => void) | undefined;
    const frame = requestAnimationFrame(() => {
      if (panel) releaseFocus = trapFocus(panel);
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKeyDown);
      releaseFocus?.();
      unlockScroll();
    };
  }, [open]);

  /**
   * Closing the drawer at the same moment we start scrolling means the reverse
   * tween would still be painting over the section the visitor asked for, so
   * navigation seeks the timeline to 0 instead of playing it backwards.
   */
  const closeInstantly = useCallback(() => {
    drawerRef.current?.pause(0);
    setOpen(false);
  }, []);

  const handleNavigate = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (open) closeInstantly();
      if (onHome && scrollToHash(href)) event.preventDefault();
    },
    [open, closeInstantly, onHome]
  );

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 pb-4 pt-[max(1rem,env(safe-area-inset-top,0px))] sm:pb-5"
    >
      {/* ------------------------------------------------------ mobile drawer
          Declared before the bar so it paints underneath it: the logo and the
          close button stay legible on top of the blur, with no z-index tricks
          and no second stacking context to reason about. */}
      <div className="pointer-events-none fixed inset-0 lg:hidden">
        <div
          ref={scrimRef}
          aria-hidden="true"
          onClick={() => setOpen(false)}
          style={{ visibility: 'hidden', opacity: 0 }}
          /* Near-opaque instead of blurred: a `blur(24px)` backdrop-filter over
             the full viewport is the most expensive layer the drawer can open,
             and it opens on exactly the devices least able to pay for it. */
          className="pointer-events-auto absolute inset-0 bg-royal-deep/95 lg:bg-royal-deep/70 lg:backdrop-blur-xl"
        />

        <div
          ref={panelRef}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          style={{ visibility: 'hidden', opacity: 0 }}
          className="overscroll-lock pointer-events-auto absolute inset-x-0 top-0 max-h-[100svh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))]"
        >
          <div className="gutter-x mx-auto w-full max-w-shell">
            <nav aria-label="Mobile" className="flex flex-col">
              <ul className="flex flex-col">
                {navLinks.map((link) => (
                  <li key={link.href} data-nav-item>
                    <a
                      href={navHref(link.href)}
                      onClick={(event) => handleNavigate(event, link.href)}
                      className="flex min-h-[56px] items-center justify-between gap-4 border-b border-royal-line/70 py-3 text-[1.35rem] font-semibold tracking-[-0.03em] text-white/90 transition-colors active:text-white"
                    >
                      {link.label}
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-royal-mist"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>

              <div data-nav-item className="mt-7">
                <a
                  href={navHref('#contact')}
                  onClick={(event) => handleNavigate(event, '#contact')}
                  className="btn-accent w-full px-6 py-3.5"
                >
                  Request a Quote
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              <ul
                data-nav-item
                className="mt-7 flex flex-col gap-2 border-t border-royal-line/70 pt-6"
              >
                <li>
                  <a
                    href={details.phoneHref}
                    className="flex min-h-[44px] items-center gap-3 text-body-sm font-medium text-royal-mist transition-colors active:text-white"
                  >
                    <Phone
                      className="h-4 w-4 shrink-0 text-accent-soft"
                      aria-hidden="true"
                    />
                    {details.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={details.emailHref}
                    className="flex min-h-[44px] items-center gap-3 text-body-sm font-medium text-royal-mist transition-colors active:text-white"
                  >
                    <Mail
                      className="h-4 w-4 shrink-0 text-accent-soft"
                      aria-hidden="true"
                    />
                    <span className="[overflow-wrap:anywhere]">
                      {details.email}
                    </span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="shell">
        <div
          ref={barRef}
          className={
            onHome
              ? 'flex h-16 items-center justify-between gap-3 rounded-pill border border-transparent bg-transparent px-3 py-2 sm:h-20 sm:gap-4 sm:px-5'
              : 'flex h-16 items-center justify-between gap-3 rounded-pill border border-royal-line/85 bg-royal-deep/95 px-3 py-2.5 sm:h-auto sm:gap-4 sm:px-5 sm:py-2.5'
          }
        >
          <a
            href={onHome ? '#top' : '/'}
            onClick={(event) => {
              if (onHome) handleNavigate(event, '#top');
            }}
            className="min-w-0 shrink rounded-pill focus-visible:ring-offset-4"
            aria-label="Om Sai Pharma & Surgicals, back to top"
          >
            <Logo tone="light" />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={navHref(link.href)}
                    onClick={(event) => handleNavigate(event, link.href)}
                    className="inline-flex rounded-pill px-4 py-2 text-[17px] font-medium text-royal-mist transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={navHref('#contact')}
              onClick={(event) => handleNavigate(event, '#contact')}
              className="btn-accent hidden px-5 py-2.5 sm:inline-flex"
            >
              Request a Quote
            </a>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-haspopup="dialog"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-white/30 bg-white/10 text-white transition-colors hover:border-white lg:hidden"
            >
              <span className="sr-only">
                {open ? 'Close menu' : 'Open menu'}
              </span>
              {/* Two bars that fold into an X — driven by the drawer timeline. */}
              <span
                aria-hidden="true"
                className="relative block h-[14px] w-5"
              >
                <span
                  ref={topBarRef}
                  className="absolute left-0 top-0 block h-[2px] w-full rounded-pill bg-current"
                />
                <span
                  ref={bottomBarRef}
                  className="absolute bottom-0 left-0 block h-[2px] w-full rounded-pill bg-current"
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
