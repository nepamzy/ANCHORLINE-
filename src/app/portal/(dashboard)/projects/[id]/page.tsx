import { notFound } from "next/navigation";
import { getCustomerSession } from "@/lib/portal-auth";
import { getProjectById, listReportsForProject, listDocumentsForProject } from "@/lib/portal-db";
import { StatusPill } from "@/components/portal/StatusPill";
import { StatusBadge } from "@/components/ui/StatusBadge";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PortalProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCustomerSession();
  if (!session) return null;

  const { id } = await params;
  const project = await getProjectById(id);
  if (!project || project.customer_id !== session.customerId) notFound();

  const [reports, documents] = await Promise.all([
    listReportsForProject(project.id),
    listDocumentsForProject(project.id),
  ]);

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Projects</p>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">{project.name}</h1>
        <StatusPill status={project.status} />
      </div>
      {project.tier && <p className="mt-1 font-medium text-gold-600">{project.tier}</p>}
      <p className="mt-2 text-sm text-slate">With us since {formatDate(project.created_at)}</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-card border border-line bg-paper p-6 shadow-card">
          <p className="font-semibold text-navy-900">Site-visit reports</p>
          {reports.length === 0 ? (
            <p className="mt-4 text-sm text-slate">No reports yet — we&apos;ll add one after the first visit.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {reports.map((r) => (
                <li key={r.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-navy-900">{formatDate(r.visit_date)}</p>
                    <StatusBadge status={r.status} />
                  </div>
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
                    <p className="text-xs text-slate">{formatDate(d.uploaded_at)}</p>
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
    </div>
  );
}
