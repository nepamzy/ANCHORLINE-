import Link from "next/link";
import { TierIcon } from "@/components/sections/TierIcon";
import type { Tier } from "@/lib/content";
import { tierDetails } from "@/content/tier-details";

/**
 * Services page tier card. VERIFY carries a "Most Popular" badge and a
 * gold-accented border, per the client's reference design. Each card shows
 * a checklist of what's included (pulled from tier-details.ts) and a short
 * italic blurb on who it's for, ending in a "See Full Details" link through
 * to the dedicated /services/[tier] subpage.
 */
export function ServiceTierCard({ tier, index }: { tier: Tier; index: number }) {
  const detail = tierDetails.find((d) => d.name === tier.name.toUpperCase());
  const isMostPopular = tier.name.toUpperCase() === "VERIFY";

  return (
    <Link
      href={`/services/${tier.name.toLowerCase()}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-card border bg-paper p-8 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isMostPopular ? "border-2 border-gold-500" : "border-line"
      }`}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {isMostPopular && (
        <span className="absolute -top-3 left-8 rounded-full bg-gold-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-navy-950 shadow">
          Most Popular
        </span>
      )}

      <div className="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-100 bg-gold-500 sm:scale-x-0 sm:transition-transform sm:duration-300 sm:group-hover:scale-x-100" />

      <TierIcon
        name={tier.name}
        className="h-11 w-11 text-navy-900 transition-transform duration-300 group-hover:scale-110 group-hover:text-gold-600"
      />

      <p className="mt-5 text-base font-semibold tracking-wide text-gold-600 uppercase">{tier.name}</p>

      {detail && (
        <ul className="mt-4 space-y-2 text-slate">
          {detail.whatsIncluded.map((item) => (
            <li key={item} className="flex gap-2 text-sm">
              <span aria-hidden className="mt-0.5 shrink-0 text-gold-600">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      <blockquote className="mt-5 flex-1 border-l-2 border-gold-500 pl-3 text-sm italic text-slate">
        {tier.forWhom}
      </blockquote>

      <span className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-navy-800">
        See Full Details
        <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
