"use client";

import { useState, type FormEvent } from "react";

export function PasswordForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "saved">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/portal/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        setError(result.error || "Could not change your password.");
        setStatus("error");
        return;
      }
      setStatus("saved");
      form.reset();
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  const fieldClasses =
    "mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink focus-visible:border-navy-800";

  return (
    <form onSubmit={handleSubmit} className="rounded-card border border-line bg-paper p-6 shadow-card">
      <p className="font-semibold text-navy-900">Change password</p>

      {status === "error" && (
        <p role="alert" className="mt-4 rounded-control border border-status-attention bg-[#fbe9e8] p-3 text-sm text-status-attention">
          {error}
        </p>
      )}
      {status === "saved" && (
        <p className="mt-4 rounded-control border border-status-ontrack bg-[#e7f5ec] p-3 text-sm text-status-ontrack">
          Password updated.
        </p>
      )}

      <div className="mt-4">
        <label htmlFor="currentPassword" className="text-sm font-medium text-navy-900">
          Current password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className={fieldClasses}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="newPassword" className="text-sm font-medium text-navy-900">
          New password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={fieldClasses}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 rounded-control border border-navy-900 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-navy-50 disabled:opacity-60"
      >
        {status === "submitting" ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
