"use client";

import { useState, type ChangeEvent } from "react";

/**
 * A single dashboard-editable image or video slot: shows the current
 * file, an "Upload new" control, and calls onChange with the new
 * public URL once the upload finishes. The parent wires onChange into
 * its useSectionDraft `setValue` call exactly like any other field —
 * this component never saves or publishes anything itself.
 */
export function MediaField({
  label,
  hint,
  kind,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  kind: "image" | "video";
  value: string;
  onChange: (url: string) => void;
}) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading");
    setError("");

    const uploadKind = kind === "image" ? "media" : "video";

    // Upload straight from the browser to R2 (bypasses the ~4.5MB
    // request-body cap Vercel puts on every serverless function — the
    // only way a 100MB+ hero video can be uploaded at all once this is
    // deployed there). Falls back to the older FormData route (which
    // writes to local disk) when R2 isn't configured yet, e.g. local
    // dev before the credentials exist.
    try {
      const tokenRes = await fetch("/api/dashboard/upload/blob-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: uploadKind, contentType: file.type }),
      });
      if (!tokenRes.ok) throw new Error("R2 not configured");
      const { uploadUrl, publicUrl } = await tokenRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload to R2 failed");

      onChange(publicUrl);
      setStatus("idle");
      e.target.value = "";
      return;
    } catch {
      // Fall through to the legacy path below.
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", uploadKind);

    const res = await fetch("/api/dashboard/upload", { method: "POST", body: formData });
    const result = await res.json();

    if (!res.ok || !result.ok) {
      setError(result.error || "Upload failed.");
      setStatus("error");
      return;
    }

    onChange(result.url);
    setStatus("idle");
    e.target.value = "";
  }

  return (
    <div>
      <label className="text-sm font-medium text-navy-900">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-slate">{hint}</p>}

      <div className="mt-2 overflow-hidden rounded-control border border-line bg-navy-50">
        {value ? (
          kind === "video" ? (
            <video src={value} className="h-48 w-full object-cover" muted loop playsInline controls />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-48 w-full object-cover" />
          )
        ) : (
          <div className="flex h-48 items-center justify-center text-sm text-slate">No {kind} set yet</div>
        )}
      </div>

      <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-control border border-navy-900 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-navy-50">
        {status === "uploading" ? "Uploading…" : `Upload new ${kind}`}
        <input
          type="file"
          accept={kind === "image" ? "image/png,image/jpeg,image/webp" : "video/mp4"}
          onChange={handleFile}
          className="hidden"
          disabled={status === "uploading"}
        />
      </label>
      {status === "error" && <p role="alert" className="mt-2 text-sm text-status-attention">{error}</p>}
    </div>
  );
}
