import { Card } from "@/components/ui/Card";
import { TierIcon } from "./TierIcon";
import type { Tier } from "@/lib/content";

/**
 * VERIFY is documented as "(Most Popular)" in the client's own brief
 * (docs/client-brief) — surfaced here as a visual ribbon rather than
 * left as plain equal-weight text, matching how the brief itself
 * singles it out.
 */
export function TierCard({ tier, showDetail = false }: { tier: Tier; showDetail?: boolean }) {
  const popular = tier.name === "VERIFY";

  return (
    <Card
      className={`group relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        popular ? "border-gold-500 ring-1 ring-gold-500" : ""
      }`}
    >
      {popular && (
        <span className="absolute top-0 right-0 rounded-bl-card bg-gold-500 px-3 py-1 text-[11px] font-bold tracking-wide text-navy-950 uppercase">
          Most popular
        </span>
      )}
      <TierIcon name={tier.name} className="h-9 w-9 text-gold-600" />
      <p className="mt-4 font-display text-xl font-medium text-navy-900">{tier.name}</p>
      <p className="mt-1 text-sm font-medium text-slate">{tier.forWhom}</p>
      <p className="mt-3 flex-1 text-sm text-slate">{tier.includes}</p>
      {!showDetail && (
        <span className="mt-4 text-sm font-semibold text-navy-800 group-hover:text-navy-900">
          See full details →
        </span>
      )}
    </Card>
  );
}
