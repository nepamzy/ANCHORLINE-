import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Client Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="flex flex-1 items-center justify-center bg-navy-50 py-16">
      <div className="w-full max-w-sm rounded-card border border-line bg-paper p-8 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">
          Anchorline Project Partners
        </p>
        <h1 className="mt-2 text-2xl font-bold text-navy-900">Client login</h1>
        <p className="mt-1 text-sm text-slate">Manage your website content.</p>
        <LoginForm />
      </div>
    </main>
  );
}
