'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import { navLinks, site, footer, contact } from '@/lib/content';
import { scrollToHash } from '@/lib/scroll';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const year = new Date().getFullYear();
  const { details } = contact;

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (scrollToHash(href)) event.preventDefault();
  };

  return (
    <footer className="section-invert on-invert bg-royal-deep">
      {/* Last element on the page, so it owns the bottom safe area — without
          this the copyright line sits under the iOS home indicator. */}
      <div className="shell py-14 pb-[max(3.5rem,calc(3.5rem+env(safe-area-inset-bottom)))] sm:py-16 sm:pb-[max(4rem,calc(4rem+env(safe-area-inset-bottom)))]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            <Logo tone="light" variant="stacked" />
            <p className="max-w-sm text-pretty text-body-sm leading-relaxed text-royal-mist">
              {footer.blurb}
            </p>

            <ul className="mt-1 flex items-center gap-2.5">
              {footer.socials.map((social) => {
                const Icon = social.icon;
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="grid h-11 w-11 place-items-center rounded-pill border border-royal-line bg-royal-shade/60 text-royal-mist transition-colors hover:border-white hover:text-white sm:h-10 sm:w-10"
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      <span className="sr-only">
                        {`${site.shortName} on ${social.label}`}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-caption font-medium uppercase tracking-[0.14em] text-royal-mist">
              Explore
            </h2>
            {/* A 20px-tall inline link is a miss on a phone. The links take
                their spacing from their own height below `sm` so each one is a
                44px target, and revert to the tighter desktop rhythm above it. */}
            <ul className="mt-3 flex flex-col gap-0 sm:mt-4 sm:gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => handleNavigate(event, link.href)}
                    className="inline-flex min-h-[44px] items-center text-body-sm text-royal-mist underline-offset-4 transition-colors hover:text-white hover:underline sm:min-h-0"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-caption font-medium uppercase tracking-[0.14em] text-royal-mist">
              Get in touch
            </h2>
            <ul className="mt-4 flex flex-col gap-4 text-body-sm text-royal-mist">
              <li className="flex gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent-soft"
                  aria-hidden="true"
                />
                <address className="not-italic leading-relaxed">
                  {details.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex gap-3">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent-soft"
                  aria-hidden="true"
                />
                <a
                  href={details.phoneHref}
                  className="inline-flex min-h-[44px] items-center underline-offset-4 transition-colors hover:text-white hover:underline sm:min-h-0"
                >
                  {details.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent-soft"
                  aria-hidden="true"
                />
                <a
                  href={details.emailHref}
                  className="inline-flex min-h-[44px] items-center [overflow-wrap:anywhere] underline-offset-4 transition-colors hover:text-white hover:underline sm:min-h-0"
                >
                  {details.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-royal-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-royal-mist/75">
            {`© ${year} ${site.name}. All rights reserved.`}
          </p>
          <p className="text-[13px] text-royal-mist/75">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
