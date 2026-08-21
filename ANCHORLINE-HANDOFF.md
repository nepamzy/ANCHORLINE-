# Anchorline Project Partners — Project Handoff

One file, everything in it: quick-start instructions up top, full
architecture/reference below.

---

# PART 1 — QUICK START

## For the developer/operator

### 1. Install

```bash
npm install
```

Node 22.x required (uses Node's built-in `node:sqlite`, experimental
as of Node 22). npm 10.x used in development.

### 2. Set up the client dashboard login

```bash
openssl rand -hex 32                                # copy the output → SESSION_SECRET
node scripts/hash-password.mjs "choose a password"  # copy the output → CLIENT_PASSWORD_HASH
```

Then create `.env.local`:

```bash
cp .env.example .env.local
```

And fill in:

```
CLIENT_USERNAME=whatever-you-want
CLIENT_PASSWORD_HASH=<paste the hash-password.mjs output>
SESSION_SECRET=<paste the openssl output>
```

Without these three, the public site works fine but `/login` and
`/dashboard` will reject every login attempt with a clear "not
configured" error — not a silent failure.

### 3. Other environment variables

| Variable | Needed for |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Correct sitemap/robots/OG/canonical URLs — set once a domain is chosen |
| `RESEND_API_KEY` / `CONTACT_FROM_EMAIL` | Contact form email delivery — set once a Resend account exists |
| `CONTACT_TO_EMAIL` | Optional test override of the destination inbox (normally comes from the dashboard's Contact Information section) |

### 4. Run locally

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Client login: `http://localhost:3000/login`
- Internal brand/component reference: `http://localhost:3000/design-system`

### 5. Production build

```bash
npm run build
npm run start   # serves the production build locally on :3000
```

### 6. Deployment notes

- Needs a host with a **persistent, writable filesystem** — the CMS
  database (`data/anchorline.db`) and uploaded images/reports
  (`public/uploads/`) both live on local disk. A serverless/edge host
  (e.g. Vercel serverless functions) will **not** work as-is; you'd
  need to swap in a hosted database and object storage first.
- Set `NEXT_PUBLIC_SITE_URL` to the real domain before launch.
- This project has never been deployed by any Claude session — that's
  the next step for whoever takes it live.

### 7. Important files

- `docs/client-brief/Anchorline_Detailed_Website_Brief.docx` — the
  authoritative client brief. Never edit; never contradict.
- `src/content/site.ts` — locked business facts (tagline, tier names,
  nav, report structure). Never move these into the editable content
  system.
- `src/lib/db.ts` / `src/lib/content.ts` — the CMS storage/read layer.
- `.env.example` — every environment variable the app reads, with
  empty placeholder values.

### 8. Troubleshooting

- **"Login is not configured on this server yet"** — set
  `CLIENT_USERNAME`, `CLIENT_PASSWORD_HASH`, `SESSION_SECRET` (step 2).
- **Contact form always errors** — expected until `RESEND_API_KEY`/
  `CONTACT_FROM_EMAIL` are set; check server logs for `[contact]`
  messages.
- **Dashboard changes don't appear on the live site** — check whether
  you clicked *Publish*, not just *Save draft*. The Overview page shows
  "Unpublished changes" per section as a reminder.
- **Port 3000 already in use** — a previous `next dev`/`next start` is
  likely still running; find and stop it
  (`pgrep -af "next dev\|next-server"`).

## For the client (using the dashboard)

### How to log in

1. Go to `yoursite.com/login`.
2. Enter the username and password your developer set up for you.
3. You'll land on the Dashboard Overview.

### How to edit content

1. Click a section in the left sidebar (About, Services, How It
   Works, FAQ, Testimonials, Sample Report, Images/Media, Contact
   Information, or SEO).
2. Make your changes in the form fields — no code, no technical
   knowledge needed.
3. Click **Save draft**. This does *not* change your live website yet
   — it's safe to save and come back later.

### How to preview

Click **Preview** (top of the editor) to see exactly how your draft
will look on the real website, in a new tab, before anyone else sees
it.

### How to publish

When you're happy with a section, click **Publish**. It goes live on
your website immediately — no waiting, no developer needed.

### Things to know

- **Testimonials**: only add real client quotes with their permission.
  Leave the list empty until you have one — the site shows a polite
  "collecting feedback" message instead of a blank page.
- **Contact Information**: when entering your WhatsApp number, include
  the country code with no spaces (e.g. the digits for +234 806 757
  0941) so the "Chat on WhatsApp" buttons keep working correctly
  everywhere on the site.
- **Sample Report**: upload your anonymised report file here (PDF or
  image) once it's ready — until then, the website shows a clearly
  labeled placeholder, never anything fabricated.
- **Log out** when you're done, especially on a shared computer.

---

# PART 2 — FULL PROJECT REFERENCE

## A. Project Overview

- **Project name**: Anchorline Project Partners — Official Business Website
- **Business**: Anchorline Project Partners, an independent construction
  oversight, quantity surveying, and project management consultancy led
  by Damian Chibueze Agu, Abuja, Nigeria.
- **Purpose**: establish credibility with diaspora and private clients
  who cannot personally supervise their construction projects, explain
  the three-tier service model, and convert visitors into WhatsApp/form
  enquiries — now with a client-operated dashboard so the business can
  keep the site current without a developer.
- **Source of truth**: `docs/client-brief/Anchorline_Detailed_Website_Brief.docx`
  remains authoritative for all business facts, wording, services,
  claims, and brand requirements. Business content has not been
  invented; where content is client-editable it starts from the
  brief's own language.
- **Design direction — approved change on record**: the brief calls for
  a "clean, minimal, no heavy animation" site. Partway through this
  project the user explicitly authorized overriding that in favor of a
  cinematic, interactive experience (scroll-driven building sequence,
  staged entrances, hover interactions). This is a deliberate,
  user-approved departure from the brief's original design philosophy —
  not an unauthorized change.
- **Branch**: `claude/anchorline-project-partners-rbz3iz`
- **Production build status**: `npm run build` succeeds cleanly (0
  TypeScript errors, 0 lint errors/warnings) as of the latest commit —
  see Git Status below for the exact hash.

## B. Technology Stack

Read directly from `package.json` / runtime, not guessed:

| Package | Version |
|---|---|
| next | 16.3.0 |
| react / react-dom | 19.2.8 |
| typescript | ^5 (installed: 5.9.3) |
| tailwindcss | ^4 |
| eslint / eslint-config-next | ^9 / 16.3.0 |
| Node.js (build environment) | v22.22.2 |
| Package manager | npm, `package-lock.json` committed |

**No new npm dependencies were added for the CMS.** Storage uses Node's
built-in `node:sqlite` (experimental as of Node 22); authentication
uses Node's built-in `crypto` (scrypt hashing, HMAC-signed session
cookies). This was a deliberate choice over adding a database driver
or an auth library.

