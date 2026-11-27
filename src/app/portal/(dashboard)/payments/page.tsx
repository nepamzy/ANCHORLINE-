import Link from "next/link";
import { getCustomerSession } from "@/lib/portal-auth";
import { listInvoicesForCustomer } from "@/lib/portal-db";
import { StatusPill } from "@/components/portal/StatusPill";

function formatAmount(amount: number, currency: string): string {
  const symbol = currency === "USD" ? "$" : "₦";
  return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PortalPaymentsPage() {
  const session = await getCustomerSession();
  if (!session) return null;

  const invoices = await listInvoicesForCustomer(session.customerId);
  const unpaid = invoices.filter((i) => i.status === "Unpaid");
  const outstandingByCurrency = unpaid.reduce<Record<string, number>>((acc, i) => {
    acc[i.currency] = (acc[i.currency] ?? 0) + i.amount;
    return acc;
  }, {});

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Payments</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">Payments</h1>
      <p className="mt-2 max-w-xl text-slate">Your invoices across all projects.</p>

      {invoices.length === 0 ? (
        <div className="mt-8 rounded-card border border-dashed border-line bg-paper p-10 text-center">
          <p className="font-medium text-navy-900">No invoices yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate">
            We&apos;ll issue an invoice here as soon as one is due for one of your projects.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {Object.keys(outstandingByCurrency).length === 0 ? (
              <div className="rounded-card border border-line bg-paper p-5 shadow-card sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate">Outstanding balance</p>
                <p className="mt-2 text-2xl font-bold text-status-ontrack">All settled</p>
              </div>
            ) : (
              Object.entries(outstandingByCurrency).map(([currency, amount]) => (
                <div key={currency} className="rounded-card border border-line bg-paper p-5 shadow-card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate">
                    Outstanding balance ({currency})
                  </p>
                  <p className="mt-2 text-2xl font-bold text-navy-900">{formatAmount(amount, currency)}</p>
                </div>
              ))
            )}
          </div>

          {unpaid.length > 0 && (
            <div className="mt-6 rounded-control border border-gold-500/40 bg-gold-100/60 p-4 text-sm text-navy-900">
              Online payment isn&apos;t connected yet — for any unpaid invoice below, message us in{" "}
              <Link href="/portal/messages" className="font-semibold text-navy-800 underline hover:text-navy-900">
                Messages
              </Link>{" "}
              and we&apos;ll confirm payment instructions.
            </div>
          )}

          <div className="mt-6 rounded-card border border-line bg-paper p-6 shadow-card">
            <p className="font-semibold text-navy-900">Invoice history</p>
            <ul className="mt-4 divide-y divide-line">
              {invoices.map((inv) => (
                <li key={inv.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-medium text-navy-900">{inv.description}</p>
                    <Link
                      href={`/portal/projects/${inv.project_id}`}
                      className="text-xs text-slate hover:text-navy-900"
                    >
                      {inv.project_name}
                    </Link>
                    <p className="text-xs text-slate">{formatDate(inv.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-navy-900">{formatAmount(inv.amount, inv.currency)}</p>
                    <StatusPill status={inv.status} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
