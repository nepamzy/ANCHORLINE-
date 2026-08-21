import Link from "next/link";
import { getSession } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";
import { getSectionMeta } from "@/lib/db";

const sections = [
  { key: "home", label: "Home Page" },
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "how-it-works", label: "How It Works" },
  { key: "coverage-area", label: "Coverage Area" },
  { key: "faq", label: "FAQ" },
  { key: "testimonials", label: "Testimonials" },
  { key: "sample-report", label: "Sample Report" },
  { key: "contact", label: "Contact Information" },
  { key: "seo", label: "SEO" },
];

export default async function DashboardOverview() {
  const session = await getSession();
  await ensureSeeded();

  // Fetch every section's meta concurrently, then render from the
  // resolved results — getSectionMeta is async now (Postgres, not
  // synchronous SQLite), so it can't be called inline inside .map().
  const sectionsWithMeta = await Promise.all(
    sections.map(async (s) => ({ ...s, meta: await getSectionMeta(s.key) }))
  );

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Manage</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900">
        Welcome{session ? `, ${session.u}` : ""}
      </h1>
      <p className="mt-2 text-slate max-w-xl">
        Edit your website content below. Changes are saved as a draft
        first. Nothing goes live until you click Publish.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sectionsWithMeta.map((s) => (
          <Link
            key={s.key}
            href={`/dashboard/${s.key}`}
            className="rounded-card border border-line bg-paper p-5 hover:border-navy-800 hover:shadow-card"
          >
            <p className="font-semibold text-navy-900">{s.label}</p>
            {s.meta.hasUnpublishedChanges ? (
              <p className="mt-1 text-sm font-medium text-gold-600">Unpublished changes</p>
            ) : (
              <p className="mt-1 text-sm text-slate">Up to date</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
