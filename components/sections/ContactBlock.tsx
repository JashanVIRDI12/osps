'use client';

import dynamic from 'next/dynamic';
import { useReveal } from '@/lib/motion';
import { contact, contactIcons, site } from '@/lib/content';

/**
 * react-hook-form + zod + the resolver is ~25KB of the first load for a form at
 * the very bottom of the page. Splitting it moves that off the critical path.
 * `ssr` stays on (the default) so the fields are still in the server HTML —
 * this is the conversion point of the site and it must be crawlable, and it must
 * render for a visitor whose JavaScript has not arrived yet.
 */
const QuoteForm = dynamic(() =>
  import('@/components/sections/QuoteForm').then((mod) => mod.QuoteForm)
);

const { MapPin, Phone, Mail, Clock } = contactIcons;

export function ContactBlock() {
  const ref = useReveal<HTMLElement>({ stagger: 0.07 });
  const { details } = contact;

  return (
    <section
      ref={ref}
      id="contact"
      className="section-invert on-invert relative py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <div className="max-w-3xl">
          <h2 className="heading-section heading-section-invert max-w-none" data-reveal>
            <span className="heading-kicker">Request a quote</span>
            {contact.heading}
          </h2>
          <p
            className="mt-6 max-w-2xl text-pretty text-body text-royal-mist"
            data-reveal
          >
            {contact.lead}
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-8">
          <div className="flex flex-col gap-4">
            <div className="card-invert flex gap-4 p-5 xs:p-6" data-reveal>
              <span className="icon-well h-11 w-11 shrink-0">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-caption font-medium uppercase tracking-[0.14em] text-royal-mist">
                  Visit
                </h3>
                <address className="mt-2 not-italic text-body-sm leading-relaxed text-royal-mist">
                  {details.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
            </div>

            <div className="card-invert flex gap-4 p-5 xs:p-6" data-reveal>
              <span className="icon-well h-11 w-11 shrink-0">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-caption font-medium uppercase tracking-[0.14em] text-royal-mist">
                  Call
                </h3>
                <a
                  href={details.phoneHref}
                  className="mt-1 inline-flex min-h-[44px] items-center text-body font-medium text-white underline-offset-4 transition-colors hover:text-accent-soft hover:underline"
                >
                  {details.phone}
                </a>
              </div>
            </div>

            <div className="card-invert flex gap-4 p-5 xs:p-6" data-reveal>
              <span className="icon-well h-11 w-11 shrink-0">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-caption font-medium uppercase tracking-[0.14em] text-royal-mist">
                  Email
                </h3>
                {/* `break-all` splits an address at an arbitrary character;
                    `anywhere` only breaks when the line genuinely cannot fit,
                    so short addresses stay whole. */}
                <a
                  href={details.emailHref}
                  className="mt-1 inline-flex min-h-[44px] items-center text-body font-medium text-white [overflow-wrap:anywhere] underline-offset-4 transition-colors hover:text-accent-soft hover:underline"
                >
                  {details.email}
                </a>
              </div>
            </div>

            <div className="card-metric flex gap-4 p-5 xs:p-6" data-reveal>
              <span className="icon-well h-11 w-11 shrink-0">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-caption font-medium uppercase tracking-[0.14em] text-royal-mist">
                  Hours
                </h3>
                <p className="mt-2 text-body-sm leading-relaxed text-white">
                  {details.hours.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>

          <div
            className="on-light rounded-card-elevated border border-line bg-surface p-5 shadow-card xs:p-6 sm:p-8 lg:p-10"
            data-reveal
          >
            <h3 className="text-heading-sm text-ink">
              Send us your requirement list
            </h3>
            <p className="mt-2 text-body-sm text-ink-muted">
              {`Every enquiry reaches the ${site.shortName} sales desk directly.`}
            </p>

            <div className="mt-8">
              <QuoteForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
