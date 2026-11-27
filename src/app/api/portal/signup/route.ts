import { NextResponse } from "next/server";
import { createCustomer } from "@/lib/portal-db";
import { hashPassword, createCustomerSessionToken, CUSTOMER_SESSION_COOKIE_NAME } from "@/lib/portal-auth";
import { isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(`portal-signup:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  let body: { name?: unknown; email?: unknown; password?: unknown; phone?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please enter your full name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ ok: false, error: "Password must be at least 8 characters." }, { status: 400 });
  }

  let customer;
  try {
    customer = await createCustomer({ name, email, passwordHash: hashPassword(password), phone: phone || null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create account.";
    return NextResponse.json({ ok: false, error: message }, { status: 409 });
  }

  const token = createCustomerSessionToken(customer.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CUSTOMER_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
