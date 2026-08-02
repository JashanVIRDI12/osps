# Om Sai Pharma & Surgicals — Style Reference
> Clinical daylight — a white-paper canvas, royal blue structure, one red accent.

**Theme:** light

The page is built on light white (`#f7f8fc`) with pure white raised surfaces, so the default
impression is clean and clinical rather than atmospheric. Royal blue (`#1d3fbf`) carries every piece
of structure and interaction — buttons, links, icon wells, the process rail, the metric block — and a
deep royal (`#102463`) inverts whole sections for the hero, the metric band and the closing contact
panel, always as a hard cut and never as a gradient. Red (`#dc2436`) is the only third colour and it
never decorates: it marks the conversion action, the one emphasised word, and small "look here"
details. A single typeface (Gilroy, substituted with Manrope) speaks in two weights — 500 for running
text, 600 for display — with aggressive negative tracking at large sizes that makes headlines feel
engineered rather than written. Surfaces are pill-soft (9999px buttons, 24–32px cards) and lift on
low, neutral shadows so elevation reads as paper rather than glow.

## Tokens — Colors

### Royal blue — structure and interaction

| Name | Value | Token | Role |
|------|-------|-------|------|
| Royal | `#1d3fbf` | `royal` | Primary action fill, links on light, icon-well glyphs, metric block fill. 8.4:1 on white |
| Royal Deep | `#102463` | `royal-deep` | Inverted section canvas — hero, contact, footer. White text sits at 14.4:1 |
| Royal Shade | `#18318c` | `royal-shade` | Elevated card surface on the inverted canvas |
| Royal Bright | `#3a5ce8` | `royal-bright` | Primary hover, and accent edges on the inverted canvas |
| Royal Line | `#2c4aae` | `royal-line` | Hairline borders on the inverted canvas |
| Royal Mist | `#b9c8f5` | `royal-mist` | Secondary text and line-art on the inverted canvas. 8.7:1 on Royal Deep |
| Royal Tint | `#edf1fe` | `royal-tint` | Soft royal fill on light — eyebrow chips, icon wells, row hovers |
| Royal Wash | `#dce4fc` | `royal-wash` | Stronger royal fill and chip borders on light |

### Red — accent only

| Name | Value | Token | Role |
|------|-------|-------|------|
| Accent | `#dc2436` | `accent` | Conversion button fill, the one word-highlight box, emphasis marks on light. 4.8:1 on white |
| Accent Soft | `#ff5f6d` | `accent-soft` | The same accent on the inverted canvas. 4.9:1 on Royal Deep |
| Accent Tint | `#feecee` | `accent-tint` | Red wash behind small status and check marks on light |

### Ink and surfaces

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#0c1533` | `ink` | Headings and body copy on light |
| Ink Muted | `#4b5678` | `ink-muted` | Secondary and supporting copy on light. 6.9:1 on canvas |
| Ink Soft | `#5f6a8c` | `ink-soft` | Captions, counts, placeholders. 5.1:1 on canvas |
| Canvas | `#f7f8fc` | `canvas` | Page background and input fills |
| Surface | `#ffffff` | `surface` | Raised cards, the catalogue band, the quote-form panel |
| Line | `#e2e6f3` | `line` | Hairline borders and grid rules on light |
| Line Strong | `#c9d0e6` | `line-strong` | Outlined button borders, the unfilled process rail |

## Tokens — Typography

### Gilroy — Sole typeface · `--font-gilroy`
- **Substitute:** Manrope (in use) or Plus Jakarta Sans
- **Weights:** 500, 600
- **Line height:** 0.92 (display) / 1.00 (headlines) / 1.44 (body)
- **Letter spacing:** -0.075em at 92px+ / -0.04em at 46–66px / -0.03em at 17–24px / 0.02em at 12–14px

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.44 | 0.24px | `text-caption` |
| body-sm | 14px | 1.44 | 0.28px | `text-body-sm` |
| body | 17px | 1.44 | -0.03em | `text-body` |
| subheading | 18px | 1.44 | -0.54px | `text-subheading` |
| heading-sm | 24px | 1.44 | -0.72px | `text-heading-sm` |
| heading | 46px | 1 | -1.84px | `text-heading` |
| heading-lg | 54px | 1 | -2.16px | `text-heading-lg` |
| heading-xl | 66px | 1 | -2.64px | `text-heading-xl` |
| display | 92px | 0.92 | -6.9px | `text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px · **Density:** comfortable

### Spacing Scale
8, 12, 16, 20, 24, 32, 36, 40, 48, 116, 220px

### Border Radius
- tags / buttons: 9999px
- cards: 24px · cards-elevated: 32px
- icons: 7px · inputs: 16px

### Layout
- Page max-width: 1200px (`shell`)
- Section padding: 80–112px vertical
- Card padding: 24px
- Element gap: 8px

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#f7f8fc` | Page background — the default for most sections (`.section-base`) |
| 2 | Surface | `#ffffff` | Raised cards, and the catalogue band (`.section-surface`) |
| 3 | Royal Tint | `#edf1fe` | Soft fills: eyebrows, icon wells, row hover states |
| 4 | Royal | `#1d3fbf` | The single highlighted metric block (`.card-metric`) |
| 5 | Royal Deep | `#102463` | Inverted sections (`.section-invert`) — hero, contact, footer |

