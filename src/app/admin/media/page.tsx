"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type MediaFile = { name: string; url: string; type: "image" | "video" | "pdf" };

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const videos = useMemo(() => files.filter((f) => f.type === "video"), [files]);
  const images = useMemo(() => files.filter((f) => f.type === "image"), [files]);
  const pdfs = useMemo(() => files.filter((f) => f.type === "pdf"), [files]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/media", { cache: "no-store" });
      const data = (await res.json()) as
        | { ok: true; files: MediaFile[] }
        | { ok: false; error: string };
      if (!data.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }
      setFiles(data.files);
      setLoading(false);
    } catch {
      setError("Failed to load media");
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      // 1. Get signed upload URL
      const urlRes = await fetch("/api/admin/media/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      const urlData = (await urlRes.json()) as {
        ok: boolean;
        signedUrl: string;
        path: string;
        error?: string;
      };

      if (!urlData.ok) {
        setError(urlData.error ?? "Failed to get upload URL");
        setUploading(false);
        return;
      }

      // 2. Upload directly to Supabase
      const uploadRes = await fetch(urlData.signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) {
        setError("Upload to storage failed");
        setUploading(false);
        return;
      }

      // 3. Refresh list
      await refresh();
      setUploading(false);
    } catch (err) {
      console.error(err);
      setError("Upload failed");
      setUploading(false);
    }
  }

  async function onDelete(name: string) {
    const yes = window.confirm(`Delete ${name}?`);
    if (!yes) return;
    setError(null);
    try {
      const res = await fetch("/api/admin/media/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error ?? "Delete failed");
        return;
      }
      await refresh();
    } catch {
      setError("Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
            Media Library
          </p>
          <h1 className="mt-2 text-xl font-semibold text-white">
            Upload images, videos & PDFs
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Files are stored in <span className="text-zinc-200">Supabase Storage</span>{" "}
            and can be selected in the Content editor.
          </p>
          <div className="mt-3 rounded-lg border border-zinc-800 bg-black/40 px-4 py-3 text-xs text-zinc-400">
            <p className="font-medium text-zinc-300 mb-2">Recommended image sizes:</p>
            <ul className="space-y-1">
              <li><span className="text-[#D4AF37]">Event cards:</span> 1080×1350px (IG post)</li>
              <li><span className="text-[#D4AF37]">Gallery cards:</span> 1080×1080px (square) or 1080×1350px</li>
              <li><span className="text-[#D4AF37]">Hero / About / Excellence:</span> 1080×1350px or 1920×1080px</li>
            </ul>
          </div>
        </div>

        <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-zinc-700/80 bg-black/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-100 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]">
          <input
            type="file"
            className="hidden"
            accept="image/*,video/mp4,video/webm,video/quicktime,application/pdf"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
              e.currentTarget.value = "";
            }}
          />
          {uploading ? "Uploading..." : "Upload"}
        </label>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-zinc-400">Loading media…</div>
      ) : (
        <div className="space-y-8">
          <Section title={`Images (${images.length})`}>
            <div className="grid gap-4 md:grid-cols-3">
              {images.map((f) => (
                <MediaCard key={f.name} file={f} onDelete={onDelete} />
              ))}
            </div>
          </Section>

          <Section title={`Videos (${videos.length})`}>
            <div className="grid gap-4 md:grid-cols-2">
              {videos.map((f) => (
                <VideoCard key={f.name} file={f} onDelete={onDelete} />
              ))}
            </div>
          </Section>

          <Section title={`PDFs (${pdfs.length})`}>
            <div className="grid gap-4 md:grid-cols-3">
              {pdfs.map((f) => (
                <PdfCard key={f.name} file={f} onDelete={onDelete} />
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-white">{title}</p>
      {children}
    </div>
  );
}

function MediaCard({
  file,
  onDelete,
}: {
  file: MediaFile;
  onDelete: (name: string) => void;
}) {
  return (
    <div className="card-glass overflow-hidden rounded-3xl">
      <div className="relative h-40">
        <Image src={file.url} alt={file.name} fill className="object-cover" />
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-zinc-300">{file.name}</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {file.type}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDelete(file.name)}
          className="rounded-full border border-zinc-700/80 px-3 py-1 text-xs text-zinc-200 hover:border-red-400/50 hover:text-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function VideoCard({
  file,
  onDelete,
}: {
  file: MediaFile;
  onDelete: (name: string) => void;
}) {
  return (
    <div className="card-glass overflow-hidden rounded-3xl">
      <div className="relative">
        <video src={file.url} controls className="h-56 w-full bg-black" />
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-zinc-300">{file.name}</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {file.type}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDelete(file.name)}
          className="rounded-full border border-zinc-700/80 px-3 py-1 text-xs text-zinc-200 hover:border-red-400/50 hover:text-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function PdfCard({
  file,
  onDelete,
}: {
  file: MediaFile;
  onDelete: (name: string) => void;
}) {
  return (
    <div className="card-glass overflow-hidden rounded-3xl">
      <div className="flex h-32 items-center justify-center bg-zinc-900/80">
        <span className="text-4xl text-zinc-500">PDF</span>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-zinc-300">{file.name}</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {file.type}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDelete(file.name)}
          className="rounded-full border border-zinc-700/80 px-3 py-1 text-xs text-zinc-200 hover:border-red-400/50 hover:text-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

