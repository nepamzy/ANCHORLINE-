"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";

export function MediaUploader() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading");
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", "media");

    const res = await fetch("/api/dashboard/upload", { method: "POST", body: formData });
    const result = await res.json();

    if (!res.ok || !result.ok) {
      setError(result.error || "Upload failed.");
      setStatus("error");
      return;
    }

    setStatus("idle");
    e.target.value = "";
    router.refresh();
  }

  return (
    <div className="mt-6">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-control bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800">
        {status === "uploading" ? "Uploading…" : "Upload image"}
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} className="hidden" disabled={status === "uploading"} />
      </label>
      {status === "error" && <p role="alert" className="mt-2 text-sm text-status-attention">{error}</p>}
    </div>
  );
}
