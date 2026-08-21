"use client";

import { useCallback, useEffect, useState } from "react";

type Meta = { updatedAt: string | null; publishedAt: string | null; hasUnpublishedChanges: boolean };
type SaveStatus = "idle" | "saving" | "saved" | "publishing" | "published" | "error";

/**
 * Shared draft-edit-save-publish state machine for every dashboard
 * content section. Loads the current draft on mount, tracks local
 * edits, and exposes save/publish actions against the generic
 * /api/dashboard/content/[section] routes.
 */
export function useSectionDraft<T>(section: string, emptyValue: T) {
  const [value, setValue] = useState<T>(emptyValue);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/dashboard/content/${section}`);
    const result = await res.json();
    if (res.ok && result.ok) {
      setValue(result.draft ?? emptyValue);
      setMeta(result.meta);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  useEffect(() => {
    // Async data fetch on mount — setState happens after the await inside
    // load(), not synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function saveDraft(): Promise<boolean> {
    setStatus("saving");
    setError("");
    const res = await fetch(`/api/dashboard/content/${section}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    const result = await res.json();
    if (!res.ok || !result.ok) {
      setError(result.error || "Could not save draft.");
      setStatus("error");
      return false;
    }
    setStatus("saved");
    await load();
    return true;
  }

  async function publish() {
    const saved = await saveDraft();
    if (!saved) return;
    setStatus("publishing");
    const res = await fetch(`/api/dashboard/content/${section}/publish`, { method: "POST" });
    const result = await res.json();
    if (!res.ok || !result.ok) {
      setError(result.error || "Could not publish.");
      setStatus("error");
      return;
    }
    setStatus("published");
    await load();
  }

  return { value, setValue, loading, meta, status, error, saveDraft, publish };
}
