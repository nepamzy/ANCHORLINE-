import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/portal-auth";
import { updateCustomerProfile } from "@/lib/portal-db";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  let body: { name?: unknown; phone?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please enter your full name." }, { status: 400 });
  }

  await updateCustomerProfile(session.customerId, { name, phone: phone || null });
  return NextResponse.json({ ok: true });
}
