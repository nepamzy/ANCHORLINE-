import Link from "next/link";
import { getCustomerSession } from "@/lib/portal-auth";
import { listProjectsForCustomer } from "@/lib/portal-db";
import { StatusPill } from "@/components/portal/StatusPill";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PortalProjectsPage() {
  const session = await getCustomerSession();
  if (!session) return null;

  const projects = await listProjectsForCustomer(session.customerId);

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Projects</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">Your projects</h1>
      <p className="mt-2 max-w-xl text-slate">
        Every project we&apos;re overseeing for you, linked to this account.
      </p>

      {projects.length === 0 ? (
        <div className="mt-8 rounded-card border border-dashed border-line bg-paper p-10 text-center">
          <p className="font-medium text-navy-900">No projects yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate">
            Once you book a project with us, it&apos;ll appear here with its site-visit reports, documents and
            payment history.
          </p>
          <Link
            href="/portal/requests"
            className="mt-5 inline-flex items-center justify-center rounded-control bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 hover:brightness-95"
          >
            Book a Project
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/portal/projects/${p.id}`}
              className="block rounded-card border border-line bg-paper p-5 shadow-card hover:border-navy-800"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-navy-900">{p.name}</p>
                <StatusPill status={p.status} />
              </div>
              {p.tier && <p className="mt-1 text-sm font-medium text-gold-600">{p.tier}</p>}
              <p className="mt-3 text-xs text-slate">Since {formatDate(p.created_at)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
