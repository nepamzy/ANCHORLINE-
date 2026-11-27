import { listAllRequests, ensurePortalSchema } from "@/lib/portal-db";
import { RequestRow } from "./RequestRow";

export default async function DashboardRequestsPage() {
  await ensurePortalSchema();
  const requests = await listAllRequests();

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Client Portal</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900">Requests</h1>
      <p className="mt-2 max-w-xl text-slate">
        Bookings and service requests placed by clients through the portal. Creating a project here links it
        to the client&apos;s account.
      </p>

      {requests.length === 0 ? (
        <p className="mt-8 rounded-card border border-line bg-paper p-6 text-slate">No requests yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-card border border-line bg-paper p-5 shadow-card">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-slate">
                <th className="pb-2 pr-4 font-semibold">Date</th>
                <th className="pb-2 pr-4 font-semibold">Client</th>
                <th className="pb-2 pr-4 font-semibold">Type</th>
                <th className="pb-2 pr-4 font-semibold">Message</th>
                <th className="pb-2 pr-4 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <RequestRow key={r.id} request={r} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
