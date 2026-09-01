"use client";

import { useSectionDraft } from "../useSectionDraft";
import { SaveBar } from "../SaveBar";
import { MediaField } from "../MediaField";
import type { HomeContent } from "@/lib/content";

const empty: HomeContent = { heroDescription: "", positioning: [], images: { heroVideo: "" } };

export default function HomeEditor() {
  const { value, setValue, loading, meta, status, error, saveDraft, publish } = useSectionDraft<HomeContent>(
    "home",
    empty
  );

  if (loading) return <p className="text-slate">Loading…</p>;

  return (
    <div>
      <SaveBar status={status} error={error} meta={meta} onSaveDraft={saveDraft} onPublish={publish} previewHref="/dashboard/preview/home" />

      <h1 className="text-2xl font-bold text-navy-900">Home Page</h1>
      <p className="mt-1 text-slate">
        The hero description shown under the tagline, and the &ldquo;Why Anchorline&rdquo;
        cards (Technically qualified, Independent, Transparent, and the rest).
      </p>

      <div className="mt-6 max-w-2xl space-y-8">
        <MediaField
          label="Homepage hero video"
          hint="This is the only video on the whole site, the full-screen background behind the homepage headline."
          kind="video"
          value={value.images.heroVideo}
          onChange={(heroVideo) => setValue({ ...value, images: { ...value.images, heroVideo } })}
        />

        <div>
          <label className="text-sm font-medium text-navy-900">Hero description</label>
          <textarea
            value={value.heroDescription}
            onChange={(e) => setValue({ ...value, heroDescription: e.target.value })}
            rows={3}
            className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-navy-900">Why Anchorline cards</label>
          <div className="mt-2 space-y-4">
            {value.positioning.map((p, i) => (
              <div key={i} className="rounded-control border border-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <input
                    value={p.title}
                    placeholder="Card title (e.g. Independent)"
                    onChange={(e) => {
                      const next = [...value.positioning];
                      next[i] = { ...next[i], title: e.target.value };
                      setValue({ ...value, positioning: next });
                    }}
                    className="flex-1 rounded-control border border-line bg-paper px-3 py-2 font-semibold text-ink"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setValue({ ...value, positioning: value.positioning.filter((_, idx) => idx !== i) })
                    }
                    aria-label={`Remove card ${i + 1}`}
                    className="rounded-control border border-line px-3 py-2 text-slate hover:border-status-attention hover:text-status-attention"
                  >
                    ✕
                  </button>
                </div>
                <textarea
                  value={p.body}
                  placeholder="Card body text"
                  onChange={(e) => {
                    const next = [...value.positioning];
                    next[i] = { ...next[i], body: e.target.value };
                    setValue({ ...value, positioning: next });
                  }}
                  rows={2}
                  className="mt-2 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setValue({ ...value, positioning: [...value.positioning, { title: "", body: "" }] })
            }
            className="mt-2 text-sm font-semibold text-navy-800 hover:text-navy-900"
          >
            + Add card
          </button>
        </div>
      </div>
    </div>
  );
}
