import { NextResponse } from "next/server";
import { getSession } from "./auth";

/** Guard for dashboard API route handlers. Returns null if authorized, else a 401 response. */
export async function requireSessionResponse() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  }
  return null;
}
