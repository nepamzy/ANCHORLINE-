"use client";

import { useEffect } from "react";

/** Registers the service worker site-wide so the site is installable and the portal can receive push notifications. Silently no-ops in unsupported browsers. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Unsupported or blocked (e.g. private browsing) — install/push simply stay unavailable.
    });
  }, []);

  return null;
}
