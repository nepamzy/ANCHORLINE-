import { NextResponse } from "next/server";
import { CUSTOMER_SESSION_COOKIE_NAME } from "@/lib/portal-auth";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CUSTOMER_SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
