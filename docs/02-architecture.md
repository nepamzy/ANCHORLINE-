# Phase 2 — Technical Architecture

Documented decisions only. No page content is built in this phase; the
scaffold below is the minimum foundation needed to validate the stack and
carry the Phase 3 design tokens.

## Stack

| Concern | Decision | Why |
|---|---|---|
| Framework | Next.js (App Router, TypeScript) | Static generation for a mostly-static marketing site = fast loads on mobile; file-based routing maps cleanly onto the fixed sitemap; one deploy target for pages + the contact API route. |
| Styling | Tailwind CSS v4 | Utility CSS keeps output small (no unused CSS shipped), and the brand tokens (navy/gold/status colours) are defined once as design tokens and reused everywhere — no per-page style drift. |
| Language | TypeScript | Type-safety for form data, content shape, and props on shared components (service tiers, FAQ items, report sections). |
| Fonts | `next/font` (Inter, self-hosted, single family) | No external font-loading requests, no layout shift, minimal weight — matches the "fast, no clutter" requirement. Only one family to keep the type system simple and on-brand. |
| Hosting/deploy | Vercel (or any Next-compatible Node host) | Zero-config HTTPS, image optimization, and static caching for this framework. Alternatives are viable; this is the lowest-maintenance default. |

## Content architecture (client-editability requirement)

The brief requires the client to update text/images post-launch without a
developer. Two viable approaches, to be confirmed with the client based on
budget (brief Section 13 explicitly asks for CMS/licensing cost in the
proposal):

1. **Git-based CMS (Decap CMS / TinaCMS)** — free, content stored as
   Markdown/JSON in this repo, edited through a simple browser UI, deploys
   automatically. No recurring cost. Slightly less polished editing UX.
2. **Headless CMS (Sanity free tier)** — nicer editing UX (image cropping,
   structured fields, drag-and-drop), still free at this content volume,
   but adds an external service/account for the client to own.

**Recommendation**: start with a git-based CMS (option 1) — it satisfies
"editable without a developer" at zero ongoing cost, which fits a small
consultancy's budget ask. This is a technical decision, not a business
one; flagging for user/client confirmation before Phase 7 (Content &
Editable Areas) since it affects the editing workflow the client will be
trained on.

Content that is genuinely static (locked business facts: tier names,
brand colours, WhatsApp number) stays in code/config, not the CMS, so it
can't be accidentally edited into something that contradicts the brief.

## Form / email architecture

- Contact form (Section 7.8 fields) posts to a Next.js Route Handler
  (`/api/contact`), which sends the submission to
  `alprojectpartners@gmail.com` via a transactional email provider
  (e.g. Brevo or SMTP) — API key stored as an environment variable, never
  committed.
- Spam protection: honeypot field (zero-JS, zero-cost) + server-side
  rate limiting. A CAPTCHA (e.g. hCaptcha) is a fallback if spam persists
  post-launch — not added by default, to avoid friction on a form whose
  job is to convert.
- Server-side validation of all fields (required fields, email/phone
  format) in addition to client-side validation — never trust the client.

## WhatsApp integration

- `wa.me/2348067570941` deep link — no SDK/third-party script needed.
  Rendered as a shared `WhatsAppButton` component included in the global
  layout (header and/or sticky mobile element) so it appears on every
  page per the brief's global requirement.

## Asset handling

- `next/image` for automatic responsive sizing/optimization of any
  supplied photography.
- Original client-supplied assets (logo, report, photos) kept unmodified
  under `public/assets/`; any resized/optimized derivatives are generated
  separately and never overwrite the originals.

## SEO structure

- Per-page `metadata` exports (title/description) seeded from the
  brief's keyword themes (Section 10), one primary theme per page — no
  keyword stuffing.
- `sitemap.xml` and `robots.txt` via Next's built-in file conventions.
- JSON-LD `LocalBusiness`/`ProfessionalService` structured data on Home
  (Abuja address, service area) once client confirms exact business
  details to publish.

## Security

- All secrets (email API key, any CMS tokens) via environment variables,
  `.env.local` gitignored, `.env.example` committed as a template.
- HTTPS enforced by the hosting platform.
- Form input sanitized/validated server-side before sending.
- No client-side exposure of the email-sending credential (API route
  only, never a client-side fetch to the email provider).

## Testing

- `next build` + `next lint` as the baseline CI gate (type errors, lint
  errors, broken imports/routes surface here).
- Manual mobile/desktop pass per page before each phase sign-off, per the
  brief's mobile-first requirement.

## Folder structure (established this phase)

```
src/
  app/
    layout.tsx        root layout, fonts, global metadata
    globals.css        design tokens (Phase 3)
    page.tsx            placeholder (real Home = Phase 5)
    design-system/      internal token/component reference (not a site page)
  components/
    ui/                 shared primitives (Button, Card, Container, StatusBadge, ...)
docs/
  client-brief/          committed source-of-truth brief
  01-requirements.md
  02-architecture.md
  03-design-system.md
public/
  assets/                 client-supplied originals (logo/reports/photos)
```

Further folders (`components/sections`, `content/`, `lib/`, `app/api/contact`,
per-page routes) are added as later phases need them — not created empty
now to avoid speculative structure.

## Risks / open decisions for user review

1. CMS choice (git-based vs Sanity) — cost/UX tradeoff, see above.
2. Email provider for the contact form (Brevo vs plain SMTP) — needs
   client's preference/existing accounts, or defer to whichever is
   simplest to hand over.
3. Hosting provider/domain — brief explicitly asks the developer to
   propose this; not decided yet, pending budget conversation with client.
4. This scaffold was generated with a very recent Next.js major version
   (16.x); some App Router APIs may differ from older documentation —
   flagging as a technical risk to watch during Phase 4+ implementation,
   not a blocker now.
