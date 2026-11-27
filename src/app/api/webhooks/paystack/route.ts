import { NextResponse } from "next/server";
import { getInvoiceById, markInvoicePaidByProvider } from "@/lib/portal-db";
import { verifyPaystackWebhookSignature } from "@/lib/payments/paystack";

export const runtime = "nodejs";

/**
 * Optional hardening on top of the redirect-based callback: once this
 * URL is registered in the Paystack dashboard, a payment still gets
 * marked paid even if the customer closes the tab before the redirect
 * completes. Safe to receive with no webhook registered — Paystack
 * simply never calls it, and the redirect flow alone still works.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string; metadata?: { invoiceId?: string } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (event.event === "charge.success") {
    const invoiceId = event.data?.metadata?.invoiceId;
    const reference = event.data?.reference;
    if (invoiceId && reference) {
      const invoice = await getInvoiceById(invoiceId);
      if (invoice) await markInvoicePaidByProvider(invoiceId, "paystack", reference);
    }
  }

  return NextResponse.json({ ok: true });
}
