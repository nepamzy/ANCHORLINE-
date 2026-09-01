"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Root-level error boundary — catches anything that escapes every
 * other error boundary in the tree. Reports to Sentry, then shows a
 * plain apology page (this replaces the entire <html>, so it can't
 * reuse the normal site chrome/design tokens).
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ marginTop: "0.75rem", color: "#555" }}>
          We&apos;ve been notified and are looking into it. Please try again shortly.
        </p>
      </body>
    </html>
  );
}
