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
import { cn } from '@/lib/cn';

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === '/';
  const { details } = contact;

  const navHref = useCallback(
    (href: string) => (onHome ? href : `/${href}`),
    [onHome]
  );

  useIsomorphicLayoutEffect(() => {
    const header = headerRef.current;
    const bar = barRef.current;
    if (!header || !bar) return;

    const reduced = prefersReducedMotion();
    const duration = reduced ? 0 : 0.4;
    const condensed = {
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: 'rgba(147, 197, 253, 0.94)',
      borderColor: 'rgba(125, 211, 252, 0.85)',
    };
    const headerPad = {
      paddingTop: 'max(10px, env(safe-area-inset-top, 0px))',
      paddingBottom: 10,
    };

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

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    lockScroll();

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

  const close = useCallback(() => setOpen(false), []);

  const handleNavigate = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      close();
      if (onHome && scrollToHash(href)) event.preventDefault();
    },
    [close, onHome]
  );

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 pb-4 pt-[max(1rem,env(safe-area-inset-top,0px))] sm:pb-5"
    >
      <div className="shell relative z-50">
        <div
          ref={barRef}
          className="flex h-16 items-center justify-between gap-3 rounded-pill border border-royal-line/85 bg-royal-deep/95 px-3 py-2.5 sm:h-auto sm:gap-4 sm:px-5 sm:py-2.5"
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
                    className="inline-flex rounded-pill px-4 py-2 text-[17px] font-medium text-royal-mist transition-colors duration-200 hover:text-ink"
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
              className="relative z-50 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-white/30 bg-royal text-white transition-colors hover:bg-royal-bright lg:hidden"
            >
              <span className="sr-only">
                {open ? 'Close menu' : 'Open menu'}
              </span>
              <span aria-hidden="true" className="relative block h-[14px] w-5">
                <span
                  className={cn(
                    'absolute left-0 top-0 block h-[2px] w-full rounded-pill bg-current transition-transform duration-300 ease-smooth',
                    open && 'translate-y-[6px] rotate-45'
                  )}
                />
                <span
                  className={cn(
                    'absolute bottom-0 left-0 block h-[2px] w-full rounded-pill bg-current transition-transform duration-300 ease-smooth',
                    open && '-translate-y-[6px] -rotate-45'
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden',
          open ? 'visible' : 'invisible pointer-events-none'
        )}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Close menu"
          onClick={close}
          className={cn(
            'absolute inset-0 bg-ink/45 transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0'
          )}
        />

        <div
          ref={panelRef}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={cn(
            'overscroll-lock absolute inset-x-0 top-0 max-h-[100svh] overflow-y-auto bg-white shadow-card-hover transition-transform duration-300 ease-smooth',
            open ? 'translate-y-0' : '-translate-y-4'
          )}
        >
          <nav
            aria-label="Mobile"
            className="gutter-x mx-auto flex w-full max-w-shell flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[calc(6.25rem+env(safe-area-inset-top))]"
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={navHref(link.href)}
                    onClick={(event) => handleNavigate(event, link.href)}
                    className="flex min-h-[56px] items-center justify-between gap-4 border-b border-line py-3 text-[1.35rem] font-semibold tracking-[-0.03em] text-ink transition-colors active:text-royal"
                  >
                    {link.label}
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-royal"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={navHref('#contact')}
              onClick={(event) => handleNavigate(event, '#contact')}
              className="btn-accent mt-7 w-full px-6 py-3.5"
            >
              Request a Quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <ul className="mt-7 flex flex-col gap-2 border-t border-line pt-6">
              <li>
                <a
                  href={details.phoneHref}
                  className="flex min-h-[44px] items-center gap-3 text-body-sm font-medium text-ink-muted transition-colors active:text-ink"
                >
                  <Phone
                    className="h-4 w-4 shrink-0 text-royal"
                    aria-hidden="true"
                  />
                  {details.phone}
                </a>
              </li>
              <li>
                <a
                  href={details.emailHref}
                  className="flex min-h-[44px] items-center gap-3 text-body-sm font-medium text-ink-muted transition-colors active:text-ink"
                >
                  <Mail
                    className="h-4 w-4 shrink-0 text-royal"
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
    </header>
  );
}
