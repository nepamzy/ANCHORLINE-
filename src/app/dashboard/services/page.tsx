"use client";

import { useSectionDraft } from "../useSectionDraft";
import { SaveBar } from "../SaveBar";
import { MediaField } from "../MediaField";
import type { ServicesContent } from "@/lib/content";

const empty: ServicesContent = { tiers: [], images: { headerImage: "", bodyImage: "" } };

export default function ServicesEditor() {
  const { value, setValue, loading, meta, status, error, saveDraft, publish } = useSectionDraft(
    "services",
    empty
  );

  if (loading) return <p className="text-slate">Loading…</p>;

  return (
    <div>
      <SaveBar status={status} error={error} meta={meta} onSaveDraft={saveDraft} onPublish={publish} previewHref="/dashboard/preview/services" />

      <h1 className="text-2xl font-bold text-navy-900">Services</h1>
      <p className="mt-1 text-slate">
        Watch, Verify, and Manage tier descriptions. Tier names are fixed
        and can&apos;t be renamed here.
      </p>

      <div className="mt-6 max-w-2xl space-y-8">
        <MediaField
          label="Banner image (top of page)"
          hint="Also used on each tier's detail page (e.g. /services/watch)."
          kind="image"
          value={value.images.headerImage}
          onChange={(headerImage) => setValue({ ...value, images: { ...value.images, headerImage } })}
        />

        <MediaField
          label="Body photo"
          hint="Also used on each tier's detail page."
          kind="image"
          value={value.images.bodyImage}
          onChange={(bodyImage) => setValue({ ...value, images: { ...value.images, bodyImage } })}
        />

        <div className="space-y-6">
          {value.tiers.map((tier, i) => (
            <div key={tier.name} className="rounded-card border border-line bg-paper p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">{tier.name}</p>
              <label className="mt-3 block text-sm font-medium text-navy-900">For</label>
              <input
                value={tier.forWhom}
                onChange={(e) => {
                  const tiers = [...value.tiers];
                  tiers[i] = { ...tier, forWhom: e.target.value };
                  setValue({ ...value, tiers });
                }}
                className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
              />
              <label className="mt-3 block text-sm font-medium text-navy-900">What&apos;s included</label>
              <textarea
                value={tier.includes}
                onChange={(e) => {
                  const tiers = [...value.tiers];
                  tiers[i] = { ...tier, includes: e.target.value };
                  setValue({ ...value, tiers });
                }}
                rows={3}
                className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
