# Phase 3 — Brand & Design System

Implemented as Tailwind design tokens in `src/app/globals.css`, with base
components in `src/components/ui/`. Live reference: run `npm run dev` and
visit `/design-system` (internal page, not part of the client sitemap).

## Colour

Locked by brief Section 11:

- Primary — Deep Navy `#0B2954`
- Accent — Gold/Brass `#E4A41F`

Supporting scale (technical decision, derived from the two locked colours
for hover states, tints, and text-on-tint contrast):

| Token | Value | Use |
|---|---|---|
| `navy-950` | `#06172E` | Darkest — rarely used, deep backgrounds only |
| `navy-900` | `#0B2954` | Primary brand colour — headers, primary buttons |
| `navy-800` | `#123A6E` | Hover/active state for navy elements |
| `navy-700` | `#1C4B86` | Links on light backgrounds |
| `navy-100` | `#E6EBF2` | Section tint backgrounds |
| `navy-50` | `#F4F6FA` | Subtle page-section backgrounds |
| `gold-600` | `#B6800F` | Accent text/icons needing AA contrast on white |
| `gold-500` | `#E4A41F` | Accent brand colour — CTAs, dividers, highlights |
| `gold-100` | `#FAECC9` | Accent tint backgrounds/badges |
| `ink` | `#1A2027` | Body text |
| `slate` | `#4B5563` | Secondary/caption text |
| `line` | `#E2E5EA` | Borders, dividers |
| `paper` | `#FFFFFF` | Page/card background |
| `offwhite` | `#F7F8FA` | Alternating section background |

Status key colours (Sample Report progress table, Section 7.5):
On Track `#1E7A3D`, Minor Delay `#B6800F`, Attention Required `#B3261E`.

No dark-mode variant — the brief calls for one consistent, professional
presentation, not theme-switching.

## Typography

Single family: **Inter** (self-hosted via `next/font`), for both headings
and body — deliberately not mixing multiple families, to keep the site
fast-loading and visually calm per the brief's "no clutter" requirement.

- H1: 2.25–3rem, bold, navy-900
- H2: 1.5rem, bold, navy-900
- H3: 1.125rem, semibold, navy-900
- Body: 1rem, regular, ink
- Caption/meta: 0.875rem, regular, slate

## Buttons / CTAs

- **Primary** (`Get a Quote`, etc.): solid navy-900, white text, navy-800
  on hover.
- **Secondary** (`Learn More`, etc.): outlined navy-900 on transparent.
- **WhatsApp**: fixed WhatsApp green (`#25D366`), not a brand-colour
  substitute — WhatsApp CTAs should be instantly recognisable as such.
- Minimum 44px touch target height on all buttons (mobile tap-target
  accessibility).

## Cards & sections

- Cards: white background, 1px `line` border, subtle shadow, `0.5rem`
  radius — used for service tiers, FAQ items, report structure blocks.
- Sections alternate `paper` / `offwhite` backgrounds for visual rhythm
  without needing decorative graphics.
- Max content width: `72rem` (1152px) container, with responsive
  horizontal padding.

## Forms

- Labelled inputs (visible `<label>`, not placeholder-only), `line`
  border, `navy-900` focus ring via `:focus-visible`, `0.375rem` radius.
- Error/validation states use `attention` red, not colour alone (icon +
  text) for accessibility.

## Responsive rules

- Mobile-first breakpoints (Tailwind defaults: `sm` 640px, `md` 768px,
  `lg` 1024px, `xl` 1280px).
- Single-column stacking below `md`; service-tier cards and similar grids
  go 1-column → 3-column at `sm`/`lg` as content requires.
- No horizontal scroll at any breakpoint; all images `max-width: 100%`.

## Logo treatment

- Use the supplied official mark as-is (anchor icon + "ANCHOR LINE"
  wordmark). Omit its baked-in "CONSTRUCTION & INFRASTRUCTURE" subtext;
  pair it with "Anchorline Project Partners" or the tagline instead, per
  brief Section 11.
- No redesign, recolour, or replacement. Original file(s) kept unmodified
  in `public/assets/logo/`; any resized web derivatives are generated
  separately.
- **Not yet available as a file** — see Client Input Still Required in
  the completion report. Logo treatment rules above are ready to apply
  the moment the file is supplied.

## Accessibility baked into the tokens

- All text/background colour pairs above meet WCAG AA at their intended
  use (body text on `paper`/`offwhite`; `gold-600`, not `gold-500`, used
  for accent text on light backgrounds because `gold-500` alone fails AA
  contrast for text).
- Visible `:focus-visible` outline (gold-600, 2px) defined globally.

## Interaction principles

- No scroll-triggered or decorative animation. Only functional
  transitions (colour/opacity on hover/focus, ~150ms) — consistent with
  the brief's explicit "no heavy animation or clutter" requirement.
