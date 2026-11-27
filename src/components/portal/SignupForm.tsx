"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function SignupForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch("/api/portal/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        setError(result.error || "Could not create your account.");
        setStatus("error");
        return;
      }
      router.push("/portal");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  const fieldClasses =
    "mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink focus-visible:border-navy-800";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "error" && (
        <p role="alert" className="rounded-control border border-status-attention bg-[#fbe9e8] p-3 text-sm text-status-attention">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="name" className="text-sm font-medium text-navy-900">
          Full name
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className={fieldClasses} />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-navy-900">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={fieldClasses} />
      </div>
      <div>
        <label htmlFor="phone" className="text-sm font-medium text-navy-900">
          Phone (optional)
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={fieldClasses} />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-navy-900">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={fieldClasses}
        />
        <p className="mt-1 text-xs text-slate">At least 8 characters.</p>
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-control bg-gold-500 px-5 py-3 text-sm font-semibold text-navy-950 hover:brightness-95 disabled:opacity-60"
      >
        {status === "submitting" ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-slate">
        Already have an account?{" "}
        <Link href="/portal/login" className="font-semibold text-navy-800 hover:text-navy-900">
          Sign in
        </Link>
      </p>
    </form>
  );
}
