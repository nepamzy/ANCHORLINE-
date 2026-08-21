"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Direction = "up" | "none";

/**
 * Purposeful, minimal scroll-reveal: fades/slides an element in once when
 * it enters the viewport. Respects prefers-reduced-motion (renders fully
 * visible immediately, no transition) and only animates once — this is
 * not a scroll-jacking or repeating effect.
 */
export function Reveal({
  children,
  direction = "up",
  delayMs = 0,
  className = "",
}: {
  children: ReactNode;
  direction?: Direction;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const shown = reducedMotion || visible;
  const translate = direction === "up" ? "translate-y-4" : "";

  return (
    <div
      ref={ref}
      className={`${reducedMotion ? "" : "transition-all duration-700 ease-out"} ${
        shown ? "opacity-100 translate-y-0" : `opacity-0 ${translate}`
      } ${className}`}
      style={!reducedMotion && delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
