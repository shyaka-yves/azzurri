"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => searchParams.get("next") ?? "/admin", [searchParams]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Login failed");
        setLoading(false);
        return;
      }
      window.location.assign(nextPath);
    } catch {
      setError("Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-black/95">
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-3xl border border-zinc-800 bg-black/60 p-8 shadow-2xl shadow-black/60">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
            Admin Access
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-white">Azzurri Admin</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter the admin password to manage images, videos, and site content.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 h-11 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-11 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                placeholder="Enter password"
                required
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading || username.length === 0 || password.length === 0}
              className="gold-gradient inline-flex h-11 w-full items-center justify-center rounded-full text-xs font-semibold uppercase tracking-[0.18em] text-black disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-5 text-xs text-zinc-500">
            Contact the site administrator to create an account.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-6rem)] bg-black/95 flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}

