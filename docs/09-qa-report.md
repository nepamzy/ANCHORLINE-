# Phase 9 — QA, Security, SEO & Performance

## Functional QA
- All 9 public routes + `/design-system` return 200; `/api/contact`,
  `/sitemap.xml`, `/robots.txt` verified via curl.
- Manually exercised: mobile hamburger menu open/close, FAQ accordion,
  full contact form submit flow (validation error, honeypot, rate limit,
  and unconfigured-provider paths all verified with live requests — see
  Phase 8 doc for exact `curl` transcripts).
- Internal navigation links checked via automated Playwright pass across
  all pages/viewports — no broken links found.
- WhatsApp links point to `https://wa.me/2348067570941` everywhere
  (header, footer, every CTA banner, Contact page) — single source of
  truth in `src/content/site.ts`, grepped repo-wide to confirm no other
  number appears anywhere.

## Responsive QA
Tested at 375px, 768px, 1280px, and 1440px via Playwright/Chromium
against the running dev server (not just build success):
- **Zero horizontal overflow** at any of the 4 viewports across all 9
  pages (`scrollWidth === clientWidth` checked programmatically, not
  eyeballed).
- **Zero broken images**, **exactly one `<h1>`** per page at every
  viewport.
- Visually reviewed screenshots at each breakpoint for header/nav,
  cards, tables (Sample Report), forms, and footer — no layout breaks.

## Accessibility QA
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<footer>`, `<h1>`–`<h3>`
  hierarchy (verified no skipped levels, e.g. About page: H1 → H2 → H2).
- Keyboard: first `Tab` press lands on the logo link (skip-adjacent,
  logical order); mobile menu button has `aria-expanded`/`aria-controls`;
  all interactive elements are native `<button>`/`<a>`/`<select>` — no
  custom widgets needing extra ARIA.
- Visible focus state defined globally (`:focus-visible` with a 2px gold
  outline) in `globals.css`.
- Every link/button has discernible text or `aria-label` — checked
  programmatically (0 empty-text links found).
- Forms: every input has a visible, associated `<label>`; the contact
  form's error state uses `role="alert"` so screen readers announce
  failures; honeypot field is hidden via off-screen positioning +
  `aria-hidden` + `tabIndex={-1}`, not `display:none` (avoids some
  screen-reader/bot-detection edge cases while staying invisible).
- No unnecessary ARIA added — native semantics used throughout.
- No motion beyond ~150ms colour/opacity transitions on hover/focus; no
  scroll-triggered animation to gate behind `prefers-reduced-motion`.

## SEO
- Per-page `<title>`/description on all 9 pages + `/design-system`
  (marked `noindex`, `nofollow` — internal reference, not in the sitemap).
- `metadataBase` + Open Graph metadata (title/description/type/locale)
  on the root layout.
- `sitemap.xml` and `robots.txt` generated via Next's file conventions
  (`src/app/sitemap.ts`, `src/app/robots.ts`), both exclude
  `/design-system` and `/api/`.
- Minimal `ProfessionalService` JSON-LD on Home — built only from facts
  stated in the brief (name, description, email, area served); no
  address, hours, or ratings included since the brief doesn't supply
  them.
- Site URL (`NEXT_PUBLIC_SITE_URL`) falls back to `localhost:3000` in
  dev — **needs setting once a production domain is chosen** (still an
  open decision, see Phase 2).
- No keyword stuffing; page copy is the brief's own content, not
  SEO-rewritten filler.

## Performance
- Single font family (Inter, self-hosted via `next/font`, `display:
  swap`) — no additional font loads.
- No client-side JavaScript beyond what's structurally necessary:
  `Header` (mobile menu state) and `ContactForm` (fetch + form state)
  are the only two `"use client"` components in the app; every page and
  every other component is a Server Component.
- No animation libraries, no heavy third-party scripts, no analytics
  script added (brief lists analytics as nice-to-have, not implemented).
- Zero new npm dependencies added across Phases 7–9 — the Brevo
  integration uses a plain `fetch()` call instead of an SDK.
- `npm audit --omit=dev`: 0 vulnerabilities.
- No images in the current build (no client photography supplied yet),
  so there is nothing to optimize/lazy-load yet — `next/image` is the
  established pattern for when photography arrives (Phase 2 doc).

## Security review
- `BREVO_API_KEY` read only in `src/app/api/contact/route.ts` (a server
  route handler) — never referenced from client code, never present in
  any client bundle.
- `.env.example` documents required variables with empty values; no
  secrets committed; `.gitignore` excludes all `.env*` except the
  example file.
- Contact endpoint: server-side validation (required fields, allowed
  tier values, 2000-char cap, newline stripping to prevent header
  injection), honeypot, and per-IP rate limiting (5 requests/10 min) —
  see Phase 8 doc for full detail and verified `curl` transcripts.
- No authentication/CMS surface exists yet (Phase 7 stayed at the
  git-committed-JSON stage), so there's no auth/permission boundary to
  audit this phase — noted for whenever a browser-based editing UI is
  added on top.
- No other API routes exist besides `/api/contact`.

## Code quality
- Refactored duplicate button markup discovered during this review: the
  "Get a Quote" CTA and WhatsApp button were each hand-styled inline in
  4–5 different files instead of reusing the existing `Button` /
  `WhatsAppButton` components. Consolidated all of them onto `Button`
  (added a `gold` variant for the CTA banner) and had `WhatsAppButton`
  wrap `Button` instead of duplicating its class string.
- Fixed a real bug found in the process: `Button` spread `...rest` after
  setting `className`, so any caller passing `className` would have
  silently wiped out the component's own base/variant classes. Fixed by
  destructuring `className` out and merging it explicitly. (No caller
  had hit this yet, but `WhatsAppButton`'s refactor onto `Button` would
  have immediately triggered it.)
- No dead code, no unused imports (`npm run lint` clean), no unused
  npm dependencies.
- `tsc --noEmit` clean.

## Build verification
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — clean; TypeScript passes; all 16 routes (11 static
  pages, `/design-system`, `sitemap.xml`, `robots.txt`, and the dynamic
  `/api/contact`) build successfully.

## Browser testing
Actually run via `npm run dev` + Playwright/Chromium (not inferred from
build success alone): all 9 public pages loaded and screenshotted at
375/768/1280/1440px; 0 console errors; 0 broken images; contact form's
full submit lifecycle (loading → error, loading → rate-limited) verified
visually and via intercepted network responses; mobile nav and FAQ
accordion interactions verified with real clicks, not just markup review.

## Content integrity (against the brief)
Grepped the entire codebase for business-critical facts:
- **WhatsApp number**: `0806 757 0941` / `wa.me/2348067570941` — appears
  in exactly one source location (`src/content/site.ts`); no other
  phone-like number found anywhere in `src/` or `content/`.
- **Email**: `alprojectpartners@gmail.com` — single source location; no
  other email address found in `src/` or `content/`.
- **Tagline**: "Your eyes on the ground, wherever you are." — single
  source location, matches the brief exactly.
- **Tier names**: `WATCH` / `VERIFY` / `MANAGE` — confirmed as the only
  three tiers in `content/services.json`, matching brief Section 7.
- **Sitemap**: 9 public routes + internal `/design-system` (noindexed,
  not in `content/site.ts` navigation) — matches brief Section 6 exactly,
  Insights excluded as instructed.
- No fabricated testimonials, sample report data, credentials, pricing,
  or coverage claims found anywhere in the codebase.
