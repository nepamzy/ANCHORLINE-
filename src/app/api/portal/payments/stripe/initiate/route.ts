import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/portal-auth";
import { getInvoiceById, getProjectById, getCustomerById } from "@/lib/portal-db";
import { hasStripeCredentials, createStripeCheckoutSession } from "@/lib/payments/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  let body: { invoiceId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const invoiceId = typeof body.invoiceId === "string" ? body.invoiceId : "";
  const invoice = invoiceId ? await getInvoiceById(invoiceId) : null;
  if (!invoice) return NextResponse.json({ ok: false, error: "Invoice not found." }, { status: 404 });

  const project = await getProjectById(invoice.project_id);
  if (!project || project.customer_id !== session.customerId) {
    return NextResponse.json({ ok: false, error: "Invoice not found." }, { status: 404 });
  }
  if (invoice.status === "Paid") {
    return NextResponse.json({ ok: false, error: "This invoice is already paid." }, { status: 400 });
  }
  if (invoice.currency !== "USD") {
    return NextResponse.json({ ok: false, error: "This invoice isn't in US dollars." }, { status: 400 });
  }

  if (!hasStripeCredentials()) {
    console.error("[payments] Stripe not configured — set STRIPE_SECRET_KEY.");
    return NextResponse.json(
      { ok: false, error: "Online payment isn't connected yet. Please message us for payment instructions." },
      { status: 503 }
    );
  }

  const customer = await getCustomerById(session.customerId);
  if (!customer) return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });

  const origin = new URL(request.url).origin;

  try {
    const { url } = await createStripeCheckoutSession({
      amountCents: Math.round(invoice.amount * 100),
      description: invoice.description,
      customerEmail: customer.email,
      successUrl: `${origin}/api/portal/payments/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/portal/payments?status=cancelled`,
      metadata: { invoiceId: invoice.id, customerId: customer.id },
    });
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("[payments] Stripe checkout session failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: "Could not start payment. Please try again." }, { status: 502 });
  }
}
