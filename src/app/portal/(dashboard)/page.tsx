import Link from "next/link";
import { getCustomerSession } from "@/lib/portal-auth";
import {
  getCustomerById,
  listProjectsForCustomer,
  listRequestsForCustomer,
  listInvoicesForCustomer,
} from "@/lib/portal-db";
import { StatusPill } from "@/components/portal/StatusPill";

function formatAmount(amount: number, currency: string): string {
  const symbol = currency === "USD" ? "$" : "₦";
  return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const REQUEST_TYPE_LABEL: Record<string, string> = {
  new_project: "New project booking",
  service_request: "Service request",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PortalOverviewPage() {
  const session = await getCustomerSession();
  const customer = session ? await getCustomerById(session.customerId) : null;
  if (!customer) return null;

  const [projects, requests, invoices] = await Promise.all([
    listProjectsForCustomer(customer.id),
    listRequestsForCustomer(customer.id),
    listInvoicesForCustomer(customer.id),
  ]);

  const openRequests = requests.filter((r) => r.status !== "Completed");
  const firstName = customer.name.split(" ")[0];

  const outstandingByCurrency = invoices
    .filter((i) => i.status === "Unpaid")
    .reduce<Record<string, number>>((acc, i) => {
      acc[i.currency] = (acc[i.currency] ?? 0) + i.amount;
      return acc;
    }, {});
  const outstandingLabel =
    Object.keys(outstandingByCurrency).length === 0
      ? "₦0.00"
      : Object.entries(outstandingByCurrency)
          .map(([currency, amount]) => formatAmount(amount, currency))
          .join(" + ");

  const stats = [
    { label: "Your projects", value: String(projects.length) },
    { label: "Open requests", value: String(openRequests.length) },
    { label: "Outstanding balance", value: outstandingLabel },
    { label: "Member since", value: formatDate(customer.created_at) },
  ];

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Overview</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">Welcome back, {firstName}.</h1>
      <p className="mt-2 max-w-xl text-slate">
        Here&apos;s a summary of your account with Anchorline Project Partners.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-card border border-line bg-paper p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-navy-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-card border border-line bg-paper p-6 shadow-card">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-navy-900">Recent activity</p>
            <Link href="/portal/requests" className="text-sm font-semibold text-navy-800 hover:text-navy-900">
              View all →
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="mt-6 rounded-control border border-dashed border-line p-6 text-center">
              <p className="font-medium text-navy-900">No activity yet</p>
              <p className="mt-1 text-sm text-slate">
                Place a request to book a new project or ask us about an existing one.
              </p>
              <Link
                href="/portal/requests"
                className="mt-4 inline-flex items-center justify-center rounded-control bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 hover:brightness-95"
              >
                + New Request
              </Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {requests.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-navy-900">{REQUEST_TYPE_LABEL[r.type] ?? r.type}</p>
                    <p className="mt-0.5 line-clamp-1 text-slate">{r.message}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusPill status={r.status} />
                    <p className="mt-1 text-xs text-slate">{formatDate(r.created_at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-card border border-line bg-navy-950 p-6 text-paper shadow-card">
          <p className="font-display text-lg font-semibold">Need something?</p>
          <p className="mt-2 text-sm text-paper/70">
            Book a new project or ask us about one you already have — we&apos;ll follow up directly.
          </p>
          <Link
            href="/portal/requests"
            className="mt-5 inline-flex items-center justify-center rounded-control bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 hover:brightness-95"
          >
            + New Request
          </Link>
        </div>
      </div>
    </div>
  );
}
