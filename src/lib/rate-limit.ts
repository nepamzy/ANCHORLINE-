/**
 * Minimal in-memory rate limiter for the contact endpoint.
 *
 * Scope note: this is "basic spam protection" per the brief, not a
 * production-grade distributed limiter — state is per Node process,
 * so it resets on redeploy and does not share state across multiple
 * instances. Sufficient for a low-traffic consultancy site on a
 * single-instance host; revisit if hosting moves to a
 * multi-instance/serverless-per-request platform.
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}
