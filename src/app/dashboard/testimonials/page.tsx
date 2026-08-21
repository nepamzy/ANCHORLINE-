"use client";

import { useSectionDraft } from "../useSectionDraft";
import { SaveBar } from "../SaveBar";
import type { Testimonial } from "@/lib/content";

const empty: { items: Testimonial[] } = { items: [] };

export default function TestimonialsEditor() {
  const { value, setValue, loading, meta, status, error, saveDraft, publish } = useSectionDraft(
    "testimonials",
    empty
  );

  if (loading) return <p className="text-slate">Loading…</p>;

  function updateItem(i: number, patch: Partial<Testimonial>) {
    const items = [...value.items];
    items[i] = { ...items[i], ...patch };
    setValue({ items });
  }

  function removeItem(i: number) {
    setValue({ items: value.items.filter((_, idx) => idx !== i) });
  }

  function addItem() {
    setValue({ items: [...value.items, { quote: "", name: "", role: "" }] });
  }

  return (
    <div>
      <SaveBar status={status} error={error} meta={meta} onSaveDraft={saveDraft} onPublish={publish} previewHref="/dashboard/preview/testimonials" />

      <h1 className="text-2xl font-bold text-navy-900">Testimonials</h1>
      <p className="mt-1 text-slate">
        Only add testimonials from real clients who have approved their
        quote being published. Leave this list empty until you have one.
        The website shows an honest &ldquo;collecting feedback&rdquo; message
        instead of a blank page.
      </p>

      <div className="mt-6 max-w-2xl space-y-4">
        {value.items.map((item, i) => (
          <div key={i} className="rounded-card border border-line bg-paper p-5">
            <div className="flex items-start justify-between gap-3">
              <label className="text-sm font-medium text-navy-900">Quote</label>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-sm text-slate hover:text-status-attention"
              >
                Remove
              </button>
            </div>
            <textarea
              value={item.quote}
              onChange={(e) => updateItem(i, { quote: e.target.value })}
              rows={3}
              className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-navy-900">Name</label>
                <input
                  value={item.name}
                  onChange={(e) => updateItem(i, { name: e.target.value })}
                  className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-navy-900">Role (optional)</label>
                <input
                  value={item.role || ""}
                  onChange={(e) => updateItem(i, { role: e.target.value })}
                  className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-4 rounded-control border border-navy-900 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-navy-50"
      >
        + Add testimonial
      </button>
    </div>
  );
}
