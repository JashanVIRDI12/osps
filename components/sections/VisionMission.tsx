'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/lib/motion';
import { visionMission } from '@/lib/content';

/**
 * Purpose, set as an editorial spread.
 *
 * Two earlier attempts failed for the same underlying reason. Matching chevrons
 * claimed the two statements were peers; the bordered document plate was a flat
 * box of text with nothing to look at. Both treated vision and mission as a
 * layout problem rather than a hierarchy: the vision is the destination, the
 * mission is the method, and the page should say so before a word is read.
 *
 * So the statements run down one column at two clearly different scales, against
 * a single tall image that anchors the spread and gives the eye somewhere to
 * land. The three methods the mission names close the section as a footer rank
 * — full width, ruled, evenly weighted, because they genuinely are three equal
 * commitments and that is the one place symmetry tells the truth.
 *
 * The image is a still rather than a third video: the page already carries two,
 * and this section wants stillness.
 */
export function VisionMission() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = section.querySelector('[data-vm-media]');
    const blocks = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll('[data-vm-block]')
    );
    const rules = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll('[data-vm-rule]')
    );

    if (prefersReducedMotion()) {
      if (media) gsap.set(media, { opacity: 1, scale: 1 });
      gsap.set(blocks, { opacity: 1, y: 0 });
      gsap.set(rules, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
          toggleActions: 'play none none none',
        },
      });

      /**
       * The image settles rather than fades: a small scale-down reads as the
       * frame coming to rest, and it is the one gesture in the section, so the
       * copy can arrive quietly underneath it.
       */
      if (media) {
        timeline.fromTo(
          media,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
          0
        );
      }

      timeline
        .fromTo(
          blocks,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 },
          0.15
        )
        .fromTo(
          rules,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'power3.inOut',
            transformOrigin: 'left center',
            stagger: 0.1,
          },
          0.3
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const { vision, mission, media } = visionMission;

  return (
    <section
      ref={sectionRef}
      id="vision"
      className="relative overflow-hidden bg-gradient-to-br from-royal-tint via-white to-teal-tint py-20 sm:py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(42rem 32rem at 88% -8%, rgba(13,148,136,0.12), transparent 62%)',
        }}
      />

      <div className="shell relative">
        <p
          data-vm-block
          className="text-caption font-semibold uppercase tracking-[0.2em] text-accent"
        >
          {visionMission.eyebrow}
        </p>

        <div className="mt-10 grid gap-10 sm:mt-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16 xl:gap-20">
          {/**
           * The theatre still is already graded in light sky blue, so it sits
           * on the royal bed as a photograph rather than a duotone.
           */}
          <div className="relative overflow-hidden rounded-card-elevated bg-royal-deep">
            <div
              data-vm-media
              className="relative isolate aspect-[4/3] w-full bg-royal-deep sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[30rem]"
            >
              <Image
                src={media.src}
                alt={media.alt}
                fill
                sizes="(max-width: 1024px) 92vw, 34vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-royal-deep/35 via-transparent to-white/10"
              />
            </div>
          </div>

          {/* The statements, at two scales. */}
          <div className="flex flex-col justify-center">
            <div data-vm-block>
              <p className="text-caption font-semibold uppercase tracking-[0.2em] text-royal">
                {vision.label}
              </p>
              <span
                data-vm-rule
                aria-hidden="true"
                className="mt-4 block h-px w-full origin-left bg-royal/40"
              />
              <p className="mt-7 max-w-[26ch] text-balance text-[1.7rem] font-semibold leading-[1.16] tracking-[-0.04em] text-ink xs:text-[1.95rem] sm:text-[2.4rem] lg:text-[2.6rem]">
                {vision.body}
              </p>
            </div>

            <div className="mt-12 sm:mt-14" data-vm-block>
              <p className="text-caption font-semibold uppercase tracking-[0.2em] text-royal">
                {mission.label}
              </p>
              <span
                data-vm-rule
                aria-hidden="true"
                className="mt-4 block h-px w-full origin-left bg-royal/40"
              />
              <p className="mt-6 max-w-[52ch] text-pretty text-body leading-relaxed text-ink-muted sm:text-[1.1rem]">
                {mission.body}
              </p>
            </div>
          </div>
        </div>

        {/* The commitments. Three equal columns — the one honest symmetry here. */}
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <p
            data-vm-block
            className="text-caption font-semibold uppercase tracking-[0.2em] text-royal"
          >
            {mission.methodsLabel}
          </p>

          <ul className="mt-7 grid gap-x-10 gap-y-8 sm:grid-cols-3 sm:gap-x-12">
            {mission.methods.map((method) => (
              <li key={method} data-vm-block>
                <span
                  data-vm-rule
                  aria-hidden="true"
                  className="block h-px w-full origin-left bg-accent/60"
                />
                <p className="mt-5 text-balance text-[1.15rem] font-semibold leading-snug tracking-[-0.03em] text-ink sm:text-[1.3rem]">
                  {method}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
