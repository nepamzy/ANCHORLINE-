import { Card } from "@/components/ui/Card";
import type { Tier } from "@/lib/content";

export function TierCard({ tier, showDetail = false }: { tier: Tier; showDetail?: boolean }) {
  return (
    <Card className="group flex h-full flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">{tier.name}</p>
      <p className="mt-2 text-base font-semibold text-navy-900">{tier.forWhom}</p>
      <p className="mt-3 text-sm text-slate flex-1">{tier.includes}</p>
      {!showDetail && (
        <span className="mt-4 text-sm font-semibold text-navy-800 group-hover:text-navy-900">
          See full details →
        </span>
      )}
    </Card>
  );
}
