"use client";

type Meta = { updatedAt: string | null; publishedAt: string | null; hasUnpublishedChanges: boolean };

export function SaveBar({
  status,
  error,
  meta,
  onSaveDraft,
  onPublish,
  previewHref,
}: {
  status: "idle" | "saving" | "saved" | "publishing" | "published" | "error";
  error: string;
  meta: Meta | null;
  onSaveDraft: () => void;
  onPublish: () => void;
  previewHref?: string;
}) {
  const busy = status === "saving" || status === "publishing";

  return (
    <div className="sticky top-0 z-10 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-navy-50/95 px-6 py-4 backdrop-blur lg:-mx-10 lg:px-10">
      <div className="text-sm text-slate">
        {meta?.publishedAt && <span>Published {new Date(meta.publishedAt).toLocaleString()}. </span>}
        {meta?.hasUnpublishedChanges && (
          <span className="font-semibold text-gold-600">Unpublished changes</span>
        )}
        {status === "error" && <span role="alert" className="font-semibold text-status-attention"> {error}</span>}
        {status === "saved" && <span className="font-semibold text-status-ontrack"> Draft saved.</span>}
        {status === "published" && <span className="font-semibold text-status-ontrack"> Published. Live now.</span>}
      </div>
      <div className="flex gap-2">
        {previewHref && (
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-control border border-navy-900 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-navy-50"
          >
            Preview
          </a>
        )}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={busy}
          className="rounded-control border border-navy-900 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-navy-50 disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save draft"}
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={busy}
          className="rounded-control bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
        >
          {status === "publishing" ? "Publishing…" : "Publish"}
        </button>
      </div>
    </div>
  );
}
