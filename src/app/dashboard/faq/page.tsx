"use client";

import { useSectionDraft } from "../useSectionDraft";
import { SaveBar } from "../SaveBar";
import { MediaField } from "../MediaField";
import type { FAQContent, FAQItem } from "@/lib/content";

const empty: FAQContent = { items: [], images: { headerImage: "", bodyImage: "" } };

export default function FAQEditor() {
  const { value, setValue, loading, meta, status, error, saveDraft, publish } = useSectionDraft(
    "faq",
    empty
  );

  if (loading) return <p className="text-slate">Loading…</p>;

  function updateItem(i: number, patch: Partial<FAQItem>) {
    const items = [...value.items];
    items[i] = { ...items[i], ...patch };
    setValue({ ...value, items });
  }

  function removeItem(i: number) {
    setValue({ ...value, items: value.items.filter((_, idx) => idx !== i) });
  }

  function addItem() {
    setValue({ ...value, items: [...value.items, { question: "", answer: "" }] });
  }

  return (
    <div>
      <SaveBar status={status} error={error} meta={meta} onSaveDraft={saveDraft} onPublish={publish} previewHref="/dashboard/preview/faq" />

      <h1 className="text-2xl font-bold text-navy-900">FAQ</h1>
      <p className="mt-1 text-slate">Add, edit, or remove frequently asked questions.</p>

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
      </div>

      <div className="mt-6 max-w-2xl space-y-4">
        {value.items.map((item, i) => (
          <div key={i} className="rounded-card border border-line bg-paper p-5">
            <div className="flex items-start justify-between gap-3">
              <label className="text-sm font-medium text-navy-900">Question</label>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-sm text-slate hover:text-status-attention"
              >
                Remove
              </button>
            </div>
            <input
              value={item.question}
              onChange={(e) => updateItem(i, { question: e.target.value })}
              className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
            />
            <label className="mt-3 block text-sm font-medium text-navy-900">Answer</label>
            <textarea
              value={item.answer}
              onChange={(e) => updateItem(i, { answer: e.target.value })}
              rows={3}
              className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-4 rounded-control border border-navy-900 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-navy-50"
      >
        + Add question
      </button>
    </div>
  );
}
