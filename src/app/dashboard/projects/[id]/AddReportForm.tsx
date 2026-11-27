"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const STATUSES = ["On Track", "Minor Delay", "Attention Required"] as const;

export function AddReportForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        setError(result.error || "Could not add report.");
        setStatus("error");
        return;
      }
      (e.target as HTMLFormElement).reset();
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
      <p className="font-semibold text-navy-900">Add site-visit report</p>

      {status === "error" && <p className="mt-3 text-sm text-status-attention">{error}</p>}

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="visitDate" className="text-xs font-medium text-navy-900">
            Visit date
          </label>
          <input id="visitDate" name="visitDate" type="date" required className={fieldClasses} />
        </div>
        <div>
          <label htmlFor="status" className="text-xs font-medium text-navy-900">
            Status
          </label>
          <select id="status" name="status" defaultValue="On Track" className={fieldClasses}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="summary" className="text-xs font-medium text-navy-900">
          Summary
        </label>
        <textarea id="summary" name="summary" required minLength={5} className={`${fieldClasses} min-h-20`} />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-3 rounded-control bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {status === "submitting" ? "Adding…" : "Add Report"}
      </button>
    </form>
  );
}
