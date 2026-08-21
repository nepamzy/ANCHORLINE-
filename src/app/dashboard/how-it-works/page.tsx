"use client";

import { useSectionDraft } from "../useSectionDraft";
import { SaveBar } from "../SaveBar";
import type { HowItWorksStep } from "@/lib/content";

const empty: { steps: HowItWorksStep[] } = { steps: [] };

export default function HowItWorksEditor() {
  const { value, setValue, loading, meta, status, error, saveDraft, publish } = useSectionDraft(
    "how-it-works",
    empty
  );

  if (loading) return <p className="text-slate">Loading…</p>;

  return (
    <div>
      <SaveBar status={status} error={error} meta={meta} onSaveDraft={saveDraft} onPublish={publish} previewHref="/dashboard/preview/how-it-works" />

      <h1 className="text-2xl font-bold text-navy-900">How It Works</h1>
      <p className="mt-1 text-slate">The five steps of your client journey.</p>

      <div className="mt-6 max-w-2xl space-y-4">
        {value.steps.map((step, i) => (
          <div key={step.step} className="rounded-card border border-line bg-paper p-5">
            <p className="text-sm font-semibold text-gold-600">Step {step.step}</p>
            <label className="mt-2 block text-sm font-medium text-navy-900">Title</label>
            <input
              value={step.title}
              onChange={(e) => {
                const steps = [...value.steps];
                steps[i] = { ...step, title: e.target.value };
                setValue({ steps });
              }}
              className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
            />
            <label className="mt-3 block text-sm font-medium text-navy-900">Description</label>
            <textarea
              value={step.body}
              onChange={(e) => {
                const steps = [...value.steps];
                steps[i] = { ...step, body: e.target.value };
                setValue({ steps });
              }}
              rows={2}
              className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
