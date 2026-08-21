/**
 * Expanded, full-detail copy for each service tier, shown when a
 * visitor taps "See Full Details" on /services. Written from the
 * client brief (report structure, tier descriptions, engagement
 * model, WhatsApp/email delivery, BOQ/milestone language already
 * established elsewhere in this codebase). Nothing invented beyond
 * elaborating on facts already stated in content/services.json,
 * content/site.ts's sampleReportSections, and the brief itself.
 */

export type TierDetail = {
  name: "WATCH" | "VERIFY" | "MANAGE";
  summary: string;
  bestFor: string[];
  whatsIncluded: string[];
  cadence: string;
  deliverable: string;
};

export const tierDetails: TierDetail[] = [
  {
    name: "WATCH",
    summary:
      "The lightest-touch tier: independent eyes on your site so you always know what's really happening, without taking on any contract-administration role.",
    bestFor: [
      "Self-build clients who trust their contractor but want an independent second set of eyes",
      "Diaspora clients early in a build, before staged payments or milestone certification become relevant",
      "Anyone who wants a paper trail of dated evidence from day one",
    ],
    whatsIncluded: [
      "One scheduled site visit per month (more frequent visits available on request)",
      "Dated photo and video documentation, labelled by area",
      "A short written progress report after every visit",
      "Report delivered via WhatsApp and/or email, wherever you are",
    ],
    cadence: "Monthly, adjustable to your project's pace",
    deliverable: "Summary of Visit + Photographic/Video Documentation sections of the standard report",
  },
  {
    name: "VERIFY",
    summary:
      "For clients making staged payments to a contractor: Verify adds the cost and milestone scrutiny that protects each payment decision.",
    bestFor: [
      "Clients releasing funds against a Bill of Quantities or a staged payment schedule",
      "Anyone who wants a milestone independently certified before authorising the next payment",
      "Projects where cost creep or under-delivery against the BOQ is a real risk",
    ],
    whatsIncluded: [
      "Everything in Watch (monthly visit, dated documentation, written report)",
      "Bill of Quantities review against work actually completed on site",
      "Milestone certification to guide payment decisions",
      "Cost/Milestone Notes section flags any variance the client should know about before paying",
    ],
    cadence: "Monthly, aligned to your payment/milestone schedule",
    deliverable: "Full standard report, including Progress Assessment and Cost/Milestone Notes",
  },
  {
    name: "MANAGE",
    summary:
      "Full project/construction management for developers and larger private projects: Anchorline sits alongside your team as the independent party administering the build.",
    bestFor: [
      "Developers and larger private projects needing ongoing, hands-on oversight",
      "Clients who want contractor engagement support, not just after-the-fact reporting",
      "Projects with multiple contractors/trades that need coordinated quality supervision",
    ],
    whatsIncluded: [
      "Everything in Verify (BOQ review, milestone certification, full reporting)",
      "Contractor engagement support and contract administration",
      "Ongoing cost control across the project, not just at milestones",
      "Quality supervision across trades, with recommendations and next steps after every visit",
    ],
    cadence: "Tailored to project scope, typically more frequent than monthly",
    deliverable: "Full standard report plus direct contractor-facing involvement between visits",
  },
];
