import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  // Session replay is overkill for this site's traffic/complexity —
  // error capture is the actual ask, not screen recording visitors.
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
