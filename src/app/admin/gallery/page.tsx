"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type MediaFile = { name: string; url: string; type: "image" | "video" };
type GalleryImage = { id: string; imageUrl: string; label: string; order: number; createdAt: string };

export default function AdminGalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [availableImages, setAvailableImages] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");

  async function refreshGallery() {
    try {
      const res = await fetch("/api/admin/gallery", { cache: "no-store" });
      const data = (await res.json()) as { ok: boolean; images?: GalleryImage[]; error?: string };
      if (!data.ok) {
        setError(data.error ?? "Failed to load gallery");
        return;
      }
      setGalleryImages(data.images ?? []);
    } catch {
      setError("Failed to load gallery");
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
      await Promise.all([refreshGallery(), refreshMedia()]);
      setLoading(false);
    }
    load();
  }, []);

  async function addToGallery() {
    if (!selectedImageUrl || !selectedLabel.trim()) {
      setError("Please select an image and enter a label");
      return;
    }

    setError(null);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: selectedImageUrl, label: selectedLabel.trim() }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error ?? "Failed to add image");
        return;
      }
      await refreshGallery();
      setShowAddModal(false);
      setSelectedImageUrl("");
      setSelectedLabel("");
    } catch {
      setError("Failed to add image");
    }
  }

  async function updateLabel(id: string, newLabel: string) {
    setError(null);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, label: newLabel.trim() }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error ?? "Failed to update label");
        return;
      }
      await refreshGallery();
    } catch {
      setError("Failed to update label");
    }
  }

  async function deleteFromGallery(id: string) {
    const yes = window.confirm("Remove this image from the gallery?");
    if (!yes) return;

    setError(null);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error ?? "Failed to remove image");
        return;
      }
      await refreshGallery();
    } catch {
      setError("Failed to remove image");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">Gallery Management</p>
          <h1 className="mt-2 text-xl font-semibold text-white">Manage Gallery Images</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Select images from your media library to display on the gallery page.
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Recommended image size: 1080×1080px (square) or 1080×1350px
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddModal(true);
            refreshMedia();
          }}
          className="gold-gradient inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black"
        >
          Add Image
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-zinc-400">Loading gallery…</div>
      ) : (
        <>
          {galleryImages.length === 0 ? (
            <div className="card-glass rounded-3xl p-8 text-center">
              <p className="text-sm text-zinc-400">No images in gallery yet.</p>
              <p className="mt-2 text-xs text-zinc-500">Click "Add Image" to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {galleryImages.map((img) => (
                <GalleryImageCard
                  key={img.id}
                  image={img}
                  onUpdateLabel={(label) => updateLabel(img.id, label)}
                  onDelete={() => deleteFromGallery(img.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {showAddModal && (
        <AddImageModal
          availableImages={availableImages}
          selectedImageUrl={selectedImageUrl}
          selectedLabel={selectedLabel}
          onImageSelect={setSelectedImageUrl}
          onLabelChange={setSelectedLabel}
          onAdd={addToGallery}
          onClose={() => {
            setShowAddModal(false);
            setSelectedImageUrl("");
            setSelectedLabel("");
          }}
        />
      )}
    </div>
  );
}

function GalleryImageCard({
  image,
  onUpdateLabel,
  onDelete,
}: {
  image: GalleryImage;
  onUpdateLabel: (label: string) => void;
  onDelete: () => void;
}) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(image.label);

  return (
    <div className="card-glass overflow-hidden rounded-3xl">
      <div className="relative h-48">
        <Image src={image.imageUrl} alt={image.label} fill className="object-cover" />
      </div>
      <div className="space-y-2 px-4 py-3">
        {editingLabel ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
              onBlur={() => {
                if (labelValue.trim() && labelValue !== image.label) {
                  onUpdateLabel(labelValue);
                } else {
                  setLabelValue(image.label);
                }
                setEditingLabel(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (labelValue.trim() && labelValue !== image.label) {
                    onUpdateLabel(labelValue);
                  }
                  setEditingLabel(false);
                } else if (e.key === "Escape") {
                  setLabelValue(image.label);
                  setEditingLabel(false);
                }
              }}
              className="flex-1 rounded border border-zinc-700/80 bg-black/60 px-2 py-1 text-xs text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              autoFocus
            />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <p
              className="cursor-pointer text-xs font-medium text-zinc-200 hover:text-[#D4AF37]"
              onClick={() => setEditingLabel(true)}
            >
              {image.label}
            </p>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full border border-zinc-700/80 px-3 py-1 text-xs text-zinc-200 hover:border-red-400/50 hover:text-red-200"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AddImageModal({
  availableImages,
  selectedImageUrl,
  selectedLabel,
  onImageSelect,
  onLabelChange,
  onAdd,
  onClose,
}: {
  availableImages: MediaFile[];
  selectedImageUrl: string;
  selectedLabel: string;
  onImageSelect: (url: string) => void;
  onLabelChange: (label: string) => void;
  onAdd: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="card-glass w-full max-w-2xl rounded-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Add Image to Gallery</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
            type="button"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 mb-2">
              Select Image
            </label>
            <p className="mb-2 text-xs text-zinc-500">
              Recommended: 1080×1080px (square) or 1080×1350px
            </p>
            <div className="grid gap-3 max-h-64 overflow-y-auto md:grid-cols-3">
              {availableImages.length === 0 ? (
                <p className="col-span-full text-sm text-zinc-500 text-center py-4">
                  No images available. Upload images in Media Library first.
                </p>
              ) : (
                availableImages.map((img) => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => onImageSelect(img.url)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition ${
                      selectedImageUrl === img.url
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

          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 mb-2">
              Label (e.g., "Food", "Drinks", "Interior")
            </label>
            <input
              type="text"
              value={selectedLabel}
              onChange={(e) => onLabelChange(e.target.value)}
              placeholder="Enter label"
              className="w-full rounded border border-zinc-700/80 bg-black/60 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-zinc-700/80 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onAdd}
              disabled={!selectedImageUrl || !selectedLabel.trim()}
              className="gold-gradient rounded px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              Add to Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
