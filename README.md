# Anchorline Project Partners — Website

Next.js + TypeScript + Tailwind CSS site for Anchorline Project Partners
(independent construction oversight for diaspora clients), with a real
client-managed CMS (login → edit → draft → preview → publish) and a
code-generated CSS 3D construction visualization.

**Full reference — read this first:** [`ANCHORLINE-HANDOFF.md`](./ANCHORLINE-HANDOFF.md).
It covers quick-start setup, the dashboard/CMS, environment variables,
architecture, security, QA, known limitations, and what still needs to be
connected to real-world services (email provider, production domain,
client-supplied content and photography). `docs/` holds the original
client brief and phase-by-phase design documentation.

## Quick start

```bash
npm install
node scripts/hash-password.mjs "your-password"   # generates CLIENT_PASSWORD_HASH
```

Set `CLIENT_USERNAME`, `CLIENT_PASSWORD_HASH`, and `SESSION_SECRET`
(`openssl rand -hex 32`) in `.env.local` — see the Handoff doc's
Environment Variables section for the full list and production notes.

```bash
npm run dev      # http://localhost:3000 — public site + /login + /dashboard
npm run build    # production build
npm run lint     # eslint
```

## Structure

- `src/app/(site)/` — public pages (Home, About, Services, How It Works, FAQ, …)
- `src/app/dashboard/` — client CMS (protected)
- `src/app/login/` — dashboard login
- `src/lib/db.ts` — content persistence (`node:sqlite`)
- `src/components/motion/House3D.tsx` — the CSS 3D construction visualization
- `docs/client-brief/` — authoritative client brief (source of truth)
