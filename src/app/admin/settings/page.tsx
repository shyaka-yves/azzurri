"use client";

import { useEffect, useState } from "react";
import type { SiteContent, BlockedDate } from "@/lib/siteContent";

type AdminUser = {
  id: string;
  username: string;
  createdAt: string;
};

export default function AdminSettingsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);

  // Blocked Reservation Dates state
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [newBlockedReason, setNewBlockedReason] = useState("");
  const [newBlockedZone, setNewBlockedZone] = useState<"all" | "restaurant" | "club">("all");
  const [savingBlockedDates, setSavingBlockedDates] = useState(false);
  const [blockedDateError, setBlockedDateError] = useState<string | null>(null);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [aRes, cRes] = await Promise.all([
        fetch("/api/admin/users", { cache: "no-store" }),
        fetch("/api/admin/content", { cache: "no-store" }),
      ]);
      const aData = (await aRes.json()) as any;
      const cData = (await cRes.json()) as any;
      if (!aData.ok) throw new Error(aData.error ?? "Failed to load admins");
      if (!cData.ok) throw new Error(cData.error ?? "Failed to load content");

      setAdmins(aData.admins ?? []);
      setContent(cData.content ?? null);
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function addBlockedDate() {
    setBlockedDateError(null);
    if (!newBlockedDate) {
      setBlockedDateError("Please select a date to block.");
      return;
    }

    if (!content) {
      setBlockedDateError("Site content not loaded yet. Please refresh.");
      return;
    }

    const existingList: BlockedDate[] = content.blockedDates || [];
    const isDuplicate = existingList.some((b) => {
      if (b.date !== newBlockedDate) return false;
      if (!b.zone || b.zone === "all") return true;
      if (newBlockedZone === "all") return true;
      return b.zone === newBlockedZone;
    });

    if (isDuplicate) {
      setBlockedDateError(
        `Date ${newBlockedDate} is already blocked${newBlockedZone === "all" ? "" : ` for ${newBlockedZone}`}.`
      );
      return;
    }

    const newEntry: BlockedDate = {
      date: newBlockedDate,
      reason: newBlockedReason.trim(),
      zone: newBlockedZone,
    };

    const updatedBlockedDates = [...existingList, newEntry].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    const updatedContent: SiteContent = {
      ...content,
      blockedDates: updatedBlockedDates,
    };

    setSavingBlockedDates(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContent),
      });
      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Failed to save blocked date");

      setContent(updatedContent);
      setNewBlockedDate("");
      setNewBlockedReason("");
      setNewBlockedZone("all");
      setBlockedDateError(null);
    } catch (err: any) {
      setBlockedDateError(err instanceof Error ? err.message : "Failed to block date");
    } finally {
      setSavingBlockedDates(false);
    }
  }

  async function removeBlockedDate(indexToRemove: number) {
    if (!content) return;
    setBlockedDateError(null);
    const existingList = content.blockedDates || [];
    const updatedBlockedDates = existingList.filter((_, idx) => idx !== indexToRemove);
    const updatedContent: SiteContent = {
      ...content,
      blockedDates: updatedBlockedDates,
    };

    const prevContent = content;
    setContent(updatedContent);

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContent),
      });
      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Failed to unblock date");
    } catch (err: any) {
      setContent(prevContent);
      setBlockedDateError(err instanceof Error ? err.message : "Failed to unblock date");
    }
  }

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

      <Card title="Blocked Reservation Dates">
        <p className="text-xs text-zinc-400 mb-5">
          Select calendar dates on which customers are not allowed to make reservations (e.g. private events, closures, holidays).
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Date *
            </span>
            <input
              type="date"
              value={newBlockedDate}
              onChange={(e) => {
                setNewBlockedDate(e.target.value);
                setBlockedDateError(null);
              }}
              style={{ colorScheme: "dark" }}
              className="h-11 w-full rounded-xl border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
          </div>

          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Area / Zone
            </span>
            <select
              value={newBlockedZone}
              onChange={(e) => {
                setNewBlockedZone(e.target.value as "all" | "restaurant" | "club");
                setBlockedDateError(null);
              }}
              className="h-11 w-full rounded-xl border border-zinc-700/80 bg-black/60 px-3 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
            >
              <option value="all">Both (Restaurant &amp; Club)</option>
              <option value="restaurant">Restaurant Only</option>
              <option value="club">Club Only</option>
            </select>
          </div>

          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Reason (Optional)
            </span>
            <input
              type="text"
              placeholder="e.g. Private Event, Public Holiday"
              value={newBlockedReason}
              onChange={(e) => setNewBlockedReason(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={addBlockedDate}
              disabled={savingBlockedDates || !newBlockedDate}
              className="h-11 w-full rounded-full border border-zinc-700/80 bg-black/40 px-5 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-100 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] disabled:opacity-50 transition"
            >
              {savingBlockedDates ? "Saving…" : "Block Date"}
            </button>
          </div>
        </div>

        {blockedDateError ? (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-300">
            {blockedDateError}
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          {(!content?.blockedDates || content.blockedDates.length === 0) ? (
            <div className="rounded-3xl border border-zinc-800 bg-black/40 p-5 text-sm text-zinc-400">
              No blocked dates. All calendar dates are available for reservations.
            </div>
          ) : (
            content.blockedDates.map((item, idx) => (
              <div
                key={`${item.date}-${item.zone || "all"}-${idx}`}
                className="flex flex-col justify-between gap-3 rounded-3xl border border-zinc-800 bg-black/40 p-5 sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-white">{item.date}</p>
                    {item.zone && item.zone !== "all" ? (
                      <span className="rounded-full bg-zinc-800/80 border border-zinc-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                        {item.zone === "restaurant" ? "Restaurant" : "Club"}
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-800/80 border border-zinc-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Both Zones
                      </span>
                    )}
                  </div>
                  {item.reason ? (
                    <p className="mt-1 text-xs text-zinc-400">
                      Reason: <span className="text-zinc-200">{item.reason}</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-xs italic text-zinc-500">No reason specified</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeBlockedDate(idx)}
                  className="rounded-full border border-red-400/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-red-200 hover:border-red-400/70 hover:bg-red-500/10 transition"
                >
                  Unblock
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

