import { NextResponse } from "next/server";
import { getInvoiceById, markInvoicePaidByProvider } from "@/lib/portal-db";
import { constructStripeWebhookEvent } from "@/lib/payments/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

/**
 * Optional hardening on top of the success_url-based verification:
 * once this URL and STRIPE_WEBHOOK_SECRET are registered in the Stripe
 * dashboard, a payment still gets marked paid even if the customer
 * closes the tab before the redirect completes. Safe to receive with
 * no webhook registered — this route then just returns its
 * configuration error and the redirect flow alone still works.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = constructStripeWebhookEvent(rawBody, signature);
  } catch (err) {
    console.error("[payments] Stripe webhook rejected:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoiceId = session.metadata?.invoiceId;
    if (invoiceId) {
      const invoice = await getInvoiceById(invoiceId);
      if (invoice) await markInvoicePaidByProvider(invoiceId, "stripe", session.id);
    }
  }

  return NextResponse.json({ ok: true });
}
