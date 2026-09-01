import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

// Captures errors thrown inside Server Components / route handlers that
// Next.js's own error boundary machinery intercepts before a normal
// try/catch would see them. No-ops safely if NEXT_PUBLIC_SENTRY_DSN is
// unset (Sentry.init below is never called, so there's nothing to send to).
export const onRequestError = Sentry.captureRequestError;
