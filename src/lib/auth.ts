import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Single-client-role authentication. No user table, no plaintext
 * passwords anywhere — credentials live only in environment variables
 * (CLIENT_USERNAME, CLIENT_PASSWORD_HASH). See scripts/hash-password.mjs
 * to generate CLIENT_PASSWORD_HASH from a real password; nothing here
 * invents or hardcodes a credential.
 *
 * Structured so an ADMIN role could be added later (verifyCredentials
 * takes a role-agnostic username/password pair; the session payload
 * already carries a `role` field, currently always "client").
 */

const SESSION_COOKIE = "anchorline_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET is not set. Generate one (e.g. `openssl rand -hex 32`) and add it to .env.local — see .env.example."
    );
  }
  return secret;
}

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")): string {
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

export function verifyCredentials(username: string, password: string): boolean {
  // .trim() on the *stored* env var values only — guards against a
  // trailing space/newline accidentally picked up when pasting a
  // credential into a dashboard env var field (a common real-world
  // paste artifact, e.g. from Windows Notepad or a terminal's
  // trailing newline). Never trims what the person actually typed
  // into the login form itself, so a password containing meaningful
  // leading/trailing characters still behaves exactly as typed.
  const expectedUsername = process.env.CLIENT_USERNAME?.trim();
  const expectedHash = process.env.CLIENT_PASSWORD_HASH?.trim();
  if (!expectedUsername || !expectedHash) {
    throw new Error(
      "CLIENT_USERNAME / CLIENT_PASSWORD_HASH are not configured. See .env.example and scripts/hash-password.mjs."
    );
  }
  // Constant-time username comparison too, so failure timing doesn't
  // leak whether the username alone was correct.
  const usernameOk =
    username.length === expectedUsername.length &&
    crypto.timingSafeEqual(Buffer.from(username), Buffer.from(expectedUsername));
  const passwordOk = verifyPassword(password, expectedHash);
  return usernameOk && passwordOk;
}

type SessionPayload = { u: string; role: "client"; exp: number };

function sign(data: string): string {
  return crypto.createHmac("sha256", getSessionSecret()).update(data).digest("base64url");
}

export function createSessionToken(username: string): string {
  const payload: SessionPayload = { u: username, role: "client", exp: Date.now() + SESSION_TTL_MS };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
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
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8")) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

/** Server Component / Route Handler helper — reads and verifies the session cookie. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE_NAME)?.value);
}
