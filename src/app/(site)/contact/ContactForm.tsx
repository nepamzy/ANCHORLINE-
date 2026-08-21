"use client";

import { useState, type FormEvent } from "react";
import { tierNames } from "@/content/site";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok || !result.ok) {
        setErrorMessage(result.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  const inputClasses =
    "mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink placeholder:text-slate/60 focus-visible:border-navy-800";

  if (status === "success") {
    return (
      <div className="rounded-card border border-line bg-navy-50 p-6" role="status">
        <p className="font-semibold text-navy-900">Thanks. Your enquiry has been sent.</p>
        <p className="mt-2 text-sm text-slate">
          We&apos;ll get back to you shortly. For anything urgent, WhatsApp is
          the fastest way to reach us (see the panel to the right).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5" noValidate>
      {/* Honeypot — hidden from sighted users and screen readers, real users never fill this in */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-control border border-status-attention bg-[#fbe9e8] p-3 text-sm text-status-attention">
          {errorMessage}
        </p>
      )}

      <div>
        <label htmlFor="name" className="text-sm font-medium text-navy-900">
          Name
        </label>
        <input id="name" name="name" type="text" required className={inputClasses} />
      </div>

      <div>
        <label htmlFor="contact" className="text-sm font-medium text-navy-900">
          Email or phone
        </label>
        <input id="contact" name="contact" type="text" required className={inputClasses} />
      </div>

      <div>
        <label htmlFor="location" className="text-sm font-medium text-navy-900">
          Project location
        </label>
        <input id="location" name="location" type="text" required className={inputClasses} />
      </div>

      <div>
        <label htmlFor="stage" className="text-sm font-medium text-navy-900">
          Project stage
        </label>
        <input id="stage" name="stage" type="text" required className={inputClasses} />
      </div>

      <div>
        <label htmlFor="tier" className="text-sm font-medium text-navy-900">
          Tier of interest
        </label>
        <select id="tier" name="tier" required className={inputClasses} defaultValue="">
          <option value="" disabled>
            Select a tier
          </option>
          {tierNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value="Not sure yet">Not sure yet</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-navy-900">
          Message
        </label>
        <textarea id="message" name="message" rows={4} required className={inputClasses} />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-control px-6 py-3 text-sm font-semibold min-h-11 bg-navy-900 text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
