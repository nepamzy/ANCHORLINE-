"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Invoice } from "@/lib/portal-db";
import { StatusPill } from "@/components/portal/StatusPill";

function formatAmount(amount: number, currency: string): string {
  const symbol = currency === "USD" ? "$" : "₦";
  return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleStatus(invoice: Invoice) {
    const next = invoice.status === "Paid" ? "Unpaid" : "Paid";
    setBusyId(invoice.id);
    try {
      await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (invoices.length === 0) {
    return <p className="mt-3 text-sm text-slate">No invoices yet.</p>;
  }

  return (
    <ul className="mt-3 divide-y divide-line">
      {invoices.map((inv) => (
        <li key={inv.id} className="flex items-center justify-between gap-3 py-3 text-sm">
          <div>
            <p className="font-medium text-navy-900">{inv.description}</p>
            <p className="text-xs text-slate">
              {formatAmount(inv.amount, inv.currency)} · {formatDate(inv.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={inv.status} />
            <button
              type="button"
              onClick={() => toggleStatus(inv)}
              disabled={busyId === inv.id}
              className="rounded-control border border-line px-2 py-1 text-xs font-semibold text-navy-800 hover:bg-navy-50 disabled:opacity-60"
            >
              Mark {inv.status === "Paid" ? "Unpaid" : "Paid"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
