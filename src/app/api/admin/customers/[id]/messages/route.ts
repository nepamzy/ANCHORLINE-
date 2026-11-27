import { NextResponse } from "next/server";
import { requireSessionResponse } from "@/lib/dashboard-auth";
import { createMessage, listMessagesForCustomer } from "@/lib/portal-db";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireSessionResponse();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const messages = await listMessagesForCustomer(id);
  return NextResponse.json({ ok: true, messages });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireSessionResponse();
  if (unauthorized) return unauthorized;

  const { id } = await params;

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

  const message = await createMessage({ customerId: id, sender: "admin", body: text });
  return NextResponse.json({ ok: true, message });
}
