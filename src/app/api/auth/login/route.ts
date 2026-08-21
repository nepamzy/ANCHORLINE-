import { NextResponse } from "next/server";
import { createSessionToken, verifyCredentials, SESSION_COOKIE_NAME } from "@/lib/auth";
import { isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(`login:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "Username and password are required." }, { status: 400 });
  }

  let valid: boolean;
  try {
    valid = verifyCredentials(username, password);
  } catch (err) {
    console.error("[auth] Login misconfigured:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, error: "Login is not configured on this server yet." },
      { status: 503 }
    );
  }

  if (!valid) {
    return NextResponse.json({ ok: false, error: "Incorrect username or password." }, { status: 401 });
  }

  let token: string;
  try {
    token = createSessionToken(username);
  } catch (err) {
    console.error("[auth] Session misconfigured:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: "Login is not configured on this server yet." }, { status: 503 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  return res;
}
