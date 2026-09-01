/**
 * Locked business constants: brand identity, contact channels, sitemap,
 * service tier names, and report structure. These come directly from
 * the client brief and are NOT part of the client-editable content set
 * (see src/lib/content.ts + /content/*.json for editable prose).
 *
 * Kept in code, not JSON, so a routine content edit can't accidentally
 * change the WhatsApp number, tagline, tier names, or navigation.
 */

export const business = {
  name: "Anchorline Project Partners",
  tagline: "Your eyes on the ground, wherever you are.",
  whatsappNumber: "0806 757 0941",
  whatsappHref: "https://wa.me/2348067570941",
  contactEmail: "alprojectpartners@gmail.com",
  location: "Abuja, Nigeria",
  principal: "Damian Chibueze Agu",
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Why Anchorline", href: "/why-anchorline" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Sample Report", href: "/sample-report" },
  { label: "Coverage Area", href: "/coverage-area" },
  { label: "FAQ", href: "/faq" },
  // Testimonials intentionally not in the live nav yet — no approved
  // testimonials exist. Re-add this entry when the client has some
  // (the /testimonials route and its dashboard editor are still there,
  // just unlinked — see src/app/(site)/testimonials/page.tsx).
] as const;

export const contactNav = { label: "Contact / Get a Quote", href: "/contact" };

export const trustPillars = [
  "Independent",
  "Transparent",
  "Technically Qualified",
] as const;

// Short rotating lines for the homepage hero video. Each restates a fact
// already established elsewhere on the site (tagline, positioning items,
// About credentials, service tiers) in a single short sentence, not new
// marketing copy.
export const heroRotatingLines = [
  "Your eyes on the ground, wherever you are.",
  "Independent oversight, reporting only to you.",
  "Every visit documented with dated photos and video.",
  "Led by a practicing construction project manager.",
  "Reports delivered by WhatsApp or email, wherever you are.",
  "Abuja based, with coverage arranged nationwide.",
  "Every engagement runs on a signed letter.",
  "Site verification, quantity surveying, and project management.",
  "Watch, Verify, or Manage. The choice is yours.",
  "Built for diaspora clients building from abroad.",
] as const;

// Headline facts already established elsewhere in the brief (About's
// "over half a decade" credential, the three WATCH/VERIFY/MANAGE tiers,
// the "reporting to you and only you" independence framing) — restated
// as a compact stats row, not new claims.
export const heroStats = [
  { value: "5+", label: "Years hands-on construction project management experience" },
  { value: "3", label: "Tiers of oversight, Watch, Verify, Manage" },
  { value: "1", label: "Party you report to: you, and only you" },
] as const;

export const sampleReportSections = [
  { title: "Summary of Visit", body: "A short written overview of what was observed during the visit." },
  {
    title: "Photographic / Video Documentation",
    body: "Dated images and video, labelled by area, so progress is visible from anywhere.",
  },
  {
    title: "Progress Assessment",
    body: "Status by area, using the On Track / Minor Delay / Attention Required key below.",
  },
  {
    title: "Cost / Milestone Notes",
    body: "Verify tier and above: notes tied to Bill of Quantities review and milestone certification.",
  },
  { title: "Recommendations & Next Steps", body: "What we advise doing before the next visit." },
  { title: "Next Scheduled Visit", body: "The date of the next planned visit or walkthrough." },
] as const;

export const progressAssessmentAreas = [
  "Foundation",
  "Superstructure",
  "Roofing",
  "Electrical/Plumbing",
  "Finishing",
  "Site Safety",
] as const;

export const contactFormFields = [
  "Name",
  "Email/Phone",
  "Project Location",
  "Project Stage",
  "Tier of Interest",
  "Message",
] as const;

export const tierNames = ["WATCH", "VERIFY", "MANAGE"] as const;
