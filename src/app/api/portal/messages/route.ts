import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/portal-auth";
import { createMessage, listMessagesForCustomer, ensurePortalSchema } from "@/lib/portal-db";

export const runtime = "nodejs";

export async function GET() {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  await ensurePortalSchema();
  const messages = await listMessagesForCustomer(session.customerId);
  return NextResponse.json({ ok: true, messages });
}

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  let body: { body?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text) {
    return NextResponse.json({ ok: false, error: "Message can't be empty." }, { status: 400 });
  }
  if (text.length > 4000) {
    return NextResponse.json({ ok: false, error: "Message is too long." }, { status: 400 });
  }

  await ensurePortalSchema();
  const message = await createMessage({ customerId: session.customerId, sender: "customer", body: text });
  return NextResponse.json({ ok: true, message });
}
