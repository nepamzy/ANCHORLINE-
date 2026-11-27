import { notFound } from "next/navigation";
import { getCustomerById, listMessagesForCustomer } from "@/lib/portal-db";
import { MessageThread } from "@/components/portal/MessageThread";

export default async function DashboardMessageThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  const messages = await listMessagesForCustomer(id);

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Client Portal</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900">{customer.name}</h1>
      <p className="mt-1 text-slate">{customer.email}</p>

      <div className="mt-8 max-w-2xl">
        <MessageThread
          messages={messages}
          postUrl={`/api/admin/customers/${customer.id}/messages`}
          ownSender="admin"
          placeholder="Reply…"
        />
      </div>
    </div>
  );
}
