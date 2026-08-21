import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Persistent storage for the client CMS: Supabase Postgres.
 *
 * Replaces the earlier node:sqlite implementation. That approach only
 * works on a host with a persistent, writable local filesystem —
 * Vercel's serverless functions don't provide one, so an on-disk
 * SQLite file would not reliably survive between invocations (see
 * git history / handoff for the original design and its documented
 * limitation). This module keeps the exact same shape (one row per
 * content section, holding both the current draft and the currently
 * published/live version) on a real, always-on Postgres database
 * instead, so nothing above this file (src/lib/content.ts,
 * src/lib/seed.ts, the dashboard/API routes) needs to know storage
 * changed beyond awaiting these functions, which are now async.
 *
 * Only ever called server-side (Server Components, Route Handlers —
 * never imported into "use client" files). Uses the Supabase
 * service_role key, which bypasses Row Level Security by design.
 * `content_sections` has RLS enabled with zero policies (see the
 * migration), so it's unreachable via the public/anon key even if
 * this module were ever mistakenly imported into client code.
 */

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set. See .env.example."
    );
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

type Row = {
  key: string;
  draft_json: unknown;
  published_json: unknown;
  updated_at: string;
  published_at: string | null;
};

async function getRow(key: string): Promise<Row | null> {
  const { data, error } = await getClient()
    .from("content_sections")
    .select("*")
    .eq("key", key)
    .maybeSingle();
  if (error) throw new Error(`[db] getRow(${key}) failed: ${error.message}`);
  return (data as Row | null) ?? null;
}

export async function seedSectionIfMissing(key: string, initial: unknown): Promise<void> {
  // Idempotent via upsert + ignoreDuplicates, so concurrent cold
  // starts across serverless invocations can't race/duplicate a row
  // (there's no shared in-process "already seeded" flag to rely on
  // the way there was with the old single-process SQLite version).
  const { error } = await getClient()
    .from("content_sections")
    .upsert(
      { key, draft_json: initial, published_json: initial },
      { onConflict: "key", ignoreDuplicates: true }
    );
  if (error) throw new Error(`[db] seedSectionIfMissing(${key}) failed: ${error.message}`);
}

export async function getPublished<T>(key: string, fallback: T): Promise<T> {
  const row = await getRow(key);
  if (!row) return fallback;
  return row.published_json as T;
}

export async function getDraft<T>(key: string, fallback: T): Promise<T> {
  const row = await getRow(key);
  if (!row) return fallback;
  return row.draft_json as T;
}

export async function saveDraft(key: string, value: unknown): Promise<void> {
  const existing = await getRow(key);
  const nowIso = new Date().toISOString();
  if (existing) {
    const { error } = await getClient()
      .from("content_sections")
      .update({ draft_json: value, updated_at: nowIso })
      .eq("key", key);
    if (error) throw new Error(`[db] saveDraft(${key}) update failed: ${error.message}`);
  } else {
    const { error } = await getClient()
      .from("content_sections")
      .insert({ key, draft_json: value, published_json: value, updated_at: nowIso, published_at: null });
    if (error) throw new Error(`[db] saveDraft(${key}) insert failed: ${error.message}`);
  }
}

export async function publishSection(key: string): Promise<void> {
  const row = await getRow(key);
  if (!row) throw new Error(`Cannot publish unknown section: ${key}`);
  const { error } = await getClient()
    .from("content_sections")
    .update({ published_json: row.draft_json, published_at: new Date().toISOString() })
    .eq("key", key);
  if (error) throw new Error(`[db] publishSection(${key}) failed: ${error.message}`);
}

export async function getSectionMeta(
  key: string
): Promise<{ updatedAt: string | null; publishedAt: string | null; hasUnpublishedChanges: boolean }> {
  const row = await getRow(key);
  if (!row) return { updatedAt: null, publishedAt: null, hasUnpublishedChanges: false };
  return {
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
    // draft_json/published_json come back as already-parsed JS values
    // (jsonb, not raw TEXT like the old SQLite columns), so compare
    // by re-stringifying rather than a raw string comparison.
    hasUnpublishedChanges: JSON.stringify(row.draft_json) !== JSON.stringify(row.published_json),
  };
}

export const ALL_SECTION_KEYS = [
  "home",
  "about",
  "services",
  "how-it-works",
  "coverage-area",
  "faq",
  "testimonials",
  "contact",
  "seo",
  "sample-report",
] as const;

export type SectionKey = (typeof ALL_SECTION_KEYS)[number];
