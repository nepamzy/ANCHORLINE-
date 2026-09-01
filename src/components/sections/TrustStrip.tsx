import { Container } from "@/components/ui/Container";
import { trustPillars } from "@/content/site";

const ICONS: Record<string, string> = {
  Independent: "M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z",
  Transparent: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  "Technically Qualified": "M4 21V9l8-6 8 6v12h-5v-7H9v7H4Z",
};

const FALLBACK_ICON = "M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z";

/**
 * Thin trust-signal band directly under the homepage hero — the
 * Woodhall pattern of stating the firm's positioning as three or four
 * short, plain claims right at the top, before any content requires
 * scrolling. Data-locked to trustPillars (src/content/site.ts), not
 * dashboard-editable.
 */
export function TrustStrip() {
  return (
    <div className="border-b border-line bg-offwhite">
      <Container className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {trustPillars.map((pillar) => (
          <div key={pillar} className="flex items-center gap-3 py-5 sm:justify-center sm:px-6">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 shrink-0 text-gold-600" aria-hidden="true">
              <path
                d={ICONS[pillar] ?? FALLBACK_ICON}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-semibold text-navy-900">{pillar}</span>
          </div>
        ))}
      </Container>
    </div>
  );
}
