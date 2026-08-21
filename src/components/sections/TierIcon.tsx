import type { Tier } from "@/lib/content";

const paths: Record<Tier["name"], string> = {
  WATCH: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  VERIFY: "M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z M9 12l2 2 4-4",
  MANAGE: "M4 21V9l8-6 8 6v12h-5v-7H9v7H4Z",
};

export function TierIcon({ name, className = "" }: { name: Tier["name"]; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
