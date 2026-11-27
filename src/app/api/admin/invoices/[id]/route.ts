import { NextResponse } from "next/server";
import { requireSessionResponse } from "@/lib/dashboard-auth";
import { setInvoiceStatus } from "@/lib/portal-db";

export const runtime = "nodejs";

const VALID_STATUSES = ["Unpaid", "Paid"] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireSessionResponse();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  let body: { status?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const status = typeof body.status === "string" ? body.status : "";
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json({ ok: false, error: "Unknown status." }, { status: 400 });
  }

  await setInvoiceStatus(id, status as (typeof VALID_STATUSES)[number]);
  return NextResponse.json({ ok: true });
}
