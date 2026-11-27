"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Project } from "@/lib/portal-db";

export function NewRequestForm({ projects }: { projects: Pick<Project, "id" | "name">[] }) {
  const router = useRouter();
  const [type, setType] = useState<"new_project" | "service_request">(
    projects.length > 0 ? "service_request" : "new_project"
  );
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "sent">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/portal/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          projectId: type === "service_request" ? projectId : undefined,
          message,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        setError(result.error || "Could not send your request.");
        setStatus("error");
        return;
      }
      setMessage("");
      setStatus("sent");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  const fieldClasses =
    "mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink focus-visible:border-navy-800";

  return (
    <form onSubmit={handleSubmit} className="rounded-card border border-line bg-paper p-6 shadow-card">
      <p className="font-semibold text-navy-900">Place a new request</p>
      <p className="mt-1 text-sm text-slate">
        Booking a new project, or need something on one you already have — tell us here.
      </p>

      {status === "error" && (
        <p role="alert" className="mt-4 rounded-control border border-status-attention bg-[#fbe9e8] p-3 text-sm text-status-attention">
          {error}
        </p>
      )}
      {status === "sent" && (
        <p className="mt-4 rounded-control border border-status-ontrack bg-[#e7f5ec] p-3 text-sm text-status-ontrack">
          Request sent — we&apos;ll be in touch shortly.
        </p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="req-type" className="text-sm font-medium text-navy-900">
            What&apos;s this about?
          </label>
          <select
            id="req-type"
            className={fieldClasses}
            value={type}
            onChange={(e) => setType(e.target.value as "new_project" | "service_request")}
          >
            <option value="new_project">Book a new project</option>
            <option value="service_request" disabled={projects.length === 0}>
              An existing project{projects.length === 0 ? " (none yet)" : ""}
            </option>
          </select>
        </div>

        {type === "service_request" && (
          <div>
            <label htmlFor="req-project" className="text-sm font-medium text-navy-900">
              Which project?
            </label>
            <select
              id="req-project"
              className={fieldClasses}
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="req-message" className="text-sm font-medium text-navy-900">
          Details
        </label>
        <textarea
          id="req-message"
          className={`${fieldClasses} min-h-28`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          minLength={10}
          maxLength={4000}
          required
          placeholder={
            type === "new_project"
              ? "e.g. I'd like a site verification visit arranged for a plot in Lekki, Lagos."
              : "e.g. Can we schedule the next site visit for early next month?"
          }
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 inline-flex items-center justify-center rounded-control bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 hover:brightness-95 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Request"}
      </button>
    </form>
  );
}