- **Rendering**: the entire site is now dynamically rendered
  (`export const dynamic = "force-dynamic"` in the root layout) because
  content can change via the dashboard without a rebuild — a tradeoff
  from the previous fully-static generation, necessary for "publish
  takes effect immediately."
- **Routing structure**: `src/app/(site)/` is a route group holding all
  public pages (Home, About, Services, etc.) under a layout that renders
  the public Header/Footer. `src/app/dashboard/` and `src/app/login/`
  sit outside that group with their own layout/chrome — the dashboard
  does not show the public site nav, and the public site doesn't show
  dashboard chrome. The `(site)` folder name is invisible in URLs.

## C. Complete Project Structure

```
docs/                          Phase-by-phase documentation (historical record)
  client-brief/                Committed copy of the authoritative client brief
  01-requirements.md .. 09-qa-report.md   Phase 1-9 records

content/                       Legacy JSON files — used only to seed the
                                database on first run (see src/lib/seed.ts);
                                no longer read directly at request time

data/                          Local SQLite database file (gitignored) —
                                created automatically on first run

src/
  app/
    layout.tsx                 Root layout: fonts, metadata, html/body shell only
    (site)/                    Route group — public pages + their own Header/Footer layout
      layout.tsx                 Fetches contact info, renders Header/Footer
      page.tsx                    Home
      about/, services/, how-it-works/, sample-report/,
      coverage-area/, faq/, testimonials/, contact/       One folder per sitemap page
      design-system/              INTERNAL brand/component reference — noindexed
    login/                      Client login page + form
    dashboard/                  Protected client CMS (see Section G)
    api/
      contact/route.ts           Public contact form backend (unchanged)
      auth/login, auth/logout    Session login/logout
      dashboard/content/[section]/route.ts            Draft GET/PUT
      dashboard/content/[section]/publish/route.ts     Publish POST
      dashboard/upload/route.ts  Image/report file upload
    sitemap.ts, robots.ts       SEO file-convention routes
    icon.png, apple-icon.png, favicon.ico   Official supplied favicon (see Section H)
    globals.css                 Tailwind + brand design tokens

  components/
    layout/                Header, Footer, Logo — public site chrome
    sections/               Page-level building blocks, incl. CinematicFilm (see Section P)
    motion/                  Reveal, usePrefersReducedMotion, useIsNarrowViewport
    ui/                      Small reusable primitives (Button, Card, Container, ...)

  content/site.ts          LOCKED business constants (tagline, tier names, nav, report structure)
  lib/
    content.ts               Content getters — now DB-backed, draft + published variants
    db.ts                     node:sqlite persistence layer
    film-shots.ts             Homepage cinematic sequence data (see Section P)
    seed.ts                   One-time migration from content/*.json into the database
    auth.ts                   Password hashing, session tokens, getSession()
    dashboard-auth.ts          API route auth guard
    rate-limit.ts              In-memory rate limiter (contact form + login)
    site-url.ts                 Production site URL resolution

  types/node-sqlite.d.ts   Ambient types for node:sqlite (not yet in @types/node)

public/
  assets/
    logo/                   Official logo (integrated previous round)
    brand/                  Official favicon design + social-share design (originals + derived assets)
    film/                    Homepage cinematic sequence photos — desktop + mobile variants (see Section P)
  uploads/                  Client-uploaded media/reports (gitignored contents)

scripts/
  hash-password.mjs        Generates CLIENT_PASSWORD_HASH from a real password
```

## D. Website Pages

| Route | Purpose | Content source |
|---|---|---|
| `/` | Home — hero, building story, trust strip, tier snapshot, How It Works teaser, closing CTA | DB-backed (published) |
| `/about` | Principal Consultant bio, credentials, approach | DB-backed |
| `/services` | Full Watch/Verify/Manage tier detail, quote-driven | DB-backed |
| `/how-it-works` | Full 5-step client journey, scroll-activated | DB-backed |
| `/sample-report` | Report structure preview + illustrative (non-real) status table | Locked structure + client-content placeholder until a real file is uploaded |
| `/coverage-area` | Abuja-based coverage, interstate arrangements | DB-backed |
| `/faq` | FAQ items, accordion | DB-backed |
| `/testimonials` | Client testimonials or honest placeholder | DB-backed (empty by default) |
| `/contact` | Get-a-Quote form + WhatsApp/email panel | Form UI + `/api/contact` backend; WhatsApp/email now DB-backed |
| `/login` | Client login | N/A |
| `/dashboard/*` | Protected client CMS | N/A |
| `/design-system` | **Internal only** — brand/component reference, `noindex` | Hardcoded reference data |

