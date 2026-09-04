/**
 * Real visitor/pageview data for the dashboard's Analytics page, pulled
 * from Vercel Web Analytics — the same tracking already wired into
 * src/app/layout.tsx via @vercel/analytics/next. That package only
 * collects data; this file is what reads it back out over Vercel's
 * REST API so it can be shown inside the CMS.
 *
 * Requires VERCEL_API_TOKEN (see .env.example). VERCEL_PROJECT_ID and
 * VERCEL_TEAM_ID identify this project on Vercel — not secret, so they
 * default to the real anchorline- project/team here rather than
 * needing to be configured separately.
 */

const VERCEL_API_BASE = "https://api.vercel.com";
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || "prj_2m0lblUzDPTX5Z8eZ81xghmd0XrT";
const TEAM_ID = process.env.VERCEL_TEAM_ID || "team_RHUx6BsrXqLesoYPOHOQrnPQ";

export function hasAnalyticsCredentials(): boolean {
  return Boolean(process.env.VERCEL_API_TOKEN);
}

async function query<T>(path: string, params: Record<string, string | number | undefined>): Promise<T> {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) throw new Error("VERCEL_API_TOKEN is not configured.");

  const url = new URL(`${VERCEL_API_BASE}${path}`);
  url.searchParams.set("projectId", PROJECT_ID);
  url.searchParams.set("teamId", TEAM_ID);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Vercel analytics request failed (${res.status}): ${body}`);
  }
  return res.json() as Promise<T>;
}

export type VisitTotals = { pageviews: number; visitors: number };

export type TimeseriesPoint = { timestamp: string; pageviews: number; visitors: number };

export type BreakdownRow = { label: string; pageviews: number; visitors: number };

/** Total pageviews + unique visitors for a date range. */
export async function getVisitTotals(since: string, until: string): Promise<VisitTotals> {
  const json = await query<{ data: VisitTotals }>("/v1/query/web-analytics/visits/count", { since, until });
  return json.data;
}

/** Daily pageviews + visitors across a date range, for a trend chart. */
export async function getDailyTimeseries(since: string, until: string): Promise<TimeseriesPoint[]> {
  const json = await query<{ data: TimeseriesPoint[] }>("/v1/query/web-analytics/visits/aggregate", {
    since,
    until,
    by: "day",
    limit: 100,
  });
  return json.data;
}

const DIMENSION_KEY: Record<string, string> = {
  route: "route",
  referrerHostname: "referrerHostname",
  country: "country",
  deviceType: "deviceType",
  browserName: "browserName",
  osName: "osName",
};

/** Top values for a single dimension (route, country, device, etc.) over a date range. */
export async function getBreakdown(
  dimension: keyof typeof DIMENSION_KEY,
  since: string,
  until: string,
  limit = 8
): Promise<BreakdownRow[]> {
  const key = DIMENSION_KEY[dimension];
  const json = await query<{ data: Record<string, string | number>[] }>(
    "/v1/query/web-analytics/visits/aggregate",
    { since, until, by: key, limit }
  );
  return json.data.map((row) => ({
    label: String(row[key] ?? "") || "(direct / unknown)",
    pageviews: Number(row.pageviews) || 0,
    visitors: Number(row.visitors) || 0,
  }));
}
