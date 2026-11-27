import Link from "next/link";
import { listCustomersWithMessageSummary, ensurePortalSchema } from "@/lib/portal-db";

export default async function DashboardMessagesPage() {
  await ensurePortalSchema();
  const customers = await listCustomersWithMessageSummary();

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Client Portal</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900">Messages</h1>
      <p className="mt-2 max-w-xl text-slate">Conversations with your portal clients.</p>

      {customers.length === 0 ? (
        <p className="mt-8 rounded-card border border-line bg-paper p-6 text-slate">No customer accounts yet.</p>
      ) : (
        <div className="mt-8 divide-y divide-line rounded-card border border-line bg-paper shadow-card">
          {customers.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/messages/${c.id}`}
              className="flex items-center justify-between gap-4 p-5 hover:bg-navy-50"
            >
              <div>
                <p className="font-semibold text-navy-900">{c.name}</p>
                <p className="text-sm text-slate">{c.email}</p>
              </div>
              <div className="text-right text-sm text-slate">
                <p>{c.message_count} message{c.message_count === 1 ? "" : "s"}</p>
                {c.last_message_at && (
                  <p className="text-xs">
                    Last:{" "}
                    {new Date(c.last_message_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
