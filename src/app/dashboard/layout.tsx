import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

const navItems = [
  { href: "/dashboard", label: "Manage" },
  { href: "/dashboard/home", label: "Home Page" },
  { href: "/dashboard/about", label: "About" },
  { href: "/dashboard/services", label: "Services" },
  { href: "/dashboard/how-it-works", label: "How It Works" },
  { href: "/dashboard/coverage-area", label: "Coverage Area" },
  { href: "/dashboard/faq", label: "FAQ" },
  { href: "/dashboard/sample-report", label: "Sample Report" },
  { href: "/dashboard/media", label: "Images / Media" },
  { href: "/dashboard/contact", label: "Contact Information" },
  { href: "/dashboard/seo", label: "SEO" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-navy-50">
      <aside className="hidden w-64 shrink-0 border-r border-line bg-paper lg:block">
        <div className="p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Anchorline</p>
          <p className="text-lg font-bold text-navy-900">Client Dashboard</p>
        </div>
        <nav className="flex flex-col gap-1 px-3" aria-label="Dashboard">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-control px-3 py-2 text-sm font-medium text-slate hover:bg-navy-50 hover:text-navy-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-line p-3">
          <Link href="/" className="block rounded-control px-3 py-2 text-sm text-slate hover:bg-navy-50 hover:text-navy-900">
            ← View website
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-line bg-paper px-6 py-4 lg:hidden">
          <p className="font-bold text-navy-900">Anchorline Dashboard</p>
          <LogoutButton />
        </header>
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
