"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { sampleReportSections, progressAssessmentAreas } from "@/content/site";
import {
  demoProject,
  demoSummary,
  demoProgress,
  demoCostNotes,
  demoRecommendations,
  demoNextVisit,
} from "@/content/sample-report-demo";

/**
 * Interactive tabbed sample report. Each tab uses a distinct layout
 * (facts sidebar, media grid, status table, milestone timeline,
 * priority list, date card) so the report reads as a real deliverable
 * rather than six identical text blocks. All content is the fictional
 * "Agnese Corps" demo project (see src/content/sample-report-demo.ts) —
 * not a real Anchorline client. Photo/video slots are labelled
 * placeholders; real report imagery is provided separately.
 */
export function SampleReportTabs() {
  const [active, setActive] = useState(0);
  const section = sampleReportSections[active];

  return (
    <div>
      <div role="tablist" aria-label="Sample report sections" className="flex flex-wrap gap-2 border-b border-line pb-4">
        {sampleReportSections.map((s, i) => (
          <button
            key={s.title}
            role="tab"
            type="button"
            id={`report-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`report-panel-${i}`}
            onClick={() => setActive(i)}
            className={`min-h-11 rounded-control border px-4 py-2 text-sm font-semibold transition-colors ${
              active === i
                ? "border-gold-500 bg-navy-900 text-white"
                : "border-line bg-paper text-navy-800 hover:bg-navy-50"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`report-panel-${active}`}
        aria-labelledby={`report-tab-${active}`}
        className="mt-8"
      >
        <p className="font-mono text-xs tracking-[0.2em] text-gold-600 uppercase">
          {demoProject.reportRef} &middot; Visit {demoProject.visitNumber} &middot; {demoProject.visitDate}
        </p>
        <h3 className="mt-2 text-2xl font-bold text-navy-900">{section.title}</h3>
        <p className="mt-1 text-sm text-slate">{section.body}</p>

        <div className="mt-6">
          {active === 0 && <SummaryPanel />}
          {active === 1 && <DocumentationPanel />}
          {active === 2 && <ProgressPanel />}
          {active === 3 && <CostPanel />}
          {active === 4 && <RecommendationsPanel />}
          {active === 5 && <NextVisitPanel />}
        </div>
      </div>
    </div>
  );
}

function SummaryPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-card border border-line bg-paper p-6 shadow-card">
        <p className="text-lg font-semibold text-navy-900">{demoSummary.headline}</p>
        <p className="mt-4 text-slate leading-relaxed">{demoSummary.overview}</p>
      </div>
      <div className="rounded-card border border-line bg-navy-50 p-6">
        <p className="text-xs font-semibold tracking-wide text-navy-900 uppercase">Visit facts</p>
        <dl className="mt-4 space-y-3">
          {demoSummary.facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs text-slate">{f.label}</dt>
              <dd className="text-sm font-medium text-navy-900">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

import { documentationPhotos } from "@/content/report-documentation-photos";

function DocumentationPanel() {
  const [openArea, setOpenArea] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const openPhotos = openArea ? documentationPhotos[openArea] : undefined;

  function openGallery(area: string) {
    setOpenArea(area);
    setPhotoIndex(0);
  }

  return (
    <div>
      <p className="text-sm text-slate">
        Every visit is documented with dated photos and video, labelled by area. The images below are
        illustrative (AI-generated representative construction photography, not real Agnese Corps site
        photos) to show how documentation is organised in the real report; the client&apos;s own report
        imagery is supplied separately. Tap a category to see more angles.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {progressAssessmentAreas.map((area, i) => {
          const photos = documentationPhotos[area] ?? [];
          const cover = photos[0];
          return (
            <button
              key={area}
              type="button"
              onClick={() => openGallery(area)}
              disabled={photos.length === 0}
              className="group overflow-hidden rounded-card border border-line bg-paper text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:shadow-card"
            >
              <div className="relative">
                {cover ? (
                  <img
                    src={cover.url}
                    alt={cover.alt}
                    className="h-32 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-32 w-full bg-navy-50" />
                )}
                {photos.length > 1 && (
                  <span className="absolute right-2 bottom-2 rounded-full bg-navy-950/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                    {photos.length} photos
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-navy-900">{area}</p>
                <p className="text-xs text-slate">
                  {demoProject.visitDate} &middot; Level {Math.min(3, i + 1)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {openArea && openPhotos && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openArea}
          className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/70 p-0 sm:items-center sm:p-6"
          onClick={() => setOpenArea(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-card bg-paper shadow-lg sm:rounded-card"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={openPhotos[photoIndex].url}
              alt={openPhotos[photoIndex].alt}
              className="aspect-[4/3] w-full bg-navy-950 object-cover sm:rounded-t-card"
            />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wide text-gold-600 uppercase">
                  {openArea}
                  {openPhotos.length > 1 &&
                    ` (${photoIndex + 1} / ${openPhotos.length})`}
                </p>
                <button
                  type="button"
                  onClick={() => setOpenArea(null)}
                  aria-label="Close"
                  className="min-h-11 min-w-11 rounded-control text-navy-700 hover:bg-navy-50"
                >
                  ✕
                </button>
              </div>
              {openPhotos.length > 1 && (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPhotoIndex((photoIndex - 1 + openPhotos.length) % openPhotos.length)}
                    className="min-h-11 flex-1 rounded-control border border-line px-4 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-50"
                  >
                    &larr; Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoIndex((photoIndex + 1) % openPhotos.length)}
                    className="min-h-11 flex-1 rounded-control border border-line px-4 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-50"
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressPanel() {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper shadow-card">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-navy-50">
          <tr>
            <th scope="col" className="p-4 font-semibold text-navy-900">Area</th>
            <th scope="col" className="p-4 font-semibold text-navy-900">Status</th>
            <th scope="col" className="p-4 font-semibold text-navy-900">Complete</th>
            <th scope="col" className="p-4 font-semibold text-navy-900">Note</th>
          </tr>
        </thead>
        <tbody>
          {demoProgress.map((row) => (
            <tr key={row.area} className="border-t border-line align-top">
              <td className="p-4 font-medium text-ink">{row.area}</td>
              <td className="p-4"><StatusBadge status={row.status} /></td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-navy-50">
                    <div
                      className="h-full rounded-full bg-gold-500"
                      style={{ width: `${row.percentComplete}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate">{row.percentComplete}%</span>
                </div>
              </td>
              <td className="p-4 text-slate">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CostPanel() {
  return (
    <div>
      <p className="text-sm text-slate">{demoCostNotes.boqReviewStatus}</p>
      <ol className="mt-6 space-y-4 border-l-2 border-line pl-6">
        {demoCostNotes.milestones.map((m) => (
          <li key={m.name} className="relative">
            <span className="absolute top-1.5 -left-[calc(1.5rem+5px)] h-2.5 w-2.5 rounded-full bg-gold-500" />
            <p className="font-semibold text-navy-900">{m.name}</p>
            <p className="text-sm text-slate">{m.date} &middot; {m.amountNote}</p>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                m.status === "Certified" ? "bg-[#e7f5ec] text-status-ontrack" : "bg-gold-100 text-status-minor"
              }`}
            >
              {m.status}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-6 rounded-card border-2 border-dashed border-gold-500 bg-gold-100/40 p-4 text-sm text-navy-900">
        <p className="text-xs font-semibold tracking-wide text-gold-600 uppercase">Flagged this visit</p>
        <p className="mt-1">{demoCostNotes.flaggedVariance}</p>
      </div>
    </div>
  );
}

function RecommendationsPanel() {
  const priorityClasses = {
    High: "bg-[#fbe9e8] text-status-attention",
    Medium: "bg-gold-100 text-status-minor",
    Low: "bg-[#e7f5ec] text-status-ontrack",
  };
  return (
    <ul className="space-y-3">
      {demoRecommendations.map((r, i) => (
        <li key={i} className="flex items-start gap-4 rounded-card border border-line bg-paper p-4 shadow-card">
          <span className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityClasses[r.priority]}`}>
            {r.priority}
          </span>
          <p className="text-sm text-navy-900">{r.action}</p>
        </li>
      ))}
    </ul>
  );
}

function NextVisitPanel() {
  return (
    <div className="rounded-card border border-line bg-navy-900 p-8 text-white">
      <p className="text-xs font-semibold tracking-[0.2em] text-gold-500 uppercase">Next scheduled visit</p>
      <p className="mt-2 text-3xl font-bold">{demoNextVisit.date}</p>
      <p className="mt-6 text-xs font-semibold tracking-wide text-white/60 uppercase">Focus for this visit</p>
      <ul className="mt-3 space-y-2">
        {demoNextVisit.focus.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-white/90">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
