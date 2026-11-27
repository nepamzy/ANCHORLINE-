import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/portal-auth";
import { SignupForm } from "@/components/portal/SignupForm";

export const metadata: Metadata = {
  title: "Create Your Account",
  robots: { index: false, follow: false },
};

export default async function PortalSignupPage() {
  const session = await getCustomerSession();
  if (session) redirect("/portal");

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Client Portal</p>
      <h1 className="mt-2 text-2xl font-bold text-navy-900">Create your account</h1>
      <p className="mt-1 text-sm text-slate">
        Book a new project, track requests, and view your reports and payments in one place.
      </p>
      <div className="mt-6">
        <SignupForm />
      </div>
    </>
  );
}
