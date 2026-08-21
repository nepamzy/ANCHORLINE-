"use client";

import { useSectionDraft } from "../useSectionDraft";
import { SaveBar } from "../SaveBar";
import type { ContactInfo } from "@/lib/content";

const empty: ContactInfo = { whatsappNumber: "", contactEmail: "" };

export default function ContactEditor() {
  const { value, setValue, loading, meta, status, error, saveDraft, publish } = useSectionDraft<ContactInfo>(
    "contact",
    empty
  );

  if (loading) return <p className="text-slate">Loading…</p>;

  return (
    <div>
      <SaveBar status={status} error={error} meta={meta} onSaveDraft={saveDraft} onPublish={publish} />

      <h1 className="text-2xl font-bold text-navy-900">Contact Information</h1>
      <div className="mt-2 rounded-control border-2 border-dashed border-gold-500 bg-gold-100/40 p-4 text-sm text-navy-900">
        These appear on every page (header, footer, WhatsApp button,
        Contact page). Double-check the format before publishing.
        WhatsApp number should include the country code with no spaces
        for the click-to-chat link to work (e.g. 2348067570941 style
        digits).
      </div>

      <div className="mt-6 max-w-md space-y-4">
        <div>
          <label className="text-sm font-medium text-navy-900">WhatsApp number (displayed)</label>
          <input
            value={value.whatsappNumber}
            onChange={(e) => setValue({ ...value, whatsappNumber: e.target.value })}
            className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-navy-900">Business email</label>
          <input
            type="email"
            value={value.contactEmail}
            onChange={(e) => setValue({ ...value, contactEmail: e.target.value })}
            className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
          />
        </div>
      </div>
    </div>
  );
}
