import Link from "next/link";
import { getCustomerSession } from "@/lib/portal-auth";
import { listReportsForCustomer, listDocumentsForCustomer } from "@/lib/portal-db";
import { StatusBadge } from "@/components/ui/StatusBadge";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PortalDocumentsPage() {
  const session = await getCustomerSession();
  if (!session) return null;

  const [reports, documents] = await Promise.all([
    listReportsForCustomer(session.customerId),
    listDocumentsForCustomer(session.customerId),
  ]);

  const hasAnything = reports.length > 0 || documents.length > 0;

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Documents</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">Reports & documents</h1>
      <p className="mt-2 max-w-xl text-slate">Everything we&apos;ve published across all of your projects.</p>

      {!hasAnything ? (
        <div className="mt-8 rounded-card border border-dashed border-line bg-paper p-10 text-center">
          <p className="font-medium text-navy-900">Nothing here yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate">
            Site-visit reports and documents will appear here as soon as they&apos;re published for one of your
            projects.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-card border border-line bg-paper p-6 shadow-card">
            <p className="font-semibold text-navy-900">Site-visit reports</p>
            {reports.length === 0 ? (
              <p className="mt-4 text-sm text-slate">No reports yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {reports.map((r) => (
                  <li key={r.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/portal/projects/${r.project_id}`}
                        className="font-medium text-navy-800 hover:text-navy-900"
                      >
                        {r.project_name}
                      </Link>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="mt-1 text-xs text-slate">{formatDate(r.visit_date)}</p>
                    <p className="mt-1 text-sm text-slate">{r.summary}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-card border border-line bg-paper p-6 shadow-card">
            <p className="font-semibold text-navy-900">Documents</p>
            {documents.length === 0 ? (
              <p className="mt-4 text-sm text-slate">No documents yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {documents.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <div>
                      <p className="font-medium text-navy-900">{d.title}</p>
                      <Link href={`/portal/projects/${d.project_id}`} className="text-xs text-slate hover:text-navy-900">
                        {d.project_name}
                      </Link>
                    </div>
                    <a
                      href={d.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-navy-800 hover:text-navy-900"
                    >
                      View →
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
