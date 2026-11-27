import crypto from "node:crypto";

/**
 * Paystack integration (NGN invoices) — the hosted-checkout redirect
 * flow, not the inline popup, so the client only ever needs a URL to
 * send the browser to.
 *
 * Requires PAYSTACK_SECRET_KEY (see .env.example). Routes check
 * hasPaystackCredentials() first and return a clear "not configured"
 * error instead of throwing when it's unset — same pattern as the
 * contact form's Brevo check.
 */

const PAYSTACK_BASE = "https://api.paystack.co";

export function hasPaystackCredentials(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  return key;
}

export async function initializePaystackTransaction(input: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}): Promise<{ authorizationUrl: string; reference: string }> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });

  const body = await res.json();
  if (!res.ok || !body.status) {
    throw new Error(body.message || "Paystack could not start this transaction.");
  }
  return { authorizationUrl: body.data.authorization_url, reference: body.data.reference };
}

export async function verifyPaystackTransaction(reference: string): Promise<{
  status: string;
  amountKobo: number;
  metadata: Record<string, unknown>;
}> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${getSecretKey()}` },
  });

  const body = await res.json();
  if (!res.ok || !body.status) {
    throw new Error(body.message || "Paystack could not verify this transaction.");
  }
  return {
    status: body.data.status,
    amountKobo: body.data.amount,
    metadata: body.data.metadata ?? {},
  };
}

/** Paystack signs webhook bodies with HMAC-SHA512 of the secret key against the raw request body. */
export function verifyPaystackWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signatureHeader) return false;
  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  return (
    expected.length === signatureHeader.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader))
  );
}
