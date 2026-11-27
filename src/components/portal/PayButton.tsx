"use client";

import { useState } from "react";

export function PayButton({ invoiceId, currency }: { invoiceId: string; currency: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handlePay() {
    setStatus("loading");
    setError("");

    const endpoint = currency === "USD" ? "/api/portal/payments/stripe/initiate" : "/api/portal/payments/paystack/initiate";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        setError(result.error || "Could not start payment.");
        setStatus("error");
        return;
      }
      window.location.href = result.url;
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="text-right">
      <button
        type="button"
        onClick={handlePay}
        disabled={status === "loading"}
        className="rounded-control bg-gold-500 px-3 py-1.5 text-xs font-semibold text-navy-950 hover:brightness-95 disabled:opacity-60"
      >
        {status === "loading" ? "Redirecting…" : `Pay with ${currency === "USD" ? "card" : "Paystack"}`}
      </button>
      {status === "error" && <p className="mt-1 max-w-[16rem] text-xs text-status-attention">{error}</p>}
    </div>
  );
}
