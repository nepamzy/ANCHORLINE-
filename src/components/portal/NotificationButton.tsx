"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64Safe);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

type Status = "unsupported" | "default" | "granted" | "denied" | "subscribing";

/** Push-notification opt-in for the portal header. Requests browser permission, subscribes to the service worker's push manager, and registers the subscription with the server — a real opt-in, not a decorative bell. */
export function NotificationButton() {
  const [status, setStatus] = useState<Status>("default");
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  useEffect(() => {
    // One-time browser-API feature detection on mount (SSR can't know
    // Notification support or permission state) — not derived state.
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator) || !vapidKey) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time feature detection, not derived state
      setStatus("unsupported");
      return;
    }
    setStatus(Notification.permission === "granted" ? "granted" : Notification.permission === "denied" ? "denied" : "default");
  }, [vapidKey]);

  if (status === "unsupported") return null;

  async function handleClick() {
    if (status === "denied") return;

    if (status === "granted") {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await fetch("/api/portal/push/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          });
          await subscription.unsubscribe();
        }
      } catch {
        // Best-effort — fall through to reflecting the toggled-off state regardless.
      }
      setStatus("default");
      return;
    }

    setStatus("subscribing");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "default");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey!) as BufferSource,
      });

      await fetch("/api/portal/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });
      setStatus("granted");
    } catch {
      setStatus("default");
    }
  }

  const label =
    status === "granted"
      ? "Notifications on — click to turn off"
      : status === "denied"
        ? "Notifications blocked — enable them in your browser's site settings"
        : "Allow notifications";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === "subscribing" || status === "denied"}
      title={label}
      aria-label={label}
      className={`relative hidden h-9 w-9 items-center justify-center rounded-full border transition-colors sm:inline-flex ${
        status === "granted"
          ? "border-gold-500 bg-gold-100/60 text-gold-600"
          : "border-line text-slate hover:text-navy-900"
      } ${status === "denied" ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z M10 18a2 2 0 0 0 4 0"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {status === "denied" && (
          <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        )}
      </svg>
      {status === "default" && (
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-gold-500" aria-hidden="true" />
      )}
    </button>
  );
}
