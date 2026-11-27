import Link from "next/link";
import Image from "next/image";

const VALUE_PROPS = [
  {
    title: "Live project tracking",
    desc: "Real stats pulled straight from your site visits — budget, schedule and progress, always current.",
    icon: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z",
  },
  {
    title: "Site visit reports & photos",
    desc: "Every inspection documented and uploaded, so you see exactly what we see.",
    icon: "M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z M14 3v5h5 M9 13h6 M9 17h6",
  },
  {
    title: "Secure online payments",
    desc: "Settle invoices from anywhere in the world via Paystack or Stripe.",
    icon: "M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z M3 10h18 M7 15h4",
  },
];

/**
 * Split-screen auth shell: a branded navy panel (real site-visit
 * photography + the official mark, hidden below lg) carries the
 * portal's value proposition, with the login/signup form on a plain
 * paper card so the whole screen doesn't read as a bare white page.
 */
export default function PortalAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-1 flex-col lg:flex-row">
      <div className="relative hidden w-[44%] shrink-0 flex-col justify-between overflow-hidden bg-navy-950 lg:flex">
        <Image
          src="/assets/site-visits/structural-framing.jpg"
          alt=""
          fill
          sizes="44vw"
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/95 via-navy-950/92 to-navy-950" />
        <Image
          src="/assets/logo/anchorline-mark.png"
          alt=""
          aria-hidden
          width={443}
          height={457}
          className="pointer-events-none absolute -right-20 -bottom-16 h-[26rem] w-auto opacity-[0.08]"
        />

        <div className="relative z-10 px-10 pt-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/assets/logo/anchorline-mark.png" alt="" width={443} height={457} className="h-9 w-auto" />
            <span className="font-display text-sm font-bold tracking-wide text-paper">
              ANCHORLINE <span className="text-gold-400">PROJECT PARTNERS</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 px-10 py-12">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400">Client Portal</p>
          <h2 className="mt-3 max-w-sm font-display text-3xl font-bold leading-tight text-paper">
            Your project, verified at every step.
          </h2>
          <ul className="mt-8 space-y-6">
            {VALUE_PROPS.map((vp) => (
              <li key={vp.title} className="flex gap-3.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500/15">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-gold-400" aria-hidden="true">
                    <path d={vp.icon} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-paper">{vp.title}</p>
                  <p className="mt-1 text-sm text-paper/55">{vp.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 px-10 pb-10">
          <p className="text-xs text-paper/35">© {new Date().getFullYear()} Anchorline Project Partners</p>
        </div>
      </div>

      <div className="flex w-full flex-1 items-center justify-center bg-navy-50 px-4 py-14 lg:w-[56%]">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-7 flex items-center justify-center gap-2.5 lg:hidden">
            <Image src="/assets/logo/anchorline-mark.png" alt="" width={443} height={457} className="h-9 w-auto" />
            <span className="font-display text-sm font-bold tracking-wide text-navy-900">
              ANCHORLINE PROJECT PARTNERS
            </span>
          </Link>
          <div className="rounded-card border border-line bg-paper p-8 shadow-card">{children}</div>
        </div>
      </div>
    </main>
  );
}
