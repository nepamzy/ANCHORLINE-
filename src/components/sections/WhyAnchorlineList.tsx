"use client";

import { useState } from "react";
import type { PositioningItem } from "@/lib/content";
import { positioningDetails } from "@/content/positioning-details";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Vertical, editorial-style list — each point is a full-width row with a
 * large index number, tappable to expand the fuller detail copy for that
 * point (src/content/positioning-details.ts). Not a horizontally-
 * swipeable carousel.
 */
export function WhyAnchorlineList({ items }: { items: PositioningItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-white/10 border-t border-white/10">
      {items.map((item, i) => {
        const open = openIndex === i;
        const detail = positioningDetails[item.title];
        return (
          <Reveal key={item.title} delayMs={i * 60}>
            <div className="py-2">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="grid w-full gap-3 py-5 text-left sm:grid-cols-[auto_1fr] sm:gap-8 sm:py-6"
              >
                <span className="font-display text-3xl font-bold text-gold-500/70 sm:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-start justify-between gap-4 sm:grid sm:grid-cols-[minmax(180px,280px)_1fr] sm:gap-8">
                  <p className="text-lg font-semibold text-white sm:text-xl">{item.title}</p>
                  <p className="max-w-xl text-white/65">{item.body}</p>
                </div>
                {detail && (
                  <span
                    aria-hidden
                    className={`hidden shrink-0 self-start text-gold-400 transition-transform duration-300 sm:block ${open ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                )}
              </button>

              {detail && open && (
                <div className="pb-6 pl-0 sm:pl-[calc(2.25rem+2rem)]">
                  <p className="max-w-2xl text-white/80">{detail}</p>
                </div>
              )}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
