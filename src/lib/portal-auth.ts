import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hashPassword as scryptHash } from "./auth";

/**
 * Customer-portal authentication: real sign-up, a real password, a
 * real session — separate from auth.ts's single admin login (which
 * this codebase calls the "client" role; that's Anchorline, the site
 * owner, not the people booking projects through the portal). Same
 * scrypt + HMAC-signed-cookie approach, different cookie and a
 * per-customer id instead of a fixed username.
 */

const SESSION_COOKIE = "anchorline_customer_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET is not set. Generate one (e.g. `openssl rand -hex 32`) and add it to .env.local — see .env.example."
    );
  }
  return secret;
}

export const hashPassword = scryptHash;

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

type CustomerSessionPayload = { customerId: string; exp: number };

function sign(data: string): string {
  return crypto.createHmac("sha256", getSessionSecret()).update(data).digest("base64url");
}

export function createCustomerSessionToken(customerId: string): string {
  const payload: CustomerSessionPayload = { customerId, exp: Date.now() + SESSION_TTL_MS };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifyCustomerSessionToken(token: string | undefined | null): CustomerSessionPayload | null {
  if (!token) return null;
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const expectedSignature = sign(data);
  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8")) as CustomerSessionPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const CUSTOMER_SESSION_COOKIE_NAME = SESSION_COOKIE;

/** Server Component / Route Handler helper — reads and verifies the customer session cookie. */
export async function getCustomerSession(): Promise<CustomerSessionPayload | null> {
  const store = await cookies();
  return verifyCustomerSessionToken(store.get(CUSTOMER_SESSION_COOKIE_NAME)?.value);
}

/** Guard for portal API route handlers. Returns null if authorized, else a 401 response. */
export async function requireCustomerSessionResponse() {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  }
  return null;
}
