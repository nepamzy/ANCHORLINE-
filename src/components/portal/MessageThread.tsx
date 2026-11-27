"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Message } from "@/lib/portal-db";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageThread({
  messages,
  postUrl,
  ownSender,
  placeholder,
}: {
  messages: Message[];
  postUrl: string;
  ownSender: "customer" | "admin";
  placeholder: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!body.trim()) return;
    setStatus("sending");
    setError("");

    try {
      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        setError(result.error || "Could not send message.");
        setStatus("error");
        return;
      }
      setBody("");
      setStatus("idle");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="flex h-[32rem] flex-col rounded-card border border-line bg-paper shadow-card">
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <p className="text-sm text-slate">No messages yet. Say hello below.</p>
        ) : (
          messages.map((m) => {
            const mine = m.sender === ownSender;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-card px-4 py-2.5 text-sm ${
                    mine ? "bg-navy-900 text-white" : "bg-navy-50 text-ink"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.body}</p>
                  <p className={`mt-1 text-[10px] ${mine ? "text-paper/60" : "text-slate"}`}>
                    {formatTime(m.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-line p-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={placeholder}
          maxLength={4000}
          className="min-h-11 flex-1 resize-none rounded-control border border-line bg-paper px-3 py-2 text-sm text-ink focus-visible:border-navy-800"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <button
          type="submit"
          disabled={status === "sending" || !body.trim()}
          className="rounded-control bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-950 hover:brightness-95 disabled:opacity-60"
        >
          Send
        </button>
      </form>
      {status === "error" && <p className="px-5 pb-3 text-xs text-status-attention">{error}</p>}
    </div>
  );
}
