import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  /* config options here */
};

// withSentryConfig no-ops cleanly (uploads nothing, wraps nothing
// meaningfully) when SENTRY_AUTH_TOKEN isn't set — source-map upload for
// readable stack traces is a nice-to-have wired in later, not required
// for error capture itself to work.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
});
