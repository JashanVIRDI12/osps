import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { contact, privacyPolicy, site } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${site.name} collects, uses, and protects your information, including WhatsApp communications.`,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPolicyPage() {
  const { details } = contact;

  return (
    <>
      <Navbar />
      <main id="main">
        <article className="shell pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
          <header className="max-w-3xl">
            <p className="eyebrow">Legal</p>
            <h1 className="heading-section-lg mt-2 max-w-none">
              {privacyPolicy.title}
            </h1>
            <p className="mt-4 text-body-sm text-ink-soft">
              Last updated: {privacyPolicy.lastUpdated}
            </p>
            <p className="mt-8 text-pretty text-body leading-relaxed text-ink-muted">
              {privacyPolicy.intro}
            </p>
          </header>

          <div className="mt-12 flex max-w-3xl flex-col gap-10 sm:mt-14 sm:gap-12">
            {privacyPolicy.sections.map((section) => (
              <section key={section.heading} className="flex flex-col gap-4">
                <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-ink sm:text-[1.5rem]">
                  {section.heading}
                </h2>

                {'body' in section && section.body ? (
                  <p className="text-pretty text-body leading-relaxed text-ink-muted">
                    {section.body}
                  </p>
                ) : null}

                {'paragraphs' in section && section.paragraphs
                  ? section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-pretty text-body leading-relaxed text-ink-muted"
                      >
                        {paragraph}
                      </p>
                    ))
                  : null}

                {'bullets' in section && section.bullets ? (
                  <ul className="flex list-none flex-col gap-2.5 pl-0">
                    {section.bullets.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-pretty text-body leading-relaxed text-ink-muted"
                      >
                        <span
                          className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-royal"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {'after' in section && section.after
                  ? section.after.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-pretty text-body leading-relaxed text-ink-muted"
                      >
                        {paragraph}
                      </p>
                    ))
                  : null}

                {'contactBlock' in section && section.contactBlock ? (
                  <address className="not-italic text-body leading-relaxed text-ink-muted">
                    <p className="font-medium text-ink">{site.name}</p>
                    {details.address.slice(1).map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                    <p className="mt-3">
                      Email:{' '}
                      <a
                        href={details.emailHref}
                        className="font-medium text-royal underline-offset-4 hover:underline"
                      >
                        {details.email}
                      </a>
                    </p>
                    <p>
                      Phone:{' '}
                      <a
                        href={details.phoneHref}
                        className="font-medium text-royal underline-offset-4 hover:underline"
                      >
                        {details.phone}
                      </a>
                    </p>
                    <p>
                      Website:{' '}
                      <a
                        href={site.url}
                        className="font-medium text-royal underline-offset-4 hover:underline"
                      >
                        ospsmed.com
                      </a>
                    </p>
                  </address>
                ) : null}
              </section>
            ))}
          </div>

          <p className="mt-14 max-w-3xl border-t border-line pt-8 text-body-sm text-ink-soft">
            <Link
              href="/"
              className="font-medium text-royal underline-offset-4 hover:underline"
            >
              ← Back to home
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
