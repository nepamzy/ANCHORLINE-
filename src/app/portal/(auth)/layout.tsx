import Link from "next/link";

export default function PortalAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-navy-50 px-4 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-500 font-mono text-base text-gold-600">
            ⚓
          </span>
          <span className="font-display text-sm font-bold tracking-wide text-navy-900">
            ANCHORLINE PROJECT PARTNERS
          </span>
        </Link>
        <div className="rounded-card border border-line bg-paper p-8 shadow-card">{children}</div>
      </div>
    </main>
  );
}
