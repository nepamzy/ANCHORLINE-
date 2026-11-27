import { getCustomerSession } from "@/lib/portal-auth";
import { listMessagesForCustomer, ensurePortalSchema } from "@/lib/portal-db";
import { MessageThread } from "@/components/portal/MessageThread";

export default async function PortalMessagesPage() {
  const session = await getCustomerSession();
  if (!session) return null;

  await ensurePortalSchema();
  const messages = await listMessagesForCustomer(session.customerId);

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Messages</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">Talk to our team</h1>
      <p className="mt-2 max-w-xl text-slate">Message us directly about any of your projects.</p>

      <div className="mt-8 max-w-2xl">
        <MessageThread
          messages={messages}
          postUrl="/api/portal/messages"
          ownSender="customer"
          placeholder="Write a message…"
        />
      </div>
    </div>
  );
}
