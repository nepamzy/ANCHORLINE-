import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/portal-auth";
import { PortalLoginForm } from "@/components/portal/PortalLoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default async function PortalLoginPage() {
  const session = await getCustomerSession();
  if (session) redirect("/portal");

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Client Portal</p>
      <h1 className="mt-2 text-2xl font-bold text-navy-900">Sign in</h1>
      <p className="mt-1 text-sm text-slate">Access your projects, requests, reports and payments.</p>
      <div className="mt-6">
        <PortalLoginForm />
      </div>
    </>
  );
}
