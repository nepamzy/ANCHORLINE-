"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import type { HowItWorksStep } from "@/lib/content";

/**
 * Vertical step timeline where each step highlights and the
 * connecting line fills in as it scrolls into view. Falls back to a
 * fully-highlighted static timeline under prefers-reduced-motion —
 * the step content itself never depends on the animation to be
 * understood.
 */
export function HowItWorksScroller({ steps, limit }: { steps: HowItWorksStep[]; limit?: number }) {
  const shown = limit ? steps.slice(0, limit) : steps;
  const reducedMotion = usePrefersReducedMotion();
  const [observedCount, setActiveCount] = useState(0);
  const activeCount = reducedMotion ? shown.length : observedCount;
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (reducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            setActiveCount((prev) => Math.max(prev, index + 1));
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -20% 0px" }
    );

    itemRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [reducedMotion, shown.length]);

  const fillPercent = shown.length > 1 ? ((activeCount - 1) / (shown.length - 1)) * 100 : 100;

  return (
    <ol className="relative">
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-line" aria-hidden="true">
        <div
          className="w-full bg-gold-500 transition-[height] duration-500 ease-out"
          style={{ height: `${Math.max(0, Math.min(100, fillPercent))}%` }}
        />
      </div>

      <div className="space-y-6">
        {shown.map((s, i) => {
          const active = i < activeCount;
          return (
            <li
              key={s.step}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-index={i}
              className="relative flex gap-5 pl-0"
            >
              <span
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold transition-colors duration-500 ${
                  active ? "bg-navy-900 text-white" : "bg-navy-100 text-navy-900"
                }`}
              >
                {s.step}
              </span>
              <div
                className={`flex-1 rounded-card border p-6 transition-all duration-500 ${
                  active ? "border-line bg-white opacity-100" : "border-line/60 bg-white opacity-60"
                }`}
              >
                <p className="text-lg font-semibold text-navy-900">{s.title}</p>
                <p className="mt-1 text-slate">{s.body}</p>
              </div>
            </li>
          );
        })}
      </div>
    </ol>
  );
}
