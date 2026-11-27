import Link from "next/link";
import { listAllProjects, ensurePortalSchema } from "@/lib/portal-db";

export default async function DashboardProjectsPage() {
  await ensurePortalSchema();
  const projects = await listAllProjects();

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Client Portal</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900">Projects</h1>
      <p className="mt-2 max-w-xl text-slate">
        Every project linked to a client account. Open one to add site-visit reports and documents.
      </p>

      {projects.length === 0 ? (
        <p className="mt-8 rounded-card border border-line bg-paper p-6 text-slate">
          No projects yet — link one from a request in{" "}
          <Link href="/dashboard/requests" className="font-semibold text-navy-800 hover:text-navy-900">
            Requests
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-card border border-line bg-paper p-5 shadow-card">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-slate">
                <th className="pb-2 pr-4 font-semibold">Project</th>
                <th className="pb-2 pr-4 font-semibold">Client</th>
                <th className="pb-2 pr-4 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Since</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="py-3 pr-4">
                    <Link href={`/dashboard/projects/${p.id}`} className="font-medium text-navy-800 hover:text-navy-900">
                      {p.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="text-navy-900">{p.customer_name}</p>
                    <p className="text-xs text-slate">{p.customer_email}</p>
                  </td>
                  <td className="py-3 pr-4 text-slate">{p.status}</td>
                  <td className="py-3 text-slate">
                    {new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
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
