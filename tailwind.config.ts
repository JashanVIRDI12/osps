import type { Config } from 'tailwindcss';

/**
 * Palette: royal blue primary on a light-white canvas, with red reserved as the
 * single accent. Every value below is contrast-checked against the surface it is
 * intended for — see design.md for the pairings that are considered safe.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      /**
       * One extra breakpoint below `sm`, for the handful of places where a
       * 320–390px phone genuinely cannot carry what a 400px+ phone can (the
       * header lockup, the hero rhythm). Everything else keeps the existing
       * sm / md / lg ladder untouched.
       */
      screens: {
        xs: '400px',
      },
      colors: {
        royal: {
          DEFAULT: '#3b82f6', // links + buttons on light
          deep: '#93c5fd', // tinted section canvas — carries INK text, not white
          shade: '#bfdbfe', // elevated panel on that canvas
          bright: '#60a5fa', // hover + accents on that canvas
          line: '#7dd3fc', // hairlines on that canvas
          mist: '#1e3a5f', // muted text + line-art on that canvas
          tint: '#eff6ff', // soft royal fill on the light canvas
          wash: '#dbeafe', // stronger royal fill / borders on light
        },
        accent: {
          DEFAULT: '#dc2436', // red accent on light            (4.8:1 on white)
          soft: '#ff5f6d', // red accent on the inverted canvas (4.9:1 on deep)
          deep: '#8f1523', // kickers on the light blue band  (4.8:1 on it)
          tint: '#feecee', // red wash on light
        },
        /**
         * Secondary "clinical" accent — the light theme's second brand colour,
         * used for panel washes, icon wells and section dividers so a scroll
         * through the light sections reads as more than one shade of blue.
         */
        teal: {
          DEFAULT: '#0d9488', // icons, borders, small fills     (3:1+ non-text)
          deep: '#0f766e', // text/kickers on tint or wash        (5:1+ on white)
          bright: '#14b8a6', // hover state
          line: '#99e6da', // borders on a tint surface
          tint: '#effaf9', // soft wash background
          wash: '#d3f3ee', // stronger wash / borders
        },
        ink: {
          DEFAULT: '#0c1533', // headings and body on light
          muted: '#4b5678', // secondary text on light          (6.4:1 on canvas)
          soft: '#5c6789', // captions, low emphasis on light   (4.9:1 on canvas)
        },
        canvas: '#f4f9ff', // page background
        surface: '#ffffff', // raised cards on the canvas
        line: {
          DEFAULT: '#d7e6f8', // hairline on light
          strong: '#b8d4f0',
        },
      },
      fontFamily: {
        sans: ['var(--font-gilroy)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        /**
         * Utility face, for the places the page speaks as a document rather
         * than as a brand: batch-style field labels, revision marks, spec keys.
         * A mono is not decoration here — in a WHO-GMP supplier's world every
         * controlled document is set this way, so it carries meaning the sans
         * cannot.
         */
        utility: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        caption: [
          '12px',
          { lineHeight: '1.44', letterSpacing: '0.24px', fontWeight: '500' },
        ],
        'body-sm': [
          '14px',
          { lineHeight: '1.44', letterSpacing: '0.28px', fontWeight: '500' },
        ],
        body: [
          '17px',
          { lineHeight: '1.44', letterSpacing: '-0.03em', fontWeight: '500' },
        ],
        subheading: [
          '18px',
          { lineHeight: '1.44', letterSpacing: '-0.54px', fontWeight: '500' },
        ],
        'heading-sm': [
          '24px',
          { lineHeight: '1.44', letterSpacing: '-0.72px', fontWeight: '600' },
        ],
        heading: [
          '46px',
          { lineHeight: '1', letterSpacing: '-1.84px', fontWeight: '600' },
        ],
        'heading-lg': [
          '54px',
          { lineHeight: '1', letterSpacing: '-2.16px', fontWeight: '600' },
        ],
        'heading-xl': [
          '66px',
          { lineHeight: '1', letterSpacing: '-2.64px', fontWeight: '600' },
        ],
        display: [
          '92px',
          { lineHeight: '0.92', letterSpacing: '-6.9px', fontWeight: '600' },
        ],
      },
      fontWeight: {
        medium: '500',
        semibold: '600',
      },
      borderRadius: {
        icon: '7px',
        input: '16px',
        card: '24px',
        'card-elevated': '32px',
        pill: '9999px',
      },
      boxShadow: {
        cta: '0 8px 24px -8px rgba(59, 130, 246, 0.35)',
        'cta-hover': '0 12px 30px -8px rgba(59, 130, 246, 0.45)',
        card: '0 1px 2px rgba(12, 21, 51, 0.04), 0 12px 32px -20px rgba(12, 21, 51, 0.18)',
        'card-hover':
          '0 1px 2px rgba(12, 21, 51, 0.05), 0 22px 48px -24px rgba(12, 21, 51, 0.28)',
      },
      maxWidth: {
        shell: '1200px',
      },
      spacing: {
        116: '116px',
        220: '220px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
