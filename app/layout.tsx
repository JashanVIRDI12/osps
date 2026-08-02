import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { MotionRoot } from '@/components/providers/MotionRoot';
import { site } from '@/lib/content';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600'],
  variable: '--font-gilroy',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Pharmaceutical & Surgical Supplies`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    'pharmaceutical supplier',
    'surgical consumables',
    'medical devices',
    'hospital supplies',
    'healthcare distributor India',
  ],
  openGraph: {
    title: `${site.name} | Pharmaceutical & Surgical Supplies`,
    description: site.description,
    type: 'website',
    url: site.url,
    siteName: site.name,
  },
};

/**
 * `viewportFit: 'cover'` lets the full-bleed hero, marquee and card decks run
 * under the notch and home indicator instead of being letterboxed by the
 * browser. Every container that touches a screen edge pads itself back off the
 * unsafe area with `env(safe-area-inset-*)` — see `.shell` / `.gutter-x` in
 * globals.css. `maximumScale` is deliberately left at the default so pinch-zoom
 * is never blocked.
 */
export const viewport: Viewport = {
  themeColor: '#102463',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/**
 * Adds `js` before first paint so reveal targets start hidden, and removes it
 * again if the motion runtime never boots — a failed bundle then degrades to
 * plain, fully visible content rather than a blank page.
 */
const motionGate = `document.documentElement.classList.add('js');setTimeout(function(){if(!window.__ospsMotionReady){document.documentElement.classList.remove('js')}},4000);`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        {/**
         * The hero backdrop is a CSS background (its `background-size` used to
         * be animated), so it is invisible to the preload scanner and only
         * starts downloading after style resolution — on a phone that is the
         * single largest delay in LCP. Preloading it moves the request into the
         * first round trip.
         */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-warehouse.jpg"
          fetchPriority="high"
        />
        <script dangerouslySetInnerHTML={{ __html: motionGate }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-pill focus:bg-royal focus:px-5 focus:py-3 focus:text-body-sm focus:font-medium focus:text-white"
        >
          Skip to main content
        </a>
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
