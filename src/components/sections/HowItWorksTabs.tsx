"use client";

import { useState } from "react";
import type { HowItWorksStep } from "@/lib/content";

/**
 * Text-only step selector — no photos. Tabs are laid out as an even
 * grid (not a cramped inline row) so they never crowd or overlap each
 * other regardless of step count; the selected step's body renders in
 * a single content panel below.
 */
export function HowItWorksTabs({ steps, limit }: { steps: HowItWorksStep[]; limit?: number }) {
  const shown = limit ? steps.slice(0, limit) : steps;
  const [active, setActive] = useState(0);
  const current = shown[active];

  return (
    <div>
      <div
        role="tablist"
        aria-label="How it works, steps"
        className="grid gap-px overflow-hidden rounded-control bg-line"
        style={{ gridTemplateColumns: `repeat(${shown.length}, minmax(0, 1fr))` }}
      >
        {shown.map((step, i) => (
          <button
            key={step.step}
            role="tab"
            type="button"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`min-h-16 px-3 py-3 text-center text-sm font-semibold transition-colors sm:px-4 ${
              active === i ? "bg-navy-900 text-white" : "bg-paper text-navy-800 hover:bg-navy-50"
            }`}
          >
            <span className={`block text-xs font-mono ${active === i ? "text-gold-400" : "text-gold-600"}`}>
              {String(step.step).padStart(2, "0")}
            </span>
            <span className="mt-1 block leading-tight">{step.title}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-card border border-line bg-paper p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">
          Step {current.step} of {shown.length}
        </p>
        <p className="mt-3 max-w-2xl text-lg text-navy-900">{current.body}</p>
      </div>
    </div>
  );
}
