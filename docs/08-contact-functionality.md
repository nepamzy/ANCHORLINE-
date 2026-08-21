# Phase 8 — Contact & Conversion Functionality

## What's implemented

- `POST /api/contact` (`src/app/api/contact/route.ts`), Node runtime.
- `ContactForm.tsx` now submits via `fetch` and shows real `idle` /
  `submitting` / `success` / `error` states — no state claims success
  unless the API actually returned `{ ok: true }`.

### Validation

Server-side (never trusts the client): all fields required except the
honeypot; `tier` must be one of `WATCH` / `VERIFY` / `MANAGE` / `Not sure
yet`; every field is trimmed, stripped of newlines (prevents email
header injection), and capped at 2000 characters. Client-side `required`
attributes are a UX nicety only, not the enforcement point.

### Spam protection

- **Honeypot**: hidden `company` field, visually and from screen readers
  (off-screen positioning + `aria-hidden`, `tabIndex={-1}`). A filled
  honeypot returns a fake success without sending an email — bots get no
  signal that they were caught.
- **Rate limiting**: `src/lib/rate-limit.ts`, 5 requests / 10 minutes per
  IP, in-memory. Documented in-file as a "basic" measure appropriate for
  a single-instance host, not a distributed limiter — flagging this as
  something to revisit if hosting changes (see Phase 2 architecture doc).

### Destination email

Defaults to `alprojectpartners@gmail.com` (the brief-specified address,
from the locked `business.contactEmail` constant) unless
`CONTACT_TO_EMAIL` is explicitly set in the environment for testing.
Never hard-coded twice — single source of truth in `src/content/site.ts`.

### Email provider — decision required

**No email provider account exists yet.** The route is built against
**Brevo**'s HTTP API via a plain `fetch()` call (no new npm dependency),
because it has the simplest integration and a usable free tier, but
**this has not been set up with real credentials** — I have none to
enter, and creating a paid/vendor account is a business decision, not a
technical one.

Until `BREVO_API_KEY` and `CONTACT_FROM_EMAIL` are set (see
`.env.example`), the endpoint fully validates, rate-limits, and rejects
spam correctly, then returns a clear `503` with the message "Enquiry
could not be emailed right now — please contact us directly via WhatsApp
or email instead," which the form surfaces honestly to the visitor. It
does **not** pretend to have sent anything.

**What the client needs to decide/provide**: a Brevo account (or
confirm a different provider — the route would need adjusting, but the
validation/honeypot/rate-limit layer is provider-agnostic) and a verified
sending domain for `CONTACT_FROM_EMAIL`. Until a domain is verified with
the provider, Brevo will only deliver to the account owner's own
address — a real launch needs the domain step regardless of provider
choice.

### Security

- `BREVO_API_KEY` is read server-side only (`route.ts` runs on the
  server; nothing client-side references it) — never shipped to the
  browser bundle.
- No secrets committed: `.env.example` documents the required variables
  with empty values; `.gitignore` excludes all `.env*` except the
  example file.
- Structured JSON error responses only — no stack traces or internal
  detail returned to the client; failures are logged server-side via
  `console.error` for debugging.

### WhatsApp

Unchanged — `wa.me/2348067570941`, present on every page (header, footer,
every page's closing CTA, and the Contact page's equally-weighted panel).
Verified working (see Phase 9 QA below) in the deployed dev server.
