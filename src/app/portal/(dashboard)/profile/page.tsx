import { getCustomerSession } from "@/lib/portal-auth";
import { getCustomerById } from "@/lib/portal-db";
import { ProfileForm } from "@/components/portal/ProfileForm";
import { PasswordForm } from "@/components/portal/PasswordForm";

export default async function PortalProfilePage() {
  const session = await getCustomerSession();
  const customer = session ? await getCustomerById(session.customerId) : null;
  if (!customer) return null;

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Profile</p>
      <h1 className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">Account settings</h1>
      <p className="mt-2 max-w-xl text-slate">{customer.email}</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <ProfileForm name={customer.name} phone={customer.phone ?? ""} />
        <PasswordForm />
      </div>
    </div>
  );
}
