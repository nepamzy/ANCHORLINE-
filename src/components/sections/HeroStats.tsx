import { heroStats } from "@/content/site";

export function HeroStats() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {heroStats.map((s) => (
        <div key={s.label}>
          <p className="font-display text-4xl font-bold text-white">{s.value}</p>
          <p className="mt-1 text-xs text-white/70">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
