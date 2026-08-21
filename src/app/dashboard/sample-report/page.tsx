"use client";

import { useState, type ChangeEvent } from "react";
import { useSectionDraft } from "../useSectionDraft";
import { SaveBar } from "../SaveBar";
import type { SampleReportAsset } from "@/lib/content";

const empty: SampleReportAsset = { filePath: null, note: "" };

export default function SampleReportEditor() {
  const { value, setValue, loading, meta, status, error, saveDraft, publish } = useSectionDraft<SampleReportAsset>(
    "sample-report",
    empty
  );
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [uploadError, setUploadError] = useState("");

  if (loading) return <p className="text-slate">Loading…</p>;

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadStatus("uploading");
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", "report");

    const res = await fetch("/api/dashboard/upload", { method: "POST", body: formData });
    const result = await res.json();

    if (!res.ok || !result.ok) {
      setUploadError(result.error || "Upload failed.");
      setUploadStatus("error");
      return;
    }

    setValue({ ...value, filePath: result.url });
    setUploadStatus("idle");
    e.target.value = "";
  }

  return (
    <div>
      <SaveBar status={status} error={error} meta={meta} onSaveDraft={saveDraft} onPublish={publish} previewHref="/sample-report" />

      <h1 className="text-2xl font-bold text-navy-900">Sample Report</h1>
      <p className="mt-1 text-slate max-w-xl">
        Upload the anonymised sample site verification report (PDF or
        image) once it&apos;s ready. Until then, the website shows a clearly
        labelled placeholder, nothing fabricated.
      </p>

      <div className="mt-6 max-w-xl space-y-4">
        <div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-control border border-navy-900 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-navy-50">
            {uploadStatus === "uploading" ? "Uploading…" : "Upload report file"}
            <input
              type="file"
              accept="application/pdf,image/png,image/jpeg"
              onChange={handleFile}
              className="hidden"
              disabled={uploadStatus === "uploading"}
            />
          </label>
          {uploadStatus === "error" && (
            <p role="alert" className="mt-2 text-sm text-status-attention">{uploadError}</p>
          )}
          {value.filePath && (
            <p className="mt-2 text-sm text-slate">
              Current file:{" "}
              <a href={value.filePath} target="_blank" rel="noopener noreferrer" className="underline text-navy-800">
                {value.filePath}
              </a>
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-navy-900">Note (optional)</label>
          <textarea
            value={value.note}
            onChange={(e) => setValue({ ...value, note: e.target.value })}
            rows={3}
            className="mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink"
          />
        </div>
      </div>
    </div>
  );
}
