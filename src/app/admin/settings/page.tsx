"use client";

import { useEffect, useState } from "react";

type AdminUser = {
  id: string;
  username: string;
  createdAt: string;
};

export default function AdminSettingsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const aRes = await fetch("/api/admin/users", { cache: "no-store" });
      const aData = (await aRes.json()) as any;
      if (!aData.ok) throw new Error(aData.error ?? "Failed to load admins");

      setAdmins(aData.admins ?? []);
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function createAdmin() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });
      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Create failed");
      setNewUsername("");
      setNewPassword("");
      await loadAll();
      setCreating(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
      setCreating(false);
    }
  }

  async function deleteAdmin(id: string) {
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Delete failed");
      await loadAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  if (loading) {
    return <div className="text-sm text-zinc-400">Loading settings…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">Settings</p>
          <h1 className="mt-2 text-xl font-semibold text-white">Admin settings</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage admin accounts.</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <Card title="Admin accounts">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="New username" value={newUsername} onChange={setNewUsername} />
          <Field
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            type="password"
          />
          <div className="flex items-end">
            <button
              type="button"
              onClick={createAdmin}
              disabled={creating || !newUsername || !newPassword}
              className="rounded-full border border-zinc-700/80 bg-black/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-100 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] disabled:opacity-50"
            >
              {creating ? "Creating…" : "Create admin"}
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {admins.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800 bg-black/40 p-5 text-sm text-zinc-400">
              No admins found.
            </div>
          ) : (
            admins.map((a) => (
              <div
                key={a.id}
                className="flex flex-col justify-between gap-3 rounded-3xl border border-zinc-800 bg-black/40 p-5 sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{a.username}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Created {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteAdmin(a.id)}
                  className="rounded-full border border-red-400/40 px-4 py-1.5 text-xs text-red-200 hover:border-red-400/70"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-glass rounded-3xl p-5 sm:p-6">
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </span>
      <input
        type={type ?? "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
      />
    </label>
  );
}

