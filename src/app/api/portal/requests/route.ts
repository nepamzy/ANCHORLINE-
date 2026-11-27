import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/portal-auth";
import { createRequest, listRequestsForCustomer, ensurePortalSchema } from "@/lib/portal-db";

export const runtime = "nodejs";

const VALID_TYPES = ["new_project", "service_request"] as const;

export async function GET() {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  await ensurePortalSchema();
  const requests = await listRequestsForCustomer(session.customerId);
  return NextResponse.json({ ok: true, requests });
}

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  let body: { type?: unknown; projectId?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const type = typeof body.type === "string" ? body.type : "";
  const projectId = typeof body.projectId === "string" && body.projectId ? body.projectId : null;
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    return NextResponse.json({ ok: false, error: "Unknown request type." }, { status: 400 });
  }
  if (!message || message.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Please describe your request in at least 10 characters." },
      { status: 400 }
    );
  }
  if (message.length > 4000) {
    return NextResponse.json({ ok: false, error: "Message is too long." }, { status: 400 });
  }

  await ensurePortalSchema();
  const created = await createRequest({
    customerId: session.customerId,
    projectId,
    type: type as (typeof VALID_TYPES)[number],
    message,
  });
  return NextResponse.json({ ok: true, request: created });
}
