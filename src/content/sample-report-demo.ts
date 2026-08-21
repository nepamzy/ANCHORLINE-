/**
 * Fully fictional sample-report content used only on the public
 * /sample-report page, to show the structure and level of detail of an
 * Anchorline report without exposing a real client's project. "Agnese
 * Corps" is an invented developer/contractor name; "J. Okafor" is an
 * invented diaspora client; all figures, dates, and observations below
 * are illustrative, not a real engagement. Photo/video documentation
 * is left as labelled placeholders pending real report assets.
 */

export const demoProject = {
  projectName: "Agnese Corps Residence, Block C",
  developer: "Agnese Corps Ltd.",
  client: "J. Okafor (Diaspora Client, Houston, TX)",
  location: "Guzape District, Abuja, FCT",
  tier: "Verify" as const,
  visitNumber: 7,
  visitDate: "5 August 2026",
  nextVisitDate: "2 September 2026",
  reportRef: "ALPP-AGC-0007",
};

export const demoSummary = {
  overview:
    "Visit 7 covered the full building envelope and internal block-work on Levels 1 to 3. Weather was dry throughout the visit, with no impact on the day's planned activities. The site foreman and Agnese Corps' resident engineer were both present and walked the full floor plate with our surveyor.",
  facts: [
    { label: "Visit type", value: "Scheduled monthly walkthrough" },
    { label: "Duration on site", value: "3 hours 40 minutes" },
    { label: "Weather", value: "Dry, clear skies" },
    { label: "Present on site", value: "Site foreman, resident engineer, 14 tradesmen" },
    { label: "Surveyor", value: "Anchorline Project Partners" },
  ],
  headline: "On track against the revised programme, one item flagged for the client's attention.",
};

export const demoProgress: {
  area: string;
  status: "On Track" | "Minor Delay" | "Attention Required";
  note: string;
  percentComplete: number;
}[] = [
  { area: "Foundation", status: "On Track", note: "Fully cured, no visible cracking on inspection.", percentComplete: 100 },
  { area: "Superstructure", status: "On Track", note: "Columns and beams to Level 3 complete, formwork struck cleanly.", percentComplete: 90 },
  { area: "Roofing", status: "Minor Delay", note: "Truss delivery delayed one week by supplier; site is prepared and ready to receive.", percentComplete: 40 },
  { area: "Electrical/Plumbing", status: "On Track", note: "First-fix conduit routing complete on Levels 1 to 2, matches approved drawings.", percentComplete: 55 },
  { area: "Finishing", status: "Attention Required", note: "Plaster sample on the north elevation shows uneven curing; recommend a redo before render coat.", percentComplete: 15 },
  { area: "Site Safety", status: "On Track", note: "PPE compliance observed throughout; edge protection in place on all open floors.", percentComplete: 100 },
];

export const demoCostNotes = {
  boqReviewStatus: "Reviewed against the approved Bill of Quantities through Milestone 4 (Superstructure Complete).",
  milestones: [
    { name: "Milestone 1: Foundation Complete", status: "Certified", date: "12 Feb 2026", amountNote: "Payment 1 released" },
    { name: "Milestone 2: Ground Floor Slab", status: "Certified", date: "18 Mar 2026", amountNote: "Payment 2 released" },
    { name: "Milestone 3: Superstructure to Level 2", status: "Certified", date: "22 May 2026", amountNote: "Payment 3 released" },
    { name: "Milestone 4: Superstructure Complete", status: "Pending certification", date: "Expected 2 Sep 2026", amountNote: "Roofing delay pushed completion by ~1 week" },
  ],
  flaggedVariance:
    "One variance flagged this visit: a supplier substitution on roof truss timber grade was proposed by the contractor. We have requested written justification and a spec comparison before it is approved on the client's behalf.",
};

export const demoRecommendations = [
  {
    priority: "High" as const,
    action: "Do not approve the roof truss timber substitution until Agnese Corps supplies a written spec comparison.",
  },
  {
    priority: "Medium" as const,
    action: "Request a redo of the north elevation plaster sample before render coat proceeds.",
  },
  {
    priority: "Low" as const,
    action: "Confirm the revised roofing delivery date in writing so Milestone 4 certification timing can be reset.",
  },
];

export const demoNextVisit = {
  date: "2 September 2026",
  focus: [
    "Confirm roofing materials on site and installation start",
    "Re-inspect north elevation plaster after redo",
    "Begin first review of Milestone 4 documentation",
  ],
};
