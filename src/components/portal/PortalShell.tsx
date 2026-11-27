"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

const navItems = [
  { href: "/portal", label: "Overview", icon: "overview" },
  { href: "/portal/projects", label: "Projects", icon: "projects" },
  { href: "/portal/requests", label: "Requests", icon: "requests" },
  { href: "/portal/messages", label: "Messages", icon: "messages" },
  { href: "/portal/documents", label: "Documents", icon: "documents" },
  { href: "/portal/payments", label: "Payments", icon: "payments" },
  { href: "/portal/profile", label: "Profile", icon: "profile" },
] as const;

type IconName = (typeof navItems)[number]["icon"];

const iconPaths: Record<IconName, string> = {
  overview: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z",
  projects: "M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z",
  requests: "M7 4h10a1 1 0 0 1 1 1v15l-3-2-2 2-2-2-2 2-3-2V5a1 1 0 0 1 1-1Z M9 9h6 M9 13h6",
  messages: "M4 5h16v11H8l-4 4V5Z",
  documents: "M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z M14 3v5h5 M9 13h6 M9 17h6",
  payments: "M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z M3 10h18 M7 15h4",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M4 20a8 8 0 0 1 16 0",
};

function NavIcon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d={iconPaths[name]} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PortalShell({
  customerName,
  pageEyebrow,
  children,
}: {
  customerName: string;
  pageEyebrow?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initials = customerName
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/portal/logout", { method: "POST" });
    router.push("/portal/login");
    router.refresh();
  }

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-7">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500 font-mono text-base text-gold-400">
          ⚓
        </span>
        <div>
          <p className="font-display text-sm font-bold tracking-wide text-paper">ANCHORLINE</p>
          <p className="font-mono text-[9px] tracking-[0.2em] text-paper/50">CLIENT PORTAL</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Portal">
        {navItems.map((item) => {
          const active = item.href === "/portal" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-gold-500 text-navy-950" : "text-paper/75 hover:bg-white/5 hover:text-paper"
              }`}
            >
              <NavIcon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3 pb-6">
        <Link
          href="/"
          className="block rounded-control px-3 py-2 text-sm text-paper/60 hover:bg-white/5 hover:text-paper"
        >
          ← Back to website
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-1 flex w-full items-center gap-2 rounded-control px-3 py-2 text-left text-sm text-paper/60 hover:bg-white/5 hover:text-paper disabled:opacity-60"
        >
          {loggingOut ? "Signing out…" : "Log out"}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-navy-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-950 lg:flex">{sidebarContent}</aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileOpen(false)} aria-hidden />
          <aside className="relative flex h-full w-72 max-w-[80vw] flex-col bg-navy-950 animate-fade-up motion-reduce:animate-none">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-line bg-paper px-5 lg:px-8">
          <button
            type="button"
            className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-control border border-line text-navy-900 lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <p className="hidden text-xs font-semibold tracking-[0.2em] text-slate uppercase lg:block">
            {pageEyebrow ?? "Client Portal"}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-line text-slate hover:text-navy-900 sm:inline-flex"
              aria-label="Notifications"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z M10 18a2 2 0 0 0 4 0"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <Link href="/portal/profile" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-100 text-xs font-bold text-navy-900">
                {initials || "?"}
              </span>
              <span className="hidden text-sm font-semibold text-navy-900 sm:block">{customerName}</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
