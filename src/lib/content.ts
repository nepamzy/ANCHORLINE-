import fs from "node:fs";
import path from "node:path";
import { ensureSeeded } from "./seed";
import { getPublished, getDraft } from "./db";

/**
 * Client-editable content, backed by the CMS database (see
 * src/lib/db.ts). Public pages call the `get*Content()` functions
 * (published version); the dashboard calls the `*Draft` variants.
 *
 * `content/*.json` (repo root) is kept only as the one-time seed
 * source for a fresh database — see src/lib/seed.ts — and as the
 * fallback if a section row genuinely doesn't exist yet.
 */
const CONTENT_DIR = path.join(process.cwd(), "content");

function readJSON<T>(file: string): T {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
  return JSON.parse(raw) as T;
}

/** Shared shape for a page's editable header/body photo. */
export type PageImages = { headerImage: string; bodyImage: string };

export type PositioningItem = { title: string; body: string };
export type HomeImages = { heroVideo: string };
export type HomeContent = { heroDescription: string; positioning: PositioningItem[]; images: HomeImages };
export async function getHomeContent(): Promise<HomeContent> {
  await ensureSeeded();
  return await getPublished("home", readJSON<HomeContent>("home.json"));
}
export async function getHomeDraft(): Promise<HomeContent> {
  await ensureSeeded();
  return await getDraft("home", readJSON<HomeContent>("home.json"));
}

export type AboutContent = {
  narrative: string;
  approach: string[];
  credentials: string[];
  images: PageImages;
};
export async function getAboutContent(): Promise<AboutContent> {
  await ensureSeeded();
  return await getPublished("about", readJSON<AboutContent>("about.json"));
}
export async function getAboutDraft(): Promise<AboutContent> {
  await ensureSeeded();
  return await getDraft("about", readJSON<AboutContent>("about.json"));
}

export type Tier = {
  name: "WATCH" | "VERIFY" | "MANAGE";
  forWhom: string;
  includes: string;
};
export type ServicesContent = { tiers: Tier[]; images: PageImages };
export async function getServicesContent(): Promise<ServicesContent> {
  await ensureSeeded();
  return await getPublished("services", readJSON<ServicesContent>("services.json"));
}
export async function getServicesDraft(): Promise<ServicesContent> {
  await ensureSeeded();
  return await getDraft("services", readJSON<ServicesContent>("services.json"));
}

export type HowItWorksStep = { step: number; title: string; body: string };
export type HowItWorksContent = { steps: HowItWorksStep[]; images: PageImages };
export async function getHowItWorksContent(): Promise<HowItWorksContent> {
  await ensureSeeded();
  return await getPublished("how-it-works", readJSON<HowItWorksContent>("how-it-works.json"));
}
export async function getHowItWorksDraft(): Promise<HowItWorksContent> {
  await ensureSeeded();
  return await getDraft("how-it-works", readJSON<HowItWorksContent>("how-it-works.json"));
}

export type CoverageAreaContent = { intro: string; points: string[]; images: PageImages };
export async function getCoverageAreaContent(): Promise<CoverageAreaContent> {
  await ensureSeeded();
  return await getPublished("coverage-area", readJSON<CoverageAreaContent>("coverage-area.json"));
}
export async function getCoverageAreaDraft(): Promise<CoverageAreaContent> {
  await ensureSeeded();
  return await getDraft("coverage-area", readJSON<CoverageAreaContent>("coverage-area.json"));
}

export type FAQItem = { question: string; answer: string };
export type FAQContent = { items: FAQItem[]; images: PageImages };
export async function getFAQContent(): Promise<FAQContent> {
  await ensureSeeded();
  return await getPublished("faq", readJSON<FAQContent>("faq.json"));
}
export async function getFAQDraft(): Promise<FAQContent> {
  await ensureSeeded();
  return await getDraft("faq", readJSON<FAQContent>("faq.json"));
}

export type Testimonial = { quote: string; name: string; role?: string };
export async function getTestimonialsContent(): Promise<{ items: Testimonial[] }> {
  await ensureSeeded();
  return await getPublished("testimonials", readJSON<{ items: Testimonial[] }>("testimonials.json"));
}
export async function getTestimonialsDraft(): Promise<{ items: Testimonial[] }> {
  await ensureSeeded();
  return await getDraft("testimonials", readJSON<{ items: Testimonial[] }>("testimonials.json"));
}

export type ContactInfo = { whatsappNumber: string; contactEmail: string; images: PageImages };
const emptyContactInfo: ContactInfo = {
  whatsappNumber: "",
  contactEmail: "",
  images: { headerImage: "", bodyImage: "" },
};
export async function getContactInfo(): Promise<ContactInfo> {
  await ensureSeeded();
  return await getPublished("contact", emptyContactInfo);
}
export async function getContactInfoDraft(): Promise<ContactInfo> {
  await ensureSeeded();
  return await getDraft("contact", emptyContactInfo);
}

/**
 * wa.me link derived from the dashboard-editable display number.
 *
 * The dashboard field is documented and used as a local display
 * number (e.g. "0806 757 0941" — how a Nigerian number is normally
 * written), but the click-to-chat link needs the full international
 * number. Previously this just stripped non-digits, which silently
 * produced a broken link whenever the stored number didn't already
 * include the country code (as was the case in production). This
 * normalizes Nigeria's standard local format (leading 0) to the
 * international one so editing the display number in the dashboard
 * the natural way doesn't break the button again.
 */
export function whatsappHrefFor(displayNumber: string): string {
  const digits = displayNumber.replace(/\D/g, "");
  if (digits.startsWith("234")) return `https://wa.me/${digits}`;
  if (digits.startsWith("0")) return `https://wa.me/234${digits.slice(1)}`;
  return `https://wa.me/${digits}`;
}

export type SeoEntry = { title: string; description: string };
export type SeoMap = Record<string, SeoEntry>;
export async function getSeoContent(): Promise<SeoMap> {
  await ensureSeeded();
  return await getPublished("seo", {});
}
export async function getSeoDraft(): Promise<SeoMap> {
  await ensureSeeded();
  return await getDraft("seo", {});
}

export type SampleReportAsset = { filePath: string | null; note: string; images: PageImages };
const emptySampleReportAsset: SampleReportAsset = {
  filePath: null,
  note: "",
  images: { headerImage: "", bodyImage: "" },
};
export async function getSampleReportAsset(): Promise<SampleReportAsset> {
  await ensureSeeded();
  return await getPublished("sample-report", emptySampleReportAsset);
}
export async function getSampleReportAssetDraft(): Promise<SampleReportAsset> {
  await ensureSeeded();
  return await getDraft("sample-report", emptySampleReportAsset);
}
