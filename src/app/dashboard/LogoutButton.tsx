"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="mt-1 block w-full rounded-control px-3 py-2 text-left text-sm text-slate hover:bg-navy-50 hover:text-navy-900"
    >
      Log out
    </button>
  );
}
