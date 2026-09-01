"use client";

import { useSectionDraft } from "../useSectionDraft";
import { SaveBar } from "../SaveBar";
import { StringListEditor } from "../StringListEditor";
import { MediaField } from "../MediaField";
import type { AboutContent } from "@/lib/content";

const empty: AboutContent = {
  narrative: "",
  approach: [],
  credentials: [],
  images: { headerImage: "", bodyImage: "" },
};

export default function AboutEditor() {
  const { value, setValue, loading, meta, status, error, saveDraft, publish } = useSectionDraft<AboutContent>(
    "about",
    empty
  );

  if (loading) return <p className="text-slate">Loading…</p>;

  return (
    <div>
      <SaveBar status={status} error={error} meta={meta} onSaveDraft={saveDraft} onPublish={publish} previewHref="/dashboard/preview/about" />

      <h1 className="text-2xl font-bold text-navy-900">About</h1>
      <p className="mt-1 text-slate">Principal Consultant bio and approach shown on the About page.</p>

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
          <label className="text-sm font-medium text-navy-900">About narrative</label>
          <textarea
            value={value.narrative}
            onChange={(e) => setValue({ ...value, narrative: e.target.value })}
            rows={6}
            className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
          />
        </div>

        <StringListEditor
          label="Our approach"
          items={value.approach}
          onChange={(approach) => setValue({ ...value, approach })}
          placeholder="e.g. Honest reporting, without a relationship with contractors"
        />

        <StringListEditor
          label="Principal Consultant credentials"
          items={value.credentials}
          onChange={(credentials) => setValue({ ...value, credentials })}
          placeholder="e.g. B.Eng., Civil Engineering, FUTO"
        />
      </div>
    </div>
  );
}
