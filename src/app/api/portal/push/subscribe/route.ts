import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/portal-auth";
import { savePushSubscription, ensurePortalSchema } from "@/lib/portal-db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  let body: { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const endpoint = typeof body.endpoint === "string" ? body.endpoint : "";
  const p256dh = typeof body.keys?.p256dh === "string" ? body.keys.p256dh : "";
  const auth = typeof body.keys?.auth === "string" ? body.keys.auth : "";

  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ ok: false, error: "Invalid subscription." }, { status: 400 });
  }

  await ensurePortalSchema();
  await savePushSubscription({ customerId: session.customerId, endpoint, p256dh, auth });
  return NextResponse.json({ ok: true });
}
