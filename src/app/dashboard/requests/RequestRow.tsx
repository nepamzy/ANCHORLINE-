"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { RequestWithContext } from "@/lib/portal-db";

const STATUSES = ["Pending", "In Progress", "Completed"] as const;

export function RequestRow({ request }: { request: RequestWithContext }) {
  const router = useRouter();
  const [status, setStatus] = useState(request.status);
  const [saving, setSaving] = useState(false);
  const [linking, setLinking] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");

  async function handleStatusChange(next: string) {
    setStatus(next as RequestWithContext["status"]);
    setSaving(true);
    try {
      await fetch(`/api/admin/requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleLinkProject() {
    if (!projectName.trim()) return;
    setLinking(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "link_project", name: projectName }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        setError(result.error || "Could not create project.");
        return;
      }
      router.refresh();
    } finally {
      setLinking(false);
    }
  }

  return (
    <tr className="border-b border-line align-top last:border-0">
      <td className="py-3 pr-4 whitespace-nowrap text-slate">
        {new Date(request.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
      </td>
      <td className="py-3 pr-4">
        <p className="font-medium text-navy-900">{request.customer_name}</p>
        <p className="text-xs text-slate">{request.customer_email}</p>
      </td>
      <td className="py-3 pr-4 whitespace-nowrap text-navy-900">
        {request.type === "new_project" ? "New project" : "Service request"}
        {request.project_name && <p className="text-xs text-slate">{request.project_name}</p>}
      </td>
      <td className="max-w-xs py-3 pr-4 text-slate">{request.message}</td>
      <td className="py-3 pr-4">
        <select
          value={status}
          disabled={saving}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-control border border-line bg-paper px-2 py-1 text-xs font-semibold text-navy-900 disabled:opacity-60"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td className="py-3">
        {request.type === "new_project" && !request.project_id ? (
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
              className="w-36 rounded-control border border-line bg-paper px-2 py-1 text-xs"
            />
            <button
              type="button"
              onClick={handleLinkProject}
              disabled={linking || !projectName.trim()}
              className="rounded-control bg-navy-900 px-3 py-1 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
            >
              {linking ? "Linking…" : "Create & Link"}
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate">—</span>
        )}
        {error && <p className="mt-1 text-xs text-status-attention">{error}</p>}
      </td>
    </tr>
  );
}
