"use client";

import { useSectionDraft } from "../useSectionDraft";
import { SaveBar } from "../SaveBar";
import type { SeoMap } from "@/lib/content";
import { navigation, contactNav } from "@/content/site";

const empty: SeoMap = {};
const pages = [...navigation, contactNav];

export default function SeoEditor() {
  const { value, setValue, loading, meta, status, error, saveDraft, publish } = useSectionDraft<SeoMap>(
    "seo",
    empty
  );

  if (loading) return <p className="text-slate">Loading…</p>;

  return (
    <div>
      <SaveBar status={status} error={error} meta={meta} onSaveDraft={saveDraft} onPublish={publish} />

      <h1 className="text-2xl font-bold text-navy-900">SEO</h1>
      <p className="mt-1 text-slate max-w-xl">
        Page title and description shown in search results and browser
        tabs. Leave a field blank to use the site&apos;s default for that
        page.
      </p>

      <div className="mt-6 max-w-2xl space-y-4">
        {pages.map((p) => {
          const entry = value[p.href] ?? { title: "", description: "" };
          return (
            <div key={p.href} className="rounded-card border border-line bg-paper p-5">
              <p className="text-sm font-semibold text-navy-900">{p.label}</p>
              <p className="text-xs text-slate">{p.href}</p>
              <label className="mt-3 block text-sm font-medium text-navy-900">Page title</label>
              <input
                value={entry.title}
                onChange={(e) => setValue({ ...value, [p.href]: { ...entry, title: e.target.value } })}
                className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
              />
              <label className="mt-3 block text-sm font-medium text-navy-900">Meta description</label>
              <textarea
                value={entry.description}
                onChange={(e) => setValue({ ...value, [p.href]: { ...entry, description: e.target.value } })}
                rows={2}
                className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
