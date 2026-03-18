"use client";

import { useEffect, useMemo, useState } from "react";

type Reservation = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  date?: string;
  guests?: number;
  notes?: string;
  status: "new" | "contacted" | "closed";
  zone?: "restaurant" | "club";
};

export default function AdminReservationsPage() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<"all" | "today" | "week" | "month">("all");

  const filtered = useMemo(() => {
    let list = [...items];
    const now = new Date();

    if (filter === "today") {
      list = list.filter(item => {
        const d = new Date(item.date || item.createdAt);
        return d.toDateString() === now.toDateString();
      });
    } else if (filter === "week") {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      list = list.filter(item => new Date(item.date || item.createdAt) >= oneWeekAgo);
    } else if (filter === "month") {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      list = list.filter(item => new Date(item.date || item.createdAt) >= oneMonthAgo);
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [items, filter]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reservations", { cache: "no-store" });
      const data = (await res.json()) as
        | { ok: true; items: Reservation[] }
        | { ok: false; error: string };
      if (!data.ok) throw new Error(data.error);
      setItems(data.items);
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reservations");
      setLoading(false);
    }
  }

  function downloadCSV() {
    if (filtered.length === 0) return;

    const headers = ["Name", "Email", "Phone", "Zone", "Date", "Guests", "Status", "Created At", "Notes"];
    const rows = filtered.map(r => [
      r.name,
      r.email,
      r.phone || "",
      r.zone || "restaurant",
      r.date || "",
      r.guests?.toString() || "",
      r.status,
      new Date(r.createdAt).toLocaleString(),
      (r.notes || "").replace(/"/g, '""')
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reservations_${filter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function setStatus(id: string, status: Reservation["status"]) {
    setError(null);
    try {
      const res = await fetch("/api/admin/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Update failed");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
            Reservations
          </p>
          <h1 className="mt-2 text-xl font-semibold text-white">
            Booking requests inbox
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {filtered.length} reservations found
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full border border-zinc-700/80 bg-black/40 p-1">
            {(["all", "today", "week", "month"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${filter === f ? "bg-[#D4AF37] text-black" : "text-zinc-400 hover:text-white"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={downloadCSV}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700/80 bg-black/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-100 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] disabled:opacity-50"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>

          <button
            type="button"
            onClick={refresh}
            className="rounded-full border border-zinc-700/80 bg-black/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-100 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
          >
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-zinc-400">Loading reservations…</div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-black/40">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-zinc-300 sm:text-sm">
              <thead className="bg-zinc-900/80 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Guests</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-xs text-zinc-500"
                    >
                      No reservations found for this period.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="border-t border-zinc-800/80">
                      <td className="max-w-[140px] px-4 py-3">
                        <div className="truncate font-medium text-zinc-100">
                          {r.name}
                        </div>
                      </td>
                      <td className="max-w-[180px] px-4 py-3">
                        <div className="truncate text-xs text-zinc-300">
                          {r.email}
                        </div>
                        {r.phone ? (
                          <div className="truncate text-[11px] text-zinc-500">
                            {r.phone}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          r.zone === "club" 
                            ? "bg-blue-500/10 text-blue-300 border border-blue-500/30" 
                            : "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30"
                        }`}>
                          {r.zone === "club" ? "Club & Lounge" : "Restaurant"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">{r.date || "—"}</td>
                      <td className="px-4 py-3 text-xs">
                        {r.guests ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${r.status === "new"
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                            : r.status === "contacted"
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/40"
                              : "bg-zinc-700/20 text-zinc-300 border border-zinc-600/60"
                            }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-zinc-500">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {r.status === "new" && (
                            <>
                              <Action
                                onClick={() => setStatus(r.id, "contacted")}
                              >
                                Mark contacted
                              </Action>
                              <Action
                                onClick={() => setStatus(r.id, "closed")}
                                variant="danger"
                              >
                                Close
                              </Action>
                            </>
                          )}
                          {r.status === "contacted" && (
                            <>
                              <Action onClick={() => setStatus(r.id, "new")}>
                                Back to new
                              </Action>
                              <Action
                                onClick={() => setStatus(r.id, "closed")}
                                variant="danger"
                              >
                                Close
                              </Action>
                            </>
                          )}
                          {r.status === "closed" && (
                            <Action onClick={() => setStatus(r.id, "new")}>
                              Reopen
                            </Action>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Action({
  children,
  onClick,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs ${variant === "danger"
        ? "border-red-400/40 text-red-200 hover:border-red-400/70"
        : "border-zinc-700/80 text-zinc-200 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
        }`}
    >
      {children}
    </button>
  );
}

