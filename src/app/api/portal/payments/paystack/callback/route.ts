import { NextResponse } from "next/server";
import { getInvoiceById, markInvoicePaidByProvider } from "@/lib/portal-db";
import { verifyPaystackTransaction } from "@/lib/payments/paystack";

export const runtime = "nodejs";

/** Paystack redirects the customer's browser here after checkout — the reference is this flow's source of truth, re-verified server-to-server before anything is marked paid. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference") ?? url.searchParams.get("trxref");
  const redirectTo = (status: string) => NextResponse.redirect(new URL(`/portal/payments?status=${status}`, url.origin));

  if (!reference) return redirectTo("failed");

  try {
    const result = await verifyPaystackTransaction(reference);
    const invoiceId = typeof result.metadata.invoiceId === "string" ? result.metadata.invoiceId : "";
    const invoice = invoiceId ? await getInvoiceById(invoiceId) : null;

    if (!invoice || result.status !== "success" || result.amountKobo !== Math.round(invoice.amount * 100)) {
      return redirectTo("failed");
    }

    await markInvoicePaidByProvider(invoice.id, "paystack", reference);
    return redirectTo("success");
  } catch (err) {
    console.error("[payments] Paystack callback verification failed:", err instanceof Error ? err.message : err);
    return redirectTo("failed");
  }
}
