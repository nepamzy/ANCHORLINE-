# Phase 7 — Content & Editable Areas

## Decision made this phase

Phase 2 flagged CMS choice (git-based vs. a hosted headless CMS like
Sanity) as a decision needing user/client confirmation before
implementation — it affects cost, vendor dependency, and the editing
workflow the client is trained on. **No external CMS account or service
has been created** — doing so would mean inventing credentials/config
that don't exist.

What's implemented instead is the **content layer** that either path
builds on: routine prose extracted out of components and into
plain JSON files at `/content/*.json`, loaded by `src/lib/content.ts`.
This is the git-based approach from the Phase 2 recommendation, in its
simplest form (edit JSON, commit, deploy) — with no added dependency and
no vendor account required for it to work today.

**Still requiring a decision**: whether to put a non-technical editing
UI on top of these files (e.g. Decap CMS, which reads/writes the same
JSON via a browser admin screen and a Git backend) or move to a hosted
CMS instead. Either is a small follow-on step once the client confirms
their preference and, for Decap, how they want to authenticate (GitHub
login is simplest, no extra cost).

## What's editable now (client content required list, unchanged from Phase 1)

| File | Powers |
|---|---|
| `content/home.json` | Home hero description, trust-strip positioning statements |
| `content/about.json` | About narrative, approach bullets, Principal Consultant credentials |
| `content/services.json` | Tier `forWhom`/`includes` text (tier **names** stay locked in code — see below) |
| `content/how-it-works.json` | The 5 step titles/descriptions |
| `content/coverage-area.json` | Coverage Area page copy |
| `content/faq.json` | FAQ questions/answers |
| `content/testimonials.json` | Testimonials list — currently `{ "items": [] }`, renders the honest placeholder until populated |

Editing any of the above and redeploying is the entire workflow — no
code changes needed, and TypeScript will catch a malformed JSON file
(wrong shape) at build time rather than shipping broken content silently.

## What's deliberately NOT editable via content JSON

Kept in `src/content/site.ts` (code) instead, per the brief's own lock
list (Section 34, Change Control) — these should never change via a
routine content edit:

- Business identity: name, tagline, WhatsApp number, contact email
- Site navigation / sitemap
- Service tier **names** (WATCH / VERIFY / MANAGE)
- Sample Report structure and progress-assessment area labels (this is
  the report's fixed format, not prose — see Section 13 of the brief)

## Images

No client photography has been supplied yet (Phase 1 finding, still
open). `public/assets/` is the drop-in location — `logo/`, `reports/`,
`photos/` per its README. Nothing in the current pages hot-links or
references placeholder stock imagery, so there's nothing to "swap out"
later; supplying files there and referencing them via `next/image` is
the entire remaining step once the client provides them.

## Logo

**Official logo asset still required.** The header continues to use the
Phase 3/4 text-based lockup (`src/components/layout/Logo.tsx`); no
change was needed or made this phase, per Section 7.4 of this phase's
instructions.

## Sample Report / Testimonials status

- **Sample Report**: real anonymised report not yet supplied — existing
  clearly-labeled placeholder and illustrative (non-real) status table
  preserved unchanged.
- **Testimonials**: `content/testimonials.json` has `items: []`. The
  Testimonials page now renders real entries automatically the moment
  approved testimonials are added to that file — until then it shows
  the same honest "no approved testimonials yet" placeholder as before,
  now data-driven instead of hard-coded.
