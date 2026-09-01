"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

const ROTATE_MS = 2400;

/** Cycles through a fixed word list, fading between them. Static (first word only) under prefers-reduced-motion. */
export function RotatingWord({ words, className = "" }: { words: readonly string[]; className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reducedMotion || words.length <= 1) return;
    const interval = setInterval(() => {
      setVisible(false);
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 300);
      return () => clearTimeout(swap);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [reducedMotion, words.length]);

  return (
    <span
      className={`inline-block transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {words[index]}
    </span>
  );
}
