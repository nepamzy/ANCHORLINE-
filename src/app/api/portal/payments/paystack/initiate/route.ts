import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/portal-auth";
import { getInvoiceById, getProjectById, getCustomerById } from "@/lib/portal-db";
import { hasPaystackCredentials, initializePaystackTransaction } from "@/lib/payments/paystack";

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
  if (invoice.currency !== "NGN") {
    return NextResponse.json({ ok: false, error: "This invoice isn't in Naira." }, { status: 400 });
  }

  if (!hasPaystackCredentials()) {
    console.error("[payments] Paystack not configured — set PAYSTACK_SECRET_KEY.");
    return NextResponse.json(
      { ok: false, error: "Online payment isn't connected yet. Please message us for payment instructions." },
      { status: 503 }
    );
  }

  const customer = await getCustomerById(session.customerId);
  if (!customer) return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });

  const origin = new URL(request.url).origin;
  const reference = `${invoice.id}-${Date.now()}`;

  try {
    const { authorizationUrl } = await initializePaystackTransaction({
      email: customer.email,
      amountKobo: Math.round(invoice.amount * 100),
      reference,
      callbackUrl: `${origin}/api/portal/payments/paystack/callback`,
      metadata: { invoiceId: invoice.id, customerId: customer.id },
    });
    return NextResponse.json({ ok: true, url: authorizationUrl });
  } catch (err) {
    console.error("[payments] Paystack initialize failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: "Could not start payment. Please try again." }, { status: 502 });
  }
}
