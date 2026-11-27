import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/portal-auth";
import { deletePushSubscription, ensurePortalSchema } from "@/lib/portal-db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  let body: { endpoint?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const endpoint = typeof body.endpoint === "string" ? body.endpoint : "";
  if (!endpoint) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  await ensurePortalSchema();
  await deletePushSubscription(endpoint);
  return NextResponse.json({ ok: true });
}
