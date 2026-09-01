import * as Sentry from "@sentry/nextjs";

// No-ops if the env var is unset — dev/local runs without an account
// configured don't need to send anything anywhere.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  // Errors only, not every request — this is a low-traffic marketing
  // site with a CMS, not something that needs full request tracing.
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
});
