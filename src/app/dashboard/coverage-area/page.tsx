"use client";

import { useSectionDraft } from "../useSectionDraft";
import { SaveBar } from "../SaveBar";
import { StringListEditor } from "../StringListEditor";
import { MediaField } from "../MediaField";
import type { CoverageAreaContent } from "@/lib/content";

const empty: CoverageAreaContent = { intro: "", points: [], images: { headerImage: "", bodyImage: "" } };

export default function CoverageAreaEditor() {
  const { value, setValue, loading, meta, status, error, saveDraft, publish } = useSectionDraft<CoverageAreaContent>(
    "coverage-area",
    empty
  );

  if (loading) return <p className="text-slate">Loading…</p>;

  return (
    <div>
      <SaveBar status={status} error={error} meta={meta} onSaveDraft={saveDraft} onPublish={publish} previewHref="/dashboard/preview/coverage-area" />

      <h1 className="text-2xl font-bold text-navy-900">Coverage Area</h1>
      <p className="mt-1 text-slate">
        Text shown next to the Abuja map on the Coverage Area page. The map itself is a live
        Google Maps embed and isn&apos;t editable here.
      </p>

      <div className="mt-6 max-w-2xl space-y-8">
        <MediaField
          label="Banner image (top of page)"
          kind="image"
          value={value.images.headerImage}
          onChange={(headerImage) => setValue({ ...value, images: { ...value.images, headerImage } })}
        />

        <MediaField
          label="Body photo"
          kind="image"
          value={value.images.bodyImage}
          onChange={(bodyImage) => setValue({ ...value, images: { ...value.images, bodyImage } })}
        />

        <div>
          <label className="text-sm font-medium text-navy-900">Intro line</label>
          <textarea
            value={value.intro}
            onChange={(e) => setValue({ ...value, intro: e.target.value })}
            rows={2}
            className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
          />
        </div>

        <StringListEditor
          label="Supporting points"
          items={value.points}
          onChange={(points) => setValue({ ...value, points })}
          placeholder="e.g. We arrange coverage with an adjusted visit cadence..."
        />
      </div>
    </div>
  );
}
