import { notFound } from "next/navigation";
import {
  getProjectById,
  getCustomerById,
  listReportsForProject,
  listDocumentsForProject,
  listInvoicesForProject,
} from "@/lib/portal-db";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AddReportForm } from "./AddReportForm";
import { AddDocumentForm } from "./AddDocumentForm";
import { AddInvoiceForm } from "./AddInvoiceForm";
import { InvoiceList } from "./InvoiceList";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function DashboardProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const [customer, reports, documents, invoices] = await Promise.all([
    getCustomerById(project.customer_id),
    listReportsForProject(project.id),
    listDocumentsForProject(project.id),
    listInvoicesForProject(project.id),
  ]);

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Client Portal</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900">{project.name}</h1>
      <p className="mt-1 text-slate">
        {customer ? `${customer.name} · ${customer.email}` : "Unknown client"}
        {project.tier ? ` · ${project.tier}` : ""}
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div>
          <AddReportForm projectId={project.id} />
          <div className="mt-5 rounded-card border border-line bg-paper p-5 shadow-card">
            <p className="font-semibold text-navy-900">Site-visit reports</p>
            {reports.length === 0 ? (
              <p className="mt-3 text-sm text-slate">No reports added yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {reports.map((r) => (
                  <li key={r.id} className="py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-navy-900">{formatDate(r.visit_date)}</p>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate">{r.summary}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <AddDocumentForm projectId={project.id} />
          <div className="mt-5 rounded-card border border-line bg-paper p-5 shadow-card">
            <p className="font-semibold text-navy-900">Documents</p>
            {documents.length === 0 ? (
              <p className="mt-3 text-sm text-slate">No documents added yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
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

      <div className="mt-5">
        <AddInvoiceForm projectId={project.id} />
        <div className="mt-5 rounded-card border border-line bg-paper p-5 shadow-card">
          <p className="font-semibold text-navy-900">Invoices</p>
          <p className="text-xs text-slate">
            Marking paid here is manual for now — no payment processor is connected yet.
          </p>
          <InvoiceList invoices={invoices} />
        </div>
      </div>
    </div>
  );
}
