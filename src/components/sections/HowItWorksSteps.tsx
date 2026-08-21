import type { HowItWorksStep } from "@/lib/content";

export function HowItWorksSteps({ steps, limit }: { steps: HowItWorksStep[]; limit?: number }) {
  const shown = limit ? steps.slice(0, limit) : steps;

  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {shown.map((s) => (
        <li key={s.step} className="rounded-card border border-line bg-paper p-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
            {s.step}
          </span>
          <p className="mt-3 text-sm font-semibold text-navy-900">{s.title}</p>
          <p className="mt-1 text-sm text-slate">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
