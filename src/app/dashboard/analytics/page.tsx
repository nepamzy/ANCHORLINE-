import {
  hasAnalyticsCredentials,
  getVisitTotals,
  getDailyTimeseries,
  getBreakdown,
  type TimeseriesPoint,
  type BreakdownRow,
} from "@/lib/vercel-analytics";

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function formatChange(current: number, previous: number): { text: string; positive: boolean } | null {
  if (previous === 0) return null;
  const pct = ((current - previous) / previous) * 100;
  return { text: `${pct >= 0 ? "+" : ""}${pct.toFixed(0)}%`, positive: pct >= 0 };
}

function StatCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: { text: string; positive: boolean } | null;
}) {
  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <p className="text-sm font-medium text-slate">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-bold text-navy-900">{value}</p>
        {change && (
          <span className={`text-sm font-semibold ${change.positive ? "text-emerald-600" : "text-red-600"}`}>
            {change.text}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-slate">vs. previous 30 days</p>
    </div>
  );
}

function TrendChart({ points }: { points: TimeseriesPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.pageviews));
  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <p className="font-semibold text-navy-900">Pageviews, last 30 days</p>
      <div className="mt-4 flex h-40 items-end gap-1">
        {points.map((p) => (
          <div key={p.timestamp} className="group relative flex-1">
            <div
              className="w-full rounded-t bg-navy-800/80 transition-colors group-hover:bg-gold-600"
              style={{ height: `${Math.max(2, (p.pageviews / max) * 100)}%` }}
            />
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-navy-900 px-2 py-1 text-xs text-white group-hover:block">
              {new Date(p.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })}:{" "}
              {p.pageviews} views, {p.visitors} visitors
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BreakdownCard({ title, rows }: { title: string; rows: BreakdownRow[] }) {
  const max = Math.max(1, ...rows.map((r) => r.visitors));
  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <p className="font-semibold text-navy-900">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-slate">No data yet for this period.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {rows.map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="truncate text-navy-900">{row.label}</span>
                <span className="ml-2 shrink-0 text-slate">{row.visitors} visitors</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-navy-50">
                <div
                  className="h-1.5 rounded-full bg-gold-600"
                  style={{ width: `${(row.visitors / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function AnalyticsPage() {
  if (!hasAnalyticsCredentials()) {
    return (
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Analytics</p>
        <h1 className="mt-1 text-2xl font-bold text-navy-900">Website Analytics</h1>
        <div className="mt-6 max-w-xl rounded-card border border-line bg-paper p-6">
          <p className="font-semibold text-navy-900">Not connected yet</p>
          <p className="mt-2 text-sm text-slate">
            Analytics needs a Vercel API token to read visitor data. Add{" "}
            <code className="rounded bg-navy-50 px-1 py-0.5">VERCEL_API_TOKEN</code> to the site&apos;s
            environment variables (Vercel dashboard → Settings → Environment Variables), then reload this
            page.
          </p>
        </div>
      </div>
    );
  }

  const today = isoDaysAgo(0);
  const start30 = isoDaysAgo(30);
  const start60 = isoDaysAgo(60);

  const [current, previous, daily, pages, referrers, countries, devices] = await Promise.all([
    getVisitTotals(start30, today),
    getVisitTotals(start60, start30),
    getDailyTimeseries(start30, today),
    getBreakdown("route", start30, today),
    getBreakdown("referrerHostname", start30, today),
    getBreakdown("country", start30, today),
    getBreakdown("deviceType", start30, today),
  ]);

  const viewsPerVisitor = current.visitors > 0 ? (current.pageviews / current.visitors).toFixed(1) : "0";
  const prevViewsPerVisitor = previous.visitors > 0 ? previous.pageviews / previous.visitors : 0;

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Analytics</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900">Website Analytics</h1>
      <p className="mt-2 max-w-xl text-slate">
        Real visitor data from the live site, last 30 days. Updates automatically as people browse
        anchorline.site.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Visitors" value={current.visitors.toLocaleString()} change={formatChange(current.visitors, previous.visitors)} />
        <StatCard label="Pageviews" value={current.pageviews.toLocaleString()} change={formatChange(current.pageviews, previous.pageviews)} />
        <StatCard label="Pages per visitor" value={viewsPerVisitor} change={formatChange(Number(viewsPerVisitor), prevViewsPerVisitor)} />
      </div>

      <div className="mt-4">
        <TrendChart points={daily} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <BreakdownCard title="Top pages" rows={pages} />
        <BreakdownCard title="Where visitors come from" rows={referrers} />
        <BreakdownCard title="Countries" rows={countries} />
        <BreakdownCard title="Devices" rows={devices} />
      </div>
    </div>
  );
}
