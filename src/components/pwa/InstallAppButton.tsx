"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari's own non-standard flag
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/**
 * "Download app" / install button. Chrome/Edge/Android fire
 * `beforeinstallprompt`, which we capture and replay on click. iOS
 * Safari never fires that event, so there we show a one-time "Add to
 * Home Screen" instruction instead of hiding the feature entirely.
 */
export function InstallAppButton({ className = "" }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    // One-time browser-API feature detection on mount (SSR can't know
    // display-mode or user agent) — not state derived from props/state.
    if (isStandalone()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time feature detection, not derived state
      setInstalled(true);
      return;
    }
    if (isIOS()) {
      setEligible(true);
    }

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setEligible(true);
    }
    function onInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || !eligible) return null;

  async function handleClick() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferredPrompt(null);
      return;
    }
    // iOS: no native prompt exists, so surface the manual steps instead.
    setShowIOSHint((v) => !v);
  }

  return (
    <div className="relative">
      <button type="button" onClick={handleClick} className={className}>
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
          <path
            d="M12 4v11m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Download App
      </button>

      {showIOSHint && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-card border border-line bg-paper p-4 text-left text-xs text-slate shadow-lg">
          <p className="font-semibold text-navy-900">Install on iPhone/iPad</p>
          <p className="mt-1.5">
            Tap the Share icon <span aria-hidden>􀈂</span> in Safari, then choose{" "}
            <span className="font-medium text-navy-900">&ldquo;Add to Home Screen&rdquo;</span>.
          </p>
          <button
            type="button"
            onClick={() => setShowIOSHint(false)}
            className="mt-3 text-xs font-semibold text-navy-800 underline"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
