import { NextResponse } from "next/server";
import { getCustomerSession, hashPassword, verifyPassword } from "@/lib/portal-auth";
import { getCustomerById, updateCustomerPassword } from "@/lib/portal-db";
import { isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  if (isRateLimited(`portal-password:${session.customerId}`)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  let body: { currentPassword?: unknown; newPassword?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (newPassword.length < 8) {
    return NextResponse.json({ ok: false, error: "New password must be at least 8 characters." }, { status: 400 });
  }

  const customer = await getCustomerById(session.customerId);
  if (!customer || !verifyPassword(currentPassword, customer.password_hash)) {
    return NextResponse.json({ ok: false, error: "Current password is incorrect." }, { status: 401 });
  }

  await updateCustomerPassword(customer.id, hashPassword(newPassword));
  return NextResponse.json({ ok: true });
}
