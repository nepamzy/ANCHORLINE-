import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-card border border-line bg-paper p-6 shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
