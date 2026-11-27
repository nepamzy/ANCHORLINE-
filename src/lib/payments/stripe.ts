import Stripe from "stripe";

/**
 * Stripe integration (USD invoices, for diaspora clients) — Stripe
 * Checkout, a hosted payment page, same "give the client a URL"
 * contract as the Paystack helper.
 *
 * Requires STRIPE_SECRET_KEY (see .env.example); STRIPE_WEBHOOK_SECRET
 * is optional and only needed once a webhook endpoint is registered in
 * the Stripe dashboard. Routes check hasStripeCredentials() first.
 */

let client: Stripe | null = null;

export function hasStripeCredentials(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function getClient(): Stripe {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured.");
  client = new Stripe(key);
  return client;
}

export async function createStripeCheckoutSession(input: {
  amountCents: number;
  description: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
}): Promise<{ url: string }> {
  const session = await getClient().checkout.sessions.create({
    mode: "payment",
    customer_email: input.customerEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: input.description },
          unit_amount: input.amountCents,
        },
        quantity: 1,
      },
    ],
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: input.metadata,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return { url: session.url };
}

export async function retrieveStripeCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return getClient().checkout.sessions.retrieve(sessionId);
}

/** Verifies the webhook signature and parses the event — throws if STRIPE_WEBHOOK_SECRET isn't set or the signature is invalid. */
export function constructStripeWebhookEvent(rawBody: string, signatureHeader: string | null): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not configured.");
  if (!signatureHeader) throw new Error("Missing Stripe-Signature header.");
  return getClient().webhooks.constructEvent(rawBody, signatureHeader, secret);
}
