"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";

export function AddDocumentForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", "portal_document");

    try {
      const res = await fetch("/api/dashboard/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        setError(result.error || "Upload failed.");
        return;
      }
      setFileUrl(result.url);
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fileUrl) {
      setError("Please upload a file first.");
      return;
    }
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, fileUrl }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        setError(result.error || "Could not add document.");
        setStatus("error");
        return;
      }
      setTitle("");
      setFileUrl("");
      setStatus("idle");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  const fieldClasses = "mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-sm text-ink";

  return (
    <form onSubmit={handleSubmit} className="rounded-card border border-line bg-paper p-5 shadow-card">
      <p className="font-semibold text-navy-900">Add document</p>

      {error && <p className="mt-3 text-sm text-status-attention">{error}</p>}

      <div className="mt-3">
        <label htmlFor="doc-title" className="text-xs font-medium text-navy-900">
          Title
        </label>
        <input
          id="doc-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={fieldClasses}
        />
      </div>

      <div className="mt-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-control border border-navy-900 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-navy-50">
          {uploading ? "Uploading…" : fileUrl ? "File uploaded — replace" : "Choose file"}
          <input
            type="file"
            accept="application/pdf,image/png,image/jpeg,image/webp"
            onChange={handleFile}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "submitting" || uploading || !fileUrl}
        className="mt-3 block rounded-control bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {status === "submitting" ? "Adding…" : "Add Document"}
      </button>
    </form>
  );
}
