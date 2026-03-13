"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type MediaFile = { name: string; url: string; type: "image" | "video" };
type Event = { id: string; date: string; title: string; description: string; imageUrl: string; order: number; createdAt: string };

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [availableImages, setAvailableImages] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ date: "", title: "", description: "", imageUrl: "" });

  async function refreshEvents() {
    try {
      const res = await fetch("/api/admin/events", { cache: "no-store" });
      const data = (await res.json()) as { ok: boolean; events?: Event[]; error?: string };
      if (!data.ok) {
        setError(data.error ?? "Failed to load events");
        return;
      }
      setEvents(data.events ?? []);
    } catch {
      setError("Failed to load events");
    }
  }

  async function refreshMedia() {
    try {
      const res = await fetch("/api/admin/media", { cache: "no-store" });
      const data = (await res.json()) as { ok: boolean; files?: MediaFile[]; error?: string };
      if (!data.ok) return;
      setAvailableImages((data.files ?? []).filter((f) => f.type === "image"));
    } catch {
      // Ignore
    }
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      await Promise.all([refreshEvents(), refreshMedia()]);
      setLoading(false);
    }
    load();
  }, []);

  function openAddModal() {
    setFormData({ date: "", title: "", description: "", imageUrl: "" });
    setEditingId(null);
    setShowAddModal(true);
    refreshMedia();
  }

  function openEditModal(event: Event) {
    setFormData({
      date: event.date,
      title: event.title,
      description: event.description,
      imageUrl: event.imageUrl,
    });
    setEditingId(event.id);
    setShowAddModal(true);
    refreshMedia();
  }

  async function saveEvent() {
    if (!formData.date || !formData.title || !formData.description || !formData.imageUrl) {
      setError("Please fill all fields");
      return;
    }

    setError(null);
    try {
      const url = "/api/admin/events";
      const method = editingId ? "PUT" : "POST";
      const body = editingId
        ? { id: editingId, ...formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error ?? "Failed to save event");
        return;
      }
      await refreshEvents();
      setShowAddModal(false);
      setEditingId(null);
      setFormData({ date: "", title: "", description: "", imageUrl: "" });
    } catch {
      setError("Failed to save event");
    }
  }

  async function deleteEvent(id: string) {
    const yes = window.confirm("Delete this event?");
    if (!yes) return;

    setError(null);
    try {
      const res = await fetch("/api/admin/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error ?? "Failed to delete event");
        return;
      }
      await refreshEvents();
    } catch {
      setError("Failed to delete event");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">Events Management</p>
          <h1 className="mt-2 text-xl font-semibold text-white">Manage Upcoming Events</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Add, edit, or remove events displayed on the home and events pages.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="gold-gradient inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black"
        >
          Add Event
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-zinc-400">Loading events…</div>
      ) : (
        <>
          {events.length === 0 ? (
            <div className="card-glass rounded-3xl p-8 text-center">
              <p className="text-sm text-zinc-400">No events yet.</p>
              <p className="mt-2 text-xs text-zinc-500">Click "Add Event" to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={() => openEditModal(event)}
                  onDelete={() => deleteEvent(event.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {showAddModal && (
        <EventModal
          availableImages={availableImages}
          formData={formData}
          isEditing={!!editingId}
          onFormChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
          onSave={saveEvent}
          onClose={() => {
            setShowAddModal(false);
            setEditingId(null);
            setFormData({ date: "", title: "", description: "", imageUrl: "" });
          }}
        />
      )}
    </div>
  );
}

function EventCard({
  event,
  onEdit,
  onDelete,
}: {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="card-glass overflow-hidden rounded-3xl">
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
      </div>
      <div className="space-y-2 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">{event.date}</p>
        <h3 className="text-sm font-semibold text-white">{event.title}</h3>
        <p className="line-clamp-2 text-xs text-zinc-300">{event.description}</p>
        <div className="flex gap-2 pt-2">
          <button
            onClick={onEdit}
            className="flex-1 rounded border border-zinc-700/80 px-3 py-1 text-xs text-zinc-200 hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="rounded border border-zinc-700/80 px-3 py-1 text-xs text-zinc-200 hover:border-red-400/50 hover:text-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EventModal({
  availableImages,
  formData,
  isEditing,
  onFormChange,
  onSave,
  onClose,
}: {
  availableImages: MediaFile[];
  formData: { date: string; title: string; description: string; imageUrl: string };
  isEditing: boolean;
  onFormChange: (field: string, value: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="card-glass w-full max-w-2xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{isEditing ? "Edit Event" : "Add Event"}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white" type="button">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 mb-2">
              Date/Time Label (e.g., "FRI · SIGNATURE NIGHTS")
            </label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => onFormChange("date", e.target.value)}
              placeholder="FRI · SIGNATURE NIGHTS"
              className="w-full rounded border border-zinc-700/80 bg-black/60 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFormChange("title", e.target.value)}
              placeholder="Event title"
              className="w-full rounded border border-zinc-700/80 bg-black/60 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormChange("description", e.target.value)}
              placeholder="Event description"
              rows={3}
              className="w-full rounded border border-zinc-700/80 bg-black/60 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 mb-2">
              Select Image
            </label>
            <p className="mb-2 text-xs text-zinc-500">
              Recommended: 1080×1350px (IG post size)
            </p>
            <div className="grid gap-3 max-h-48 overflow-y-auto md:grid-cols-3">
              {availableImages.length === 0 ? (
                <p className="col-span-full text-sm text-zinc-500 text-center py-4">
                  No images available. Upload images in Media Library first.
                </p>
              ) : (
                availableImages.map((img) => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => onFormChange("imageUrl", img.url)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition ${
                      formData.imageUrl === img.url
                        ? "border-[#D4AF37]"
                        : "border-zinc-700/50 hover:border-zinc-600"
                    }`}
                  >
                    <Image src={img.url} alt={img.name} fill className="object-cover" />
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-zinc-700/80 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!formData.date || !formData.title || !formData.description || !formData.imageUrl}
              className="gold-gradient rounded px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              {isEditing ? "Update Event" : "Add Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
