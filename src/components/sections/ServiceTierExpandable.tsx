import Link from "next/link";
import { TierIcon } from "@/components/sections/TierIcon";
import type { Tier } from "@/lib/content";

/**
 * Services page tier card — moderately larger than the original (more
 * generous padding/type scale, not empty space), with a colored surface
 * distinct from the section's own background (see Section variant on
 * the page). "Get a Quote for {tier}" was replaced with "See Full
 * Details", which now links to a dedicated /services/[tier] subpage
 * (not an inline expand) showing that tier's full breakdown wide.
 */
export function ServiceTierCard({ tier, index }: { tier: Tier; index: number }) {
  return (
    <Link
      href={`/services/${tier.name.toLowerCase()}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper p-8 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-100 bg-gold-500 sm:scale-x-0 sm:transition-transform sm:duration-300 sm:group-hover:scale-x-100" />

      <TierIcon
        name={tier.name}
        className="h-11 w-11 text-navy-900 transition-transform duration-300 group-hover:scale-110 group-hover:text-gold-600"
      />

      <p className="mt-5 text-base font-semibold tracking-wide text-gold-600 uppercase">{tier.name}</p>
      <p className="mt-4 text-xl font-semibold text-navy-900">For</p>
      <p className="mt-1 text-slate">{tier.forWhom}</p>
      <p className="mt-5 text-xl font-semibold text-navy-900">What&apos;s included</p>
      <p className="mt-1 text-slate flex-1">{tier.includes}</p>

      <span className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-navy-800">
        See Full Details
        <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
