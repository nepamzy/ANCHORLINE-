import * as webpush from "web-push";
import { listPushSubscriptionsForCustomer, deletePushSubscription } from "./portal-db";

/**
 * Real web push (not a stub): the VAPID key pair was generated once with
 * `webpush.generateVAPIDKeys()` and lives in Vercel env vars, not in this
 * repo. No third-party push service account is needed — browsers accept
 * any self-generated VAPID key pair for authenticating the sender.
 */
export function hasPushCredentials(): boolean {
  return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

let configured = false;
function ensureConfigured(): void {
  if (configured) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:alprojectpartners@gmail.com",
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  configured = true;
}

/** Fire-and-forget: pushes to every device the customer has subscribed on, dropping subscriptions the browser reports as gone (404/410). Never throws — a notification failure must never break the request that triggered it (a new message, report, or invoice). */
export async function notifyCustomer(
  customerId: string,
  payload: { title: string; body: string; url?: string }
): Promise<void> {
  if (!hasPushCredentials()) return;
  ensureConfigured();

  const subscriptions = await listPushSubscriptionsForCustomer(customerId);
  if (subscriptions.length === 0) return;

  const json = JSON.stringify({ url: "/portal", ...payload });

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          json
        );
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await deletePushSubscription(sub.endpoint).catch(() => {});
        } else {
          console.error("[push] Failed to deliver notification:", err instanceof Error ? err.message : err);
        }
      }
    })
  );
}