## E. Component Architecture

Unchanged components from prior rounds (Header, Footer, Logo, Button,
Card, Container, Section, PageHeader, CTABanner, TierCard,
HowItWorksSteps/Scroller, StatusBadge, ClientContentPlaceholder,
Reveal, CoverageDiagram, TierIcon) are all preserved. New this round:

| Component | Responsibility |
|---|---|
| `LoginForm` | Client-side login form, posts to `/api/auth/login`, redirects to dashboard on success |
| `dashboard/layout.tsx` | Protected shell: sidebar nav, redirects unauthenticated visitors to `/login` |
| `LogoutButton` | Posts to `/api/auth/logout`, clears session, redirects |
| `useSectionDraft` | Shared hook: loads a section's draft, tracks edits, exposes `saveDraft()`/`publish()` |
| `SaveBar` | Sticky draft/publish status bar with Save/Publish/Preview buttons, used on every editor page |
| `StringListEditor` | Reusable add/edit/remove list editor (used for About's approach/credentials) |
| `MediaUploader` | Image upload widget on the Media page |
| `dashboard/preview/[section]/page.tsx` | Renders a section's **draft** content using the real presentational components, behind a gold "PREVIEW — not published" banner |
| `Hero` | Homepage opening section — headline/CTA/photo panel with trust-pillar and founder badges, sits above `CinematicFilm` (see Section P) |
| `CinematicFilm` | Homepage scroll-driven photo sequence, replaces the old `House3D`/`BuildingStory` (see Section P) |

## F. Content Architecture

**Storage**: `node:sqlite`, one row per content section in a
`content_sections` table (`draft_json`, `published_json`,
`updated_at`, `published_at`). See `src/lib/db.ts`.

**Draft / publish flow**: every `get*Content()` call (used by public
pages) reads `published_json`. Every `get*Draft()` call (used by the
dashboard) reads `draft_json`. Saving in the dashboard writes only to
`draft_json` — the live site is unaffected until Publish is clicked,
which copies `draft_json` → `published_json`. Exactly one current
draft and one current published version are kept per section (no
deeper version history — this matches the brief's "don't over-engineer
version history unless simple and useful").

**Seeding**: on first run (`src/lib/seed.ts`), each section is
populated from its former `content/*.json` file (About, Services, How
It Works, Coverage Area, FAQ, Testimonials — unchanged content, just a
new home), plus three new DB-only sections seeded from the
previously-locked constants:
- `contact` (WhatsApp number, email) — now dashboard-editable, see
  Content Safety note below.
- `seo` (per-page title/meta description overrides) — starts empty
  (each page keeps its existing hardcoded default until overridden).
- `sample-report` (uploaded file path + note) — starts empty.

**CLIENT-EDITABLE content** (via `/dashboard`): About narrative/
approach/credentials, Services tier descriptions (not names), How It
Works step titles/descriptions, FAQ questions/answers, Testimonials
(add/edit/remove), Contact info (WhatsApp number, email), Sample
Report file, uploaded media, per-page SEO title/description.

**SYSTEM/BRAND CONSTANTS** (locked in `src/content/site.ts`, code —
never exposed in the dashboard): business name, tagline, site
navigation/sitemap, service tier **names** (WATCH/VERIFY/MANAGE),
Sample Report's fixed section labels and progress-assessment area
labels.

**Content Safety note**: this round makes WhatsApp number and contact
email dashboard-editable per an explicit new requirement. This is a
deliberate widening of what's editable versus an earlier round's
design (which kept these fully locked in code) — done because the
task explicitly asked for it. The dashboard's Contact Information page
carries a visible warning about the required WhatsApp digit format
(country code, no spaces) since the click-to-chat link is derived
automatically from whatever is typed there.

**No schema validation on save**: the content API accepts any JSON
matching the section's TypeScript shape by convention, not by runtime
schema validation. Since only the one authenticated client role can
reach these endpoints, the risk is limited to the client accidentally
saving malformed content (e.g. deleting a required field) — which
would then affect the *public* page rendering once published. This is
a known limitation, not a security hole; documented in Section N.

## G. Client-Management System

### Login flow

`CLIENT LOGIN → DASHBOARD → EDIT → SAVE DRAFT → PREVIEW → PUBLISH → LIVE`

- **Login page**: `/login`, redirects to `/dashboard` if already
  authenticated, redirects back to `/login` from any `/dashboard/*`
  route if not.
- **Credentials**: `CLIENT_USERNAME` + `CLIENT_PASSWORD_HASH`
  environment variables only. No account exists yet — see Part 1 /
  Section K for how to create one. Password hashed with `scrypt`
  (Node's built-in `crypto`), salt + hash stored together, never
  plaintext, never committed.
- **Session**: HMAC-signed cookie (`SESSION_SECRET` env var),
  `httpOnly`, `secure` in production, `sameSite: "lax"`, 12-hour
  expiry. Verified server-side on every dashboard page load and every
  mutation API call — never trusted from the client.
- **Single role today**: "client". The session payload already carries
  a `role` field and `verifyCredentials`/session helpers are
  role-agnostic, so an "admin" role could be layered on later without
  restructuring auth.

### Dashboard

`/dashboard` — sidebar with Overview, About, Services, How It Works,
FAQ, Testimonials, Sample Report, Images/Media, Contact Information,
SEO, plus "View website" and "Log out". Built to read like a content
tool, not a developer console — no JSON, no Git, no deployment
commands, no environment variables anywhere in the UI.

### Draft / Preview / Publish

Every content section page uses the same pattern (`useSectionDraft` +
`SaveBar`):
1. Edit fields in a normal form (text inputs, textareas, add/remove
   list items — never raw JSON).
2. **Save draft** — writes to the database's draft column only.
   Nothing on the live site changes.
3. **Preview** — opens `/dashboard/preview/<section>` (protected,
   requires login) rendering the *draft* content through the real
   page components, under a gold "PREVIEW — not published" banner.
4. **Publish** — saves the current draft (if not already saved) and
   copies it to the published column. The live site reflects it
   immediately (dynamic rendering, no rebuild/redeploy needed).

Verified end-to-end: edited About narrative → saved draft → confirmed
"Unpublished changes" badge → published → confirmed the edit appeared
on the live `/about` page via direct `curl`.

### Media & Sample Report uploads

`POST /api/dashboard/upload` (protected): validates MIME type
(`image/png`, `image/jpeg`, `image/webp` for media; those plus
`application/pdf` for reports), caps size at 10MB, generates a random
server-side filename (never trusts the client's filename), writes to
`public/uploads/media/` or `public/uploads/reports/`. Returns the
public URL, shown in the dashboard (not a raw technical path the
client has to interpret).

**Production note**: this writes to the local filesystem. That's fine
on a persistent Node server (this project's existing target
deployment) but **not** on a serverless/edge host with an ephemeral
filesystem — those would need object storage (S3, Vercel Blob, etc.)
instead. Not set up here since no such account/credentials exist; flag
this before choosing a serverless host.

## H. Official Logo, Favicon & Social-Share Image

All three official brand assets are integrated.

- **Logo**: `public/assets/logo/anchorline-logo.png` (integrated in an
  earlier round) — used in the header.
- **Favicon**: supplied as a presentation sheet
  (`anchorline-favicon-design(1).png`, showing multiple size mockups
  with labels). The clean, un-labelled icon was extracted from it
  (bottom-left "Transparent PNG" variant on the sheet), verified square
  with real alpha transparency, and used to generate:
  - `src/app/icon.png` (512×512) — Next.js file-convention icon
  - `src/app/apple-icon.png` (180×180)
  - `src/app/favicon.ico` (multi-size: 16/32/48)

  Next.js auto-generates the correct `<link rel="icon">` /
  `<link rel="apple-touch-icon">` tags from these files — no manual
  metadata needed. Verified: all three URLs return 200 and the
  browser-tab icon renders correctly.
- **Social-share (OG) image**: supplied as a presentation sheet with a
  "SOCIAL SHARE / OPEN GRAPH IMAGE, 1200×630" watermark label baked
  into the top of the file. The watermark was cropped out (it's a
  mockup artifact, not part of the intended graphic) and the remaining
  card — Anchorline logo, "Independent • Impartial • Informed",
  "Protecting your investment. From the ground up.", and the
  construction-site photo with branded hi-vis vests — was resized/
  letterboxed to the standard 1200×630px and saved as
  `public/assets/brand/og-image.png`. Wired into `openGraph.images`
  and `twitter.images` in the root layout metadata. Verified via curl
  that the meta tags reference it and the file returns 200.
- **Originals preserved, unaltered**: both supplied sheet files are
  kept as-is at `public/assets/brand/anchorline-favicon-design-original.png`
  and `anchorline-social-share-design-original.png`.

**Note on the OG image's baked-in copy**: the supplied graphic contains
its own marketing lines ("Protecting your investment. From the ground
up.", "Independent • Impartial • Informed") that differ slightly from
the brief's approved tagline and trust pillars. Since this is a
designed creative asset used only as a social-preview thumbnail (not
on-page content), it was used as supplied rather than edited — flagging
this for awareness, not treating it as a content violation.

## I. Contact System

Destination email now comes from the dashboard-editable Contact
Information section (with `CONTACT_TO_EMAIL` env var still available
as a testing-only override):

- **Fields**: Name, Email/Phone, Project Location, Project Stage, Tier
  of Interest, Message.
- **Endpoint**: `POST /api/contact`.
- **Validation**: server-side only trusted, honeypot, per-IP rate
  limiting (5/10 min).
- **Email provider**: Resend via `fetch()`, still **not connected to a
  real account** — no `RESEND_API_KEY`/`CONTACT_FROM_EMAIL` configured.
  Returns an honest 503 until they are.

## J. WhatsApp

Number and link are sourced from the dashboard's Contact Information
section (`getContactInfo()` + `whatsappHrefFor()`), not a hardcoded
constant. Appears in the same places as before: header (desktop +
mobile), footer, every page's closing CTA banner, and the Contact
page's dedicated panel. The `wa.me` link is derived by stripping
non-digit characters from whatever the client types as the
"displayed" number — the dashboard warns them to include the country
code with no spaces so the link stays correct.

## K. Environment Variables

| Variable | Purpose | Status |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production domain for sitemap/robots/OG/canonical | Not set — falls back to localhost |
| `RESEND_API_KEY` | Contact form email delivery | Not set — no account exists |
| `CONTACT_FROM_EMAIL` | Verified Resend sender address | Not set |
| `CONTACT_TO_EMAIL` | Optional test override of destination inbox | Not set (defaults to the dashboard-configured email) |
| `CLIENT_USERNAME` | Dashboard login username | **Not set — must be configured before the dashboard can be used** |
| `CLIENT_PASSWORD_HASH` | Dashboard login password, scrypt-hashed | **Not set** — generate with `node scripts/hash-password.mjs "the real password"` |
| `SESSION_SECRET` | Signs dashboard session cookies | **Not set** — generate with `openssl rand -hex 32` |

None of these have real values anywhere in this repository.

## L. SEO

Per-page metadata, JSON-LD, sitemap.xml/robots.txt generated from the
live nav list, plus: the dashboard's SEO section now lets the client
override title/description per page. **Not yet wired into
`generateMetadata()`** on the public pages — the dashboard collects
and stores these overrides, but the pages still render their original
hardcoded titles/descriptions. This is an honest gap: flagged in Known
Limitations, not silently left looking finished.

## M. Accessibility

Semantic HTML, keyboard nav, focus states, honeypot hidden accessibly,
`role="alert"` on form errors — all verified working. Login form and
dashboard forms use the same labeled-input pattern as the public
contact form.

## N. Security

- **Password storage**: scrypt-hashed, salted, never plaintext,
  never logged.
- **Session**: HMAC-SHA256 signed, `httpOnly` (inaccessible to page
  JS/XSS), `sameSite: "lax"` (mitigates CSRF on state-changing
  POST/PUT — cross-site POSTs don't carry a `lax` cookie), `secure` in
  production.
- **Timing-safe comparisons**: username and password checks both use
  `crypto.timingSafeEqual` to avoid timing side-channels.
- **Authorization**: every dashboard page and every
  `/api/dashboard/*` route independently verifies the session
  server-side (`getSession()` / `requireSessionResponse()`) — the
  dashboard layout check alone would not be sufficient if someone
  called the API routes directly, so each route checks for itself too.
- **Brute-force protection**: login endpoint rate-limited (5 attempts /
  10 minutes / IP), same mechanism as the contact form.
- **File uploads**: MIME-type allowlist, 10MB cap, server-generated
  random filenames (client-supplied filenames never touch the
  filesystem path).
- **Input handling**: content-mutation endpoints validate JSON
  parses and enforce a size cap (200KB); they do **not** validate the
  internal shape of each section against a schema — see Section F's
  Content Safety note for the accepted risk here (single trusted
  client role, worst case is self-inflicted malformed content, not a
  cross-user vulnerability).
- **Secrets**: read only in server-side modules
  (`src/lib/auth.ts`, API route handlers) — never referenced from any
  client component, never present in a browser bundle. All `.env*`
  gitignored except `.env.example` (empty placeholders only).
- **No XSS surface added**: all dashboard-authored content is rendered
  through React (auto-escaping); the one `dangerouslySetInnerHTML`
  usage (JSON-LD on the homepage) serializes trusted structured data,
  not user input.

## O. Performance

- Zero new npm dependencies (node:sqlite and crypto are Node built-ins).
- Dashboard pages are the only place with meaningfully more client-side
  JS (forms, upload widgets) — the public site's client-component
  footprint is Header, ContactForm, Hero, CinematicFilm,
  HowItWorksScroller, CoverageDiagram, Reveal, plus the
  LoginForm/LogoutButton/MediaUploader trio, all scoped to `/login` and
  `/dashboard`, never loaded on public pages. `CinematicFilm`'s photo
  set (~8MB desktop / ~3MB mobile across 22 active shots, from a pool
  of 33 processed) is the single heaviest addition to the homepage's
  payload — see Section P for the desktop/mobile variant split that
  mitigates this; `Hero` adds one further real photo (reused from the
  same set, `shot-31.jpg`, no extra asset).
- The site moved from fully static to dynamic rendering (see Section
  B) — a deliberate, necessary tradeoff for the CMS requirement, not
  an oversight. Pages are still lightweight (no heavy per-request
  computation beyond a couple of SQLite reads).

## P. Homepage Opening: Hero + Cinematic Intro Architecture

**Superseded the CSS-3D `House3D` construction box described in earlier
revisions of this document** — replaced by a scroll-driven,
photography sequence, which itself was later fronted by a real-photo
`Hero` section once the client supplied genuine site photography and a
layout reference. `House3D.tsx`, `BuildingIllustration.tsx`,
`BuildingStory.tsx`, the original `Hero.tsx`, and `useScrollProgress.ts`
were removed outright as fully superseded in an earlier round; nothing
else referenced them.

The homepage now opens with two components in sequence —
`src/components/sections/Hero.tsx` then
`src/components/sections/CinematicFilm.tsx`:

### Hero (headline + CTA + photo)

Layout rebuilt to match the structure of a client-supplied reference
clip (another agency's TikTok, showing a "two-part headline with a
gold-accented closing word + catchphrase line underneath + filled CTA
+ plain text-link CTA + full-width photo with a notched corner and
overlaid trust badges" template). Only the **structural pattern** was
reused; every word and image is Anchorline's own:

- Eyebrow: `business.location` + "Independent Construction Oversight".
- H1: `business.name` ("Anchorline Project Partners"), split on its
  last space so the closing word carries the gold accent — mirrors the
  reference's "Creating a Brighter Future / **Starting Today**"
  structure, with the client's real company name in that slot. This is
  the page's only `<h1>`.
- Catchphrase, directly under the H1 (the reference's small-paragraph
  slot): `business.tagline` — "Your eyes on the ground, wherever you
  are." — followed by the real `heroDescription` from
  `content/home.json` as supporting copy.
- Two CTAs: a filled gold "Get a Quote" button (`/contact`) and a
  plain underlined text link "See How It Works" (`/how-it-works`),
  mirroring the reference's "Book" / "Meet Us" pairing.
- Photo panel: asymmetric large-radius corners (`rounded-tl-[3rem]
  rounded-br-[3rem]`) approximating the reference's notched-corner
  photo shape, with the three real `trustPillars` as pill badges
  bottom-left and a "Founder-led · {business.principal}" badge
  bottom-right (both from `src/content/site.ts`) — not fabricated
  client-avatar/stat badges, since Anchorline has none to show
  honestly.
- **The photo is `shot-2.jpg`** (existing licensed/representative
  architecture photography already in `public/assets/film/`), **not**
  a frame from the client's Lovable reference video. That video is a
  phone recording of a laptop screen; the usable image area after
  cropping out the browser chrome/OS taskbar/"Activate Windows"
  watermark was only ~650×200px, with the video's own caption text
  baked into the pixels and heavy compression/motion-blur on top — not
  viable at the ~1600px width this panel renders at. `shot-2.jpg` was
  chosen as the closest clean, high-resolution match in style
  (concrete + timber-clad modern volume) already in the asset set.
  Real human/site photography was deliberately **not** used here
  either, per the same instruction that kept it out of CinematicFilm
  (see below) — it was moved to the About page instead.
- Caption under the photo states plainly it's illustrative
  architecture photography, not an actual Anchorline client project.

### LogoWatermark

`src/components/layout/LogoWatermark.tsx` — the official logo, fixed
at `top-20 right-4` (just under the sticky header) at 20% opacity,
`pointer-events-none`, rendered once in `(site)/layout.tsx` so it
persists across every public page without competing with the
header's WhatsApp/Get a Quote buttons or (on the homepage) with
CinematicFilm's own bottom-right HUD text.

### CinematicFilm (scroll-driven photo sequence)

Continues directly below the Hero. **Real photos of Anchorline's own
site visits are deliberately excluded from this sequence** — an
explicit instruction, on the reasoning that the film is a stylised,
illustrative piece and real site documentation belongs elsewhere (see
"About page real site visits" below). The film went through two
states this round: real Nile University site photos were tried here
first, then removed and the original licensed/representative photo
set (`shot-1.jpg`…`shot-22.jpg`) restored once that instruction landed
— `public/assets/film/shot-23.jpg`…`shot-33.jpg` (the 11 real photos)
are still on disk but no longer referenced by `film-shots.ts`; they're
used on the About page instead.

- **Captions realigned to the client's own reference build.** Rewatching
  the Lovable reference video end-to-end surfaced its exact chapter
  captions (visible on screen, not guessed): "RAW SITE — Surveyed
  ground, nothing yet", "WALLS & GLAZING", "FINISHING — Plaster,
  paint, fit-out", "ENTRANCE — Through the front door", and a progress
  rail reading SITE / FOUNDATION / STRUCTURE / FINISHING / INTERIOR /
  REVEAL. `film-shots.ts`'s existing captions already matched several
  of these closely (this project's `SHOTS` array was itself originally
  authored against the same reference in an earlier round); the
  remaining labels were updated to match exactly.
- **Opening title card restored.** It had been reduced to a bare
  scroll cue when the Hero was first added (to avoid duplicating the
  Hero's welcome). Rewatching the reference to its own ending showed it
  lands on a title card of its own — photo backdrop, "From Foundation
  to Finish" headline, wordmark, dot-separated line — before its
  scroll sequence begins. CinematicFilm's opening now mirrors that
  same structure (and mirrors its own pre-existing closing title,
  which already matched that pattern): headline (`<h2>`, since the
  Hero holds the page's one `<h1>`) + `business.name` +
  `trustPillars.join(" · ")` + "SCROLL TO BEGIN", over the first shot.
  The reduced-motion path's header uses the same structure.
- **Sequence data**: `src/lib/film-shots.ts` — a `SHOTS` array (21
  entries, back to the original count/order) mapping each photo to a
  Ken-Burns camera keyframe (`from`/`to` scale + x/y pan) and an act
  (`site` / `build` / `complete` / `interior`), ordered and keyframed
  so each shot's *ending* camera position sits near the next shot's
  *starting* position — the cross-dissolve then reads as one
  continuous move rather than a slideshow cut.
- **Interaction**: scroll position (via `getBoundingClientRect` on a
  tall `N × 85vh` wrapper with a `sticky` inner viewport — not scroll-
  jacking; normal page scroll drives it) maps to a continuous
  shot-space position, with an inertial `lerp` follow for a gimbal-like
  glide rather than a 1:1 scroll-to-frame snap.
- **Display font**: Fraunces (`--font-display`, loaded in
  `src/app/layout.tsx`) for the film's titles/captions only.
- **Two real bugs found and fixed during QA**, from the round that
  first built this component (ghost captions on the fade-out edge;
  bottom-of-viewport clipping on first paint) — unchanged this round,
  documented in full in git history.
- **Disclosure**: back to "Representative construction & interior
  photography, not an actual Anchorline client project." (both the HUD
  and reduced-motion paths) now that real photography isn't mixed in.
- Re-verified via Playwright across 375/1280/1440px plus a
  `prefers-reduced-motion: reduce` pass after every change this round:
  0 console errors, 0 horizontal overflow, exactly one `<h1>` on every
  route.
- **Known follow-up, not yet done**: no single stitched/edited video
  file of the finished/rendered house exists yet — only the client's
  own screen-recorded reference (not source footage) and four raw,
  unedited real site clips (now on the About page, see below). If a
  proper stitched video becomes available, a video-scrubbed variant of
  this component is the natural next step.

### About page: real site visits

`src/content/site-visits.ts` + a new section in `about/page.tsx`. The
11 real site photos and 4 real site video clips (with generated poster
frames) now live here instead of in the homepage film, captioned and
naming the real site (Nile University of Nigeria Senate Building,
Abuja) and clarifying Anchorline's role as the independent verifier,
not the contractor. Photos reuse the existing `shot-23.jpg`…
`shot-33.jpg` files; videos are new,
`public/assets/site-videos/site-visit-{1-4}.mp4` (~19MB total, native
`<video controls preload="none">`, no autoplay/streaming pipeline).

## P.1 Sample Report: Client-Only Gating + Interactive Tabs + Fictional Demo Data

`/sample-report` was rebuilt this round:

- **Client-only gating.** The gold-dashed "Client content required"
  placeholder (noting the real anonymised report is still pending from
  the client) previously showed to every visitor. It's now wrapped in
  `if (await getSession())` in the page's Server Component, so only a
  logged-in client sees it — public visitors see just the illustrative
  tabs. Verified by logging in with a locally-generated test password
  (`scripts/hash-password.mjs`), confirming the box appears, then
  confirming it's absent for an anonymous session.
- **Honest heading.** Now states plainly this is "only a similar
  version of what you'll get, not your actual report," naming the
  fictional demo project.
- **Fictional demo data**: `src/content/sample-report-demo.ts` — a
  fully invented project ("Agnese Corps Residence, Block C", developer
  "Agnese Corps Ltd.", diaspora client "J. Okafor", Abuja) with visit
  facts, a 6-area progress table, a milestone/cost timeline with a
  flagged variance, prioritised recommendations, and a next-visit date
  — all fictional, clearly disclosed, not derived from any real
  Anchorline engagement.
- **Interactive tabs**: `src/components/sections/SampleReportTabs.tsx`
  (client component) — one tab per `sampleReportSections` entry
  (Summary of Visit, Photographic/Video Documentation, Progress
  Assessment, Cost/Milestone Notes, Recommendations & Next Steps, Next
  Scheduled Visit), each with a **distinct layout**: facts sidebar,
  labelled media-slot grid, status table with percent-complete bars,
  milestone timeline, priority-tagged action list, and a dark date
  card. Accessible tab pattern (`role="tablist"/"tab"/"tabpanel"`,
  `aria-selected`/`aria-controls`). Photo/video documentation is shown
  as labelled placeholder slots (client said real report imagery is
  coming separately) rather than fabricated photos.

## Q. Testing & QA Performed

- `npm run lint` — clean.
- `npm run build` — clean (0 TypeScript errors), all routes compile,
  including the dashboard/API routes.
- Live browser testing (Playwright/Chromium) across 375/390/414/768/
  1280/1440px, 10 public routes + `/login`: 0 console errors, 0
  horizontal overflow, 0 broken images, exactly 1 `<h1>` per page.
- **Login flow**: unauthenticated `/dashboard` access redirects to
  `/login` (verified); valid login redirects to `/dashboard` (verified);
  logout clears the session (verified via subsequent redirect).
- **Content editing**: loaded the About draft, edited it, saved draft,
  confirmed the "Unpublished changes" indicator, clicked Publish,
  confirmed "Published — live now", then confirmed via direct `curl`
  that the edit appeared on the live `/about` page.
- **Route-group fix**: caught and fixed a real bug where the dashboard
  was rendering inside the public site's Header/Footer (duplicate,
  customer-facing nav above the CMS) — restructured into a `(site)`
  route group so the dashboard gets its own clean chrome; re-verified
  both the dashboard (now clean) and the public site (still correct)
  after the fix.
- **Favicon/OG**: verified all icon URLs return 200 and the correct
  `<link>`/`<meta>` tags are present in the rendered HTML.
- **Building sequence**: full-scroll screenshots at 1280px and 375px
  confirming all 9 stages render in order with no errors (from the
  round that first built the CSS-3D version, since superseded).
- Mobile dashboard screenshot confirms usable layout at 375px.
- **Hero + real-photo CinematicFilm** (this round): re-ran
  `npm run build` clean; Playwright across 375/1280/1440px plus a
  `prefers-reduced-motion: reduce` pass on the homepage — 0 console
  errors, 0 horizontal overflow, exactly one `<h1>` (in `Hero`, after
  downgrading `CinematicFilm`'s reduced-motion heading to `<h2>` to
  avoid a second one), correct trust/founder badges and real-photo
  caption on the Hero panel, correct disclosure text and act markers
  through the film sequence, both hero image and film shots load and
  render (including the rotated/cropped real photos) with no visible
  seams or watermark remnants.

## R. Remaining External Integrations

- **Email provider (Resend)**: no account/API key. Contact form is
  fully built and validated but cannot send real mail.
- **Client login credentials**: no `CLIENT_USERNAME`/
  `CLIENT_PASSWORD_HASH`/`SESSION_SECRET` are configured in any
  committed or persistent environment — the dashboard cannot be used
  until an operator sets these (Part 1, step 2).
- **Production domain**: not chosen, `NEXT_PUBLIC_SITE_URL` unset.
- **Object storage for uploads**: only needed if the eventual host is
  serverless/edge; not needed for a persistent Node server.

## S. Known Limitations

- **Dashboard cannot be used yet** — no login credentials configured
  in any real environment (by design; none were invented).
- **Email provider not connected** — contact form validates but can't
  send real mail yet.
- **Production domain not configured.**
- **SEO dashboard section not wired into page metadata yet** — the
  data model and UI exist, but public pages still use their original
  hardcoded titles/descriptions rather than reading the override.
- **No schema validation on content saves** — see Section F/N.
- **SQLite + local file uploads require a persistent-filesystem host**
  — won't work as-is on serverless/edge.
- **Client content still pending from the actual client**: final
  approved About/Services/How-It-Works copy (current text is the
  brief's own draft language), anonymised sample report, project
  photography, testimonials.
- **No AI-generated hero imagery** — the client asked for a "realistic
  and aesthetic" generated building image for the Hero panel; no
  image-generation tool was available in this session, and the
  candidate frame from the reference video was too low-resolution to
  use, so a clean licensed photo was used instead (see Section P).
- **No stitched video for the homepage film** — the client supplied
  four real, raw (unedited) site video clips, now shown on the About
  page, and a screen-recorded reference of a Lovable build (not
  reusable source footage), but no single stitched/edited video of a
  finished house. `CinematicFilm` stays photo-based; see Section P,
  "Known follow-up," for what a video variant would need.
- **Em dashes removed from user-visible copy only** — code comments
  still use them; only content the client/site visitors actually read
  was swept (see git log for the exact commit).

## T. Future Work

- Wire the SEO dashboard section into `generateMetadata()` on each
  public page.
- Optional admin role (auth already structured to support it).
- Object storage integration if/when a serverless host is chosen.
- Insights page — still explicitly optional/Phase 2 per the brief.
- Basic analytics — still nice-to-have, not implemented, would need a
  provider decision reported to the user first.

## U. Git Status

- **Branch**: `claude/anchorline-project-partners-rbz3iz`.
- **Push status**: `git push` still returns a 403 from GitHub for this
  session (same as every prior attempt on this project) — all work is
  committed locally only, ready to push once an org admin enables
  GitHub access for this session/app.
- **Latest changes** (most recent commit first): rebuilt `Hero.tsx` to
  match the client's reference layout precisely (two-part headline,
  catchphrase, notched photo panel, badges) and added `LogoWatermark`;
  removed real site photos from `CinematicFilm` per instruction and
  restored the original licensed photo set with captions realigned to
  the client's reference video; added a "Real site visits" section to
  About with the 11 real photos + 4 real videos; rebuilt
  `/sample-report` with client-only gating on the "content required"
  notice and an interactive tabbed fictional demo report; swept em
  dashes from all user-visible copy. Earlier in the same session: added
  the Hero section (first version, since revised), swapped real
  Nile University photos into the film (since reverted), restored the
  film's title card. See git log for the full, granular commit
  history — each of the above is its own commit with a detailed
  message.

## V. Handoff for the Next Operator

- **Run it locally first** — generate real credentials (Part 1),
  log into the dashboard, click through every section, and let the
  user review it before anything else.
- **Do not rebuild from scratch** — the codebase (site + CMS +
  building animation) is complete, passes lint/build, and has been
  QA'd; treat it as a working baseline.
- **Configure real services only when the user provides them** — Resend
  account, production domain, dashboard credentials. Never invent or
  stub in fake ones.
- **Deploy only when explicitly instructed.**
- **Push to GitHub once access is enabled** — the local commits are
  ready as-is.
- **If real footage arrives**: the four real site video clips
  currently sitting in the session's upload area
  (`VID-20260811-WA0041.mp4`, `VID-20260812-WA0007.mp4`,
  `VID-20260812-WA0044.mp4`, `VID-20260812-WA0045.mp4`) are not yet in
  the repo. If the client wants a video-scrubbed hero instead of the
  photo sequence, those clips (or a single stitched edit of them) are
  the real material to build it from — see Section P.
- **If a generated hero image arrives**: swap it into the single
  `<img src="/assets/film/shot-2.jpg">` in `Hero.tsx`.
- **If real report imagery/PDF arrives**: replace the labelled
  placeholder slots in `SampleReportTabs.tsx`'s documentation tab —
  the fictional "Agnese Corps" demo data stays as a permanent
  illustrative example either way, it isn't meant to be replaced by a
  real client's data.

## W. Final Status

```
CODEBASE:              COMPLETE
DESIGN:                 COMPLETE (cinematic direction, user-approved override)
LOGO / FAVICON / OG:     INTEGRATED, + persistent watermark on public pages
CLIENT CMS:               BUILT — credentials not yet configured
HOMEPAGE HERO + CINEMATIC INTRO:  HERO (reference layout, real copy, licensed photo) + 21-SHOT ILLUSTRATIVE SCROLL FILM
ABOUT PAGE:                         + real site-visit photo/video gallery (11 photos, 4 clips)
SAMPLE REPORT:                        REBUILT — client-only gating, interactive tabs, fictional demo data
QA:                                      PASSED
PRODUCTION BUILD:                           PASSED
EMAIL:                                        NOT CONNECTED
DASHBOARD LOGIN:                                NOT CONFIGURED (no credentials set)
DOMAIN:                                            NOT CONFIGURED
DEPLOYMENT:                                           NOT PERFORMED
CLIENT REVIEW:                                          PENDING
```
