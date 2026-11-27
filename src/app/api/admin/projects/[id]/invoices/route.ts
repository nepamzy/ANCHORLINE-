import { NextResponse } from "next/server";
import { requireSessionResponse } from "@/lib/dashboard-auth";
import { createInvoice } from "@/lib/portal-db";

export const runtime = "nodejs";

const VALID_CURRENCIES = ["NGN", "USD"] as const;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireSessionResponse();
  if (unauthorized) return unauthorized;

  const { id: projectId } = await params;

  let body: { description?: unknown; amount?: unknown; currency?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const description = typeof body.description === "string" ? body.description.trim() : "";
  const amount = typeof body.amount === "number" ? body.amount : Number(body.amount);
  const currency = typeof body.currency === "string" ? body.currency : "NGN";

  if (!description) {
    return NextResponse.json({ ok: false, error: "Please describe what this invoice is for." }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ ok: false, error: "Please enter a valid amount." }, { status: 400 });
  }
  if (!VALID_CURRENCIES.includes(currency as (typeof VALID_CURRENCIES)[number])) {
    return NextResponse.json({ ok: false, error: "Unknown currency." }, { status: 400 });
  }

  const invoice = await createInvoice({
    projectId,
    description,
    amount,
    currency: currency as (typeof VALID_CURRENCIES)[number],
  });
  return NextResponse.json({ ok: true, invoice });
}
