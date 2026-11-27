import { listCustomers, listProjectsForCustomer, ensurePortalSchema } from "@/lib/portal-db";

export default async function DashboardCustomersPage() {
  await ensurePortalSchema();
  const customers = await listCustomers();
  const withCounts = await Promise.all(
    customers.map(async (c) => ({ ...c, projectCount: (await listProjectsForCustomer(c.id)).length }))
  );

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Client Portal</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900">Customers</h1>
      <p className="mt-2 max-w-xl text-slate">Everyone who has created a portal account.</p>

      {withCounts.length === 0 ? (
        <p className="mt-8 rounded-card border border-line bg-paper p-6 text-slate">
          No customer accounts yet.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-card border border-line bg-paper p-5 shadow-card">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-slate">
                <th className="pb-2 pr-4 font-semibold">Name</th>
                <th className="pb-2 pr-4 font-semibold">Email</th>
                <th className="pb-2 pr-4 font-semibold">Phone</th>
                <th className="pb-2 pr-4 font-semibold">Projects</th>
                <th className="pb-2 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {withCounts.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="py-3 pr-4 font-medium text-navy-900">{c.name}</td>
                  <td className="py-3 pr-4 text-slate">{c.email}</td>
                  <td className="py-3 pr-4 text-slate">{c.phone ?? "—"}</td>
                  <td className="py-3 pr-4 text-slate">{c.projectCount}</td>
                  <td className="py-3 text-slate">
                    {new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
