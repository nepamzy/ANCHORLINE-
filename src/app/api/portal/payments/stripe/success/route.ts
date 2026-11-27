import { NextResponse } from "next/server";
import { getInvoiceById, markInvoicePaidByProvider } from "@/lib/portal-db";
import { retrieveStripeCheckoutSession } from "@/lib/payments/stripe";

export const runtime = "nodejs";

/** Stripe's success_url, carrying the Checkout Session id — re-verified server-to-server before marking anything paid. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const redirectTo = (status: string) => NextResponse.redirect(new URL(`/portal/payments?status=${status}`, url.origin));

  if (!sessionId) return redirectTo("failed");

  try {
    const session = await retrieveStripeCheckoutSession(sessionId);
    const invoiceId = session.metadata?.invoiceId;
    const invoice = invoiceId ? await getInvoiceById(invoiceId) : null;

    if (!invoice || session.payment_status !== "paid" || session.amount_total !== Math.round(invoice.amount * 100)) {
      return redirectTo("failed");
    }

    await markInvoicePaidByProvider(invoice.id, "stripe", session.id);
    return redirectTo("success");
  } catch (err) {
    console.error("[payments] Stripe success verification failed:", err instanceof Error ? err.message : err);
    return redirectTo("failed");
  }
}
