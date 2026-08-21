"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok || !result.ok) {
        setError(result.error || "Login failed.");
        setStatus("error");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  const inputClasses =
    "mt-1 w-full rounded-control border border-line bg-paper px-3 py-2 text-ink focus-visible:border-navy-800";

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {status === "error" && (
        <p role="alert" className="rounded-control border border-status-attention bg-[#fbe9e8] p-3 text-sm text-status-attention">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="username" className="text-sm font-medium text-navy-900">
          Username
        </label>
        <input id="username" name="username" type="text" required autoComplete="username" className={inputClasses} />
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
          autoComplete="current-password"
          className={inputClasses}
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-control bg-navy-900 px-5 py-3 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {status === "submitting" ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
