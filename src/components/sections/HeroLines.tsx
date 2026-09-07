"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

// How long each sentence stays up before the next one swaps in.
const DISPLAY_MS = 3000;
const EXIT_MS = 300;

// Cycled (not random) so consecutive lines never repeat the same
// entrance — left, right, up, down, then a plain fade, then back around.
const VARIANTS = ["left", "right", "up", "down", "fade"] as const;
type Variant = (typeof VARIANTS)[number];

const enterClass: Record<Variant, string> = {
  left: "animate-hero-slide-left",
  right: "animate-hero-slide-right",
  up: "animate-hero-slide-up",
  down: "animate-hero-slide-down",
  fade: "",
};

/**
 * Cycles through the hero video's short sentences, each entering from a
 * different direction (or a plain fade) so the sequence doesn't read as
 * one repeated animation. Static (first line only) under
 * prefers-reduced-motion.
 */
export function HeroLines({ lines, className = "" }: { lines: readonly string[]; className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reducedMotion || lines.length <= 1) return;
    const interval = setInterval(() => {
      setVisible(false);
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % lines.length);
        setVisible(true);
      }, EXIT_MS);
      return () => clearTimeout(swap);
    }, DISPLAY_MS);
    return () => clearInterval(interval);
  }, [reducedMotion, lines.length]);

  const variant = VARIANTS[index % VARIANTS.length];

  return (
    <span
      key={index}
      className={`inline-block transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"} ${
        !reducedMotion ? enterClass[variant] : ""
      } ${className}`}
    >
      {lines[index]}
    </span>
  );
}
