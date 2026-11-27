import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/portal-auth";
import { getCustomerById, ensurePortalSchema } from "@/lib/portal-db";
import { PortalShell } from "@/components/portal/PortalShell";

export default async function PortalDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getCustomerSession();
  if (!session) redirect("/portal/login");

  await ensurePortalSchema();
  const customer = await getCustomerById(session.customerId);
  if (!customer) redirect("/portal/login");

  return <PortalShell customerName={customer.name}>{children}</PortalShell>;
}
