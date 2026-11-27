"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function AddInvoiceForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...raw, amount: Number(raw.amount) }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        setError(result.error || "Could not create invoice.");
        setStatus("error");
        return;
      }
      form.reset();
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
      <p className="font-semibold text-navy-900">Create invoice</p>

      {status === "error" && <p className="mt-3 text-sm text-status-attention">{error}</p>}

      <div className="mt-3">
        <label htmlFor="description" className="text-xs font-medium text-navy-900">
          Description
        </label>
        <input
          id="description"
          name="description"
          type="text"
          required
          placeholder="e.g. VERIFY tier — November site visit"
          className={fieldClasses}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="amount" className="text-xs font-medium text-navy-900">
            Amount
          </label>
          <input id="amount" name="amount" type="number" min="1" step="0.01" required className={fieldClasses} />
        </div>
        <div>
          <label htmlFor="currency" className="text-xs font-medium text-navy-900">
            Currency
          </label>
          <select id="currency" name="currency" defaultValue="NGN" className={fieldClasses}>
            <option value="NGN">NGN (₦)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-3 rounded-control bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {status === "submitting" ? "Creating…" : "Create Invoice"}
      </button>
    </form>
  );
}
