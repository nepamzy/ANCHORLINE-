import fs from "node:fs";
import path from "node:path";

/**
 * Persistent storage for the client CMS: Cloudflare D1 (SQLite at the
 * edge), queried over Cloudflare's HTTP API.
 *
 * D1 has no direct "connect from a Vercel serverless function" driver
 * the way Postgres does — it's queried over plain HTTPS
 * (`POST /accounts/{account}/d1/database/{db}/query`), authenticated
 * with a scoped Cloudflare API token (D1:Edit). That's what this module
 * does: no new npm dependency, just fetch().
 *
 * Only ever called server-side (Server Components, Route Handlers —
 * never imported into "use client" files). The API token has D1-only
 * scope, nothing broader.
 *
 * Dev-only fallback: without CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN
 * / CLOUDFLARE_D1_DATABASE_ID (e.g. local development, or before those
 * are pasted into Vercel), every function below reads/writes a local
 * JSON file (data/content.json, gitignored) instead of throwing. Same
 * row shape, so nothing above this module changes either way. This path
 * is never reached once the real Cloudflare credentials are set — it
 * has no effect on production.
 */

function hasD1Credentials(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.CLOUDFLARE_API_TOKEN &&
      process.env.CLOUDFLARE_D1_DATABASE_ID
  );
}

async function d1Query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    }
  );

  const body = await res.json();
  if (!res.ok || !body.success) {
    const message = body.errors?.[0]?.message ?? `HTTP ${res.status}`;
    throw new Error(`[db] D1 query failed: ${message}`);
  }
  return (body.result?.[0]?.results ?? []) as T[];
}

type Row = {
  key: string;
  draft_json: unknown;
  published_json: unknown;
  updated_at: string;
  published_at: string | null;
};

type D1Row = {
  key: string;
  draft_json: string;
  published_json: string;
  updated_at: string;
  published_at: string | null;
};

function parseD1Row(row: D1Row): Row {
  return {
    key: row.key,
    draft_json: JSON.parse(row.draft_json),
    published_json: JSON.parse(row.published_json),
    updated_at: row.updated_at,
    published_at: row.published_at,
  };
}

// --- Dev-only local JSON file store -------------------------------------

const LOCAL_DB_FILE = path.join(process.cwd(), "data", "content.json");

function readLocalStore(): Record<string, Row> {
  try {
    const raw = fs.readFileSync(LOCAL_DB_FILE, "utf-8");
    return JSON.parse(raw) as Record<string, Row>;
  } catch {
    return {};
  }
}

function writeLocalStore(store: Record<string, Row>): void {
  fs.mkdirSync(path.dirname(LOCAL_DB_FILE), { recursive: true });
  fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(store, null, 2), "utf-8");
}

function getRowLocal(key: string): Row | null {
  return readLocalStore()[key] ?? null;
}

// --- Row access, D1 or local depending on configured credentials --------

async function getRow(key: string): Promise<Row | null> {
  if (!hasD1Credentials()) return getRowLocal(key);
  const rows = await d1Query<D1Row>("SELECT * FROM content_sections WHERE key = ?", [key]);
  return rows[0] ? parseD1Row(rows[0]) : null;
}

export async function seedSectionIfMissing(key: string, initial: unknown): Promise<void> {
  if (!hasD1Credentials()) {
    const store = readLocalStore();
    if (!store[key]) {
      const nowIso = new Date().toISOString();
      store[key] = { key, draft_json: initial, published_json: initial, updated_at: nowIso, published_at: null };
      writeLocalStore(store);
    }
    return;
  }
  const nowIso = new Date().toISOString();
  const json = JSON.stringify(initial);
  // INSERT ... ON CONFLICT DO NOTHING is idempotent, so concurrent cold
  // starts across serverless invocations can't race/duplicate a row.
  await d1Query(
    `INSERT INTO content_sections (key, draft_json, published_json, updated_at, published_at)
     VALUES (?, ?, ?, ?, NULL)
     ON CONFLICT(key) DO NOTHING`,
    [key, json, json, nowIso]
  );
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
  const nowIso = new Date().toISOString();
  if (!hasD1Credentials()) {
    const store = readLocalStore();
    const existing = store[key];
    store[key] = existing
      ? { ...existing, draft_json: value, updated_at: nowIso }
      : { key, draft_json: value, published_json: value, updated_at: nowIso, published_at: null };
    writeLocalStore(store);
    return;
  }
  const json = JSON.stringify(value);
  await d1Query(
    `INSERT INTO content_sections (key, draft_json, published_json, updated_at, published_at)
     VALUES (?, ?, ?, ?, NULL)
     ON CONFLICT(key) DO UPDATE SET draft_json = excluded.draft_json, updated_at = excluded.updated_at`,
    [key, json, json, nowIso]
  );
}

export async function publishSection(key: string): Promise<void> {
  if (!hasD1Credentials()) {
    const store = readLocalStore();
    const row = store[key];
    if (!row) throw new Error(`Cannot publish unknown section: ${key}`);
    row.published_json = row.draft_json;
    row.published_at = new Date().toISOString();
    writeLocalStore(store);
    return;
  }
  const row = await getRow(key);
  if (!row) throw new Error(`Cannot publish unknown section: ${key}`);
  await d1Query(
    `UPDATE content_sections SET published_json = draft_json, published_at = ? WHERE key = ?`,
    [new Date().toISOString(), key]
  );
}

export async function getSectionMeta(
  key: string
): Promise<{ updatedAt: string | null; publishedAt: string | null; hasUnpublishedChanges: boolean }> {
  const row = await getRow(key);
  if (!row) return { updatedAt: null, publishedAt: null, hasUnpublishedChanges: false };
  return {
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
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