## Components

- **Pill CTA (Accent):** `.btn-accent` — red fill, white text. The "Request a Quote" action only
- **Pill CTA (Primary):** `.btn-primary` — royal fill, white text, royal-tinted shadow
- **Pill Button (Outline):** `.btn-outline` — white fill, strong line border, royal on hover
- **Pill Button (Ghost):** `.btn-ghost` — white hairline on the royal canvas
- **Pill Button (Light):** `.btn-light` — white fill, royal-deep text, for use inside royal sections
- **Card:** `.card` — white, 24px radius, 1px Line, low neutral shadow
- **Card (Inverted):** `.card-invert` — Royal Shade on the royal canvas, 1px Royal Line, no shadow
- **Metric Block:** `.card-metric` — royal fill with white numerals
- **Word Highlight:** `.word-highlight` — 1px dashed Accent, 7px radius — one per page max
- **Eyebrow Chip:** `.eyebrow` — Royal Tint fill, Royal Wash border, royal caps; inverts automatically
- **Icon Well:** `.icon-well` — Royal Tint fill, 7px radius, royal glyph; inverts automatically
- **Navigation Bar:** transparent over the hero, settling to Royal Deep at 94% on scroll, 80px tall
- **Section Divider:** hard cut canvas → Royal Deep. No gradient transitions between the two

## Do's and Don'ts

### Do
- Keep Canvas as the page default and reserve Royal Deep for full-section inversions
- Set all buttons and tags to 9999px border-radius
- Apply -0.075em letter-spacing at 92px+ display sizes
- Use Royal for links, icon glyphs and anything interactive on light
- Use Accent for the conversion CTA, the single word-highlight, and small emphasis marks
- Switch to `accent-soft` / `royal-mist` for the same roles inside an inverted section
- Break light and royal with a hard colour cut

### Don't
- Never use a neutral grey as a section background — the canvas is blue-tinted white
- Do not mix weight 400 or 700 into the type system
- Never use red as a large surface fill, and never for more than one button per view
- Do not use red to mean "error" and royal to mean "success" — status is carried by icon and copy
- Avoid sharp corners (minimum 7px)
- Do not introduce a second typeface
- Do not gradient between the light canvas and a royal section

## Elevation
- Primary / Accent CTA: `0 8px 24px -8px rgba(29, 63, 191, 0.45)` — tinted, directional, not a glow
- Card: `0 1px 2px rgba(12,21,51,0.04), 0 12px 32px -20px rgba(12,21,51,0.18)`
- Card hover: `0 1px 2px rgba(12,21,51,0.05), 0 22px 48px -24px rgba(12,21,51,0.28)`
- Cards on the royal canvas: no shadow — separation comes from the Royal Line border

## Agent Prompt Guide

**Quick Color Reference**
- text: `#0c1533` (on light) / `#ffffff` (on royal)
- background: `#f7f8fc` (light) / `#102463` (royal)
- border: `#e2e6f3` (light) / `#2c4aae` (royal)
- primary action / links: `#1d3fbf`
- accent: `#dc2436` (light) / `#ff5f6d` (royal)

## Color Hierarchy Rules

Canvas is ALWAYS the page default. Surface is ALWAYS one level up. Royal is for interaction and for
the one metric block. Royal Deep is ONLY for whole-section inversions. Accent red is ONLY for the
conversion action, the single word-highlight, and small emphasis marks — never a large fill and never
a status colour. Royal blue and red are the only colours allowed to break the ink-on-white scheme.
