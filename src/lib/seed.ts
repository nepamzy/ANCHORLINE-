import fs from "node:fs";
import path from "node:path";
import { seedSectionIfMissing } from "./db";
import { business, navigation, contactNav } from "@/content/site";

const LEGACY_CONTENT_DIR = path.join(process.cwd(), "content");

function readLegacyJSON<T>(file: string): T {
  const raw = fs.readFileSync(path.join(LEGACY_CONTENT_DIR, file), "utf-8");
  return JSON.parse(raw) as T;
}

let seeded = false;

/**
 * One-time migration from the Phase 7 JSON-file content store into the
 * CMS database, plus sensible starting values for the new
 * DB-only sections (contact, SEO, sample report) that didn't exist
 * before this upgrade.
 *
 * The `seeded` flag is a warm-instance perf optimization only, not a
 * correctness guard — on serverless, a fresh cold start has its own
 * in-memory `seeded = false` regardless, so the underlying
 * seedSectionIfMissing() upserts must be (and are) safely idempotent
 * on their own even under concurrent invocations.
 */
export async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  seeded = true;

  const allRoutes = [...navigation, contactNav];

  await Promise.all([
    seedSectionIfMissing("home", readLegacyJSON("home.json")),
    seedSectionIfMissing("about", readLegacyJSON("about.json")),
    seedSectionIfMissing("services", readLegacyJSON("services.json")),
    seedSectionIfMissing("how-it-works", readLegacyJSON("how-it-works.json")),
    seedSectionIfMissing("coverage-area", readLegacyJSON("coverage-area.json")),
    seedSectionIfMissing("faq", readLegacyJSON("faq.json")),
    seedSectionIfMissing("testimonials", readLegacyJSON("testimonials.json")),

    // New sections — starting values come from the brief-locked constants
    // (src/content/site.ts), now editable going forward via the dashboard.
    seedSectionIfMissing("contact", {
      whatsappNumber: business.whatsappNumber,
      contactEmail: business.contactEmail,
    }),

    seedSectionIfMissing(
      "seo",
      Object.fromEntries(
        allRoutes.map((r) => [
          r.href,
          { title: "", description: "" }, // empty = use the page's built-in default
        ])
      )
    ),

    seedSectionIfMissing("sample-report", { filePath: null as string | null, note: "" }),
  ]);
}
