import { marquee, site } from '@/lib/content';

/**
 * Thin continuous strip that carries the hero's motion into the page.
 * The list is rendered twice so the -50% keyframe loops seamlessly; the copy is
 * decorative, so the duplicate is hidden from assistive tech.
 */
export function TrustMarquee() {
  return (
    <section
      aria-label={site.tagline}
      className="relative border-y border-line bg-gradient-to-r from-royal-tint via-white to-teal-tint py-5"
    >
      <div className="edge-fade overflow-hidden">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? 'true' : undefined}
              className="flex shrink-0 items-center"
            >
              {marquee.map((item) => (
                <li
                  key={item}
                  className="flex shrink-0 items-center gap-6 px-6 text-[15px] font-medium text-ink-muted"
                >
                  <span className="whitespace-nowrap">{item}</span>
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rotate-45 bg-accent/70"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
