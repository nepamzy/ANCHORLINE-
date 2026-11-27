"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function ProfileForm({ name, phone }: { name: string; phone: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "saved">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch("/api/portal/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        setError(result.error || "Could not save changes.");
        setStatus("error");
        return;
      }
      setStatus("saved");
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
      <p className="font-semibold text-navy-900">Your details</p>

      {status === "error" && (
        <p role="alert" className="mt-4 rounded-control border border-status-attention bg-[#fbe9e8] p-3 text-sm text-status-attention">
          {error}
        </p>
      )}
      {status === "saved" && (
        <p className="mt-4 rounded-control border border-status-ontrack bg-[#e7f5ec] p-3 text-sm text-status-ontrack">
          Saved.
        </p>
      )}

      <div className="mt-4">
        <label htmlFor="name" className="text-sm font-medium text-navy-900">
          Full name
        </label>
        <input id="name" name="name" type="text" required defaultValue={name} className={fieldClasses} />
      </div>
      <div className="mt-4">
        <label htmlFor="phone" className="text-sm font-medium text-navy-900">
          Phone (optional)
        </label>
        <input id="phone" name="phone" type="tel" defaultValue={phone} className={fieldClasses} />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 rounded-control bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {status === "submitting" ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
