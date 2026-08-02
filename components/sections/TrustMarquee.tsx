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
      className="section-invert on-invert relative border-y border-royal-line/60 py-5"
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
                  className="flex shrink-0 items-center gap-6 px-6 text-[15px] font-medium text-royal-mist/85"
                >
                  <span className="whitespace-nowrap">{item}</span>
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rotate-45 bg-accent-soft/80"
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
