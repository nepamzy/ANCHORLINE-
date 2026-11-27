import { getCustomerSession } from "@/lib/portal-auth";
import { listProjectsForCustomer, listRequestsForCustomer } from "@/lib/portal-db";
import { StatusPill } from "@/components/portal/StatusPill";
import { NewRequestForm } from "@/components/portal/NewRequestForm";

const REQUEST_TYPE_LABEL: Record<string, string> = {
  new_project: "New project booking",
  service_request: "Service request",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PortalRequestsPage() {
  const session = await getCustomerSession();
  if (!session) return null;

  const [projects, requests] = await Promise.all([
    listProjectsForCustomer(session.customerId),
    listRequestsForCustomer(session.customerId),
  ]);

  const stats = [
    { label: "Total requests", value: requests.length },
    { label: "In progress", value: requests.filter((r) => r.status !== "Completed").length },
    { label: "Completed", value: requests.filter((r) => r.status === "Completed").length },
  ];

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Requests</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">Submit and track your requests</h1>
      <p className="mt-2 max-w-xl text-slate">
        Book a new project or ask us about an existing one. We&apos;ll follow up directly once we see it.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-card border border-line bg-paper p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-navy-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-card border border-line bg-paper p-6 shadow-card">
          <p className="font-semibold text-navy-900">Your requests</p>
          {requests.length === 0 ? (
            <p className="mt-4 text-sm text-slate">You haven&apos;t placed any requests yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-slate">
                    <th className="pb-2 pr-4 font-semibold">Date</th>
                    <th className="pb-2 pr-4 font-semibold">Type</th>
                    <th className="pb-2 pr-4 font-semibold">Details</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id} className="border-b border-line last:border-0">
                      <td className="py-3 pr-4 whitespace-nowrap text-slate">{formatDate(r.created_at)}</td>
                      <td className="py-3 pr-4 whitespace-nowrap text-navy-900">
                        {REQUEST_TYPE_LABEL[r.type] ?? r.type}
                      </td>
                      <td className="py-3 pr-4 max-w-xs text-slate">
                        <span className="line-clamp-2">{r.message}</span>
                      </td>
                      <td className="py-3">
                        <StatusPill status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <NewRequestForm projects={projects} />
      </div>
    </div>
  );
}
