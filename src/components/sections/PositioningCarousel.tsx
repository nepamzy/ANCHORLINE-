"use client";

import { useEffect, useRef, useState } from "react";
import type { PositioningItem } from "@/lib/content";
import { positioningDetails } from "@/content/positioning-details";

/**
 * Horizontal, swipeable carousel of the homepage's "positioning" cards
 * (Technically qualified, Independent, Transparent, and the rest).
 * The card nearest the horizontal center is lit up (full opacity/scale)
 * while the others dim, tracked continuously via IntersectionObserver
 * so it updates whether the user drags, swipes, or the browser scrolls
 * the strip programmatically. Tapping a card opens a full-detail panel
 * built from src/content/positioning-details.ts.
 */
export function PositioningCarousel({ items }: { items: PositioningItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio);
        let bestIndex = 0;
        let bestRatio = -1;
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = ratios.get(el) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestIndex = i;
          }
        });
        setActiveIndex(bestIndex);
      },
      { root: scroller, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  const scrollToIndex = (i: number) => {
    cardRefs.current[i]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <div>
      <div
        ref={scrollerRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[11vw] pb-2 sm:px-[calc(50%-160px)]"
      >
        {items.map((item, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={item.title}
              type="button"
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onClick={() => (active ? setOpenIndex(i) : scrollToIndex(i))}
              className={`w-[78vw] shrink-0 snap-center rounded-card border p-6 text-left transition-all duration-300 sm:w-[320px] ${
                active
                  ? "scale-100 border-gold-500 bg-gold-500 text-navy-950 opacity-100 shadow-lg"
                  : "scale-95 border-line bg-paper text-navy-900 opacity-50"
              }`}
            >
              <p
                className={`text-xs font-semibold tracking-wide uppercase ${
                  active ? "text-navy-900" : "text-gold-600"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className={`mt-2 text-xl font-bold ${active ? "text-navy-950" : "text-navy-900"}`}>{item.title}</p>
              <p className={`mt-2 text-sm ${active ? "text-navy-900/80" : "text-slate"}`}>{item.body}</p>
              <span
                className={`mt-4 inline-block text-xs font-semibold ${
                  active ? "text-navy-900" : "text-navy-700"
                }`}
              >
                {active ? "Tap to read more →" : "Swipe to view →"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.title}
            type="button"
            aria-label={`Go to ${item.title}`}
            onClick={() => scrollToIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex ? "w-6 bg-gold-500" : "w-1.5 bg-navy-100"
            }`}
          />
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={items[openIndex].title}
          className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/70 p-0 sm:items-center sm:p-6"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-card bg-paper p-8 shadow-lg sm:rounded-card"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-semibold tracking-wide text-gold-600 uppercase">
              {String(openIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-navy-900">{items[openIndex].title}</h3>
            <p className="mt-4 text-slate leading-relaxed">
              {positioningDetails[items[openIndex].title] ?? items[openIndex].body}
            </p>
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              className="mt-6 min-h-11 rounded-control bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
