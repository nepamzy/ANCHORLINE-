"use client";

import { usePathname, useRouter } from "next/navigation";

/**
 * "Back" navigation shown at the top of every public page except the
 * home page. Uses real browser history when there is any (so it goes
 * to wherever the visitor actually came from, however deep — a
 * service-tier subpage, a filtered view, etc.), and falls back to the
 * home page when there isn't (e.g. someone opened a page directly
 * from a shared link, with no in-app history to go back to). Either
 * way this means repeatedly going back always eventually reaches home.
 */
export function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/") return null;

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <div className="border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex min-h-11 items-center gap-1.5 py-3 text-sm font-semibold text-navy-700 transition hover:text-navy-950"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}
