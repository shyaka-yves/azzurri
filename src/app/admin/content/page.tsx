"use client";

import { useEffect, useMemo, useState } from "react";

type SiteContent = unknown;

type MediaFile = { name: string; url: string; type: "image" | "video" | "pdf" };

export default function AdminContentPage() {
  const [content, setContent] = useState<any>(null);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const imageOptions = useMemo(
    () => media.filter((m) => m.type === "image"),
    [media]
  );
  const videoOptions = useMemo(
    () => media.filter((m) => m.type === "video"),
    [media]
  );
  const pdfOptions = useMemo(
    () => media.filter((m) => m.type === "pdf"),
    [media]
  );

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [cRes, mRes] = await Promise.all([
        fetch("/api/admin/content", { cache: "no-store" }),
        fetch("/api/admin/media", { cache: "no-store" }),
      ]);

      const cData = (await cRes.json()) as any;
      const mData = (await mRes.json()) as any;

      if (!cData.ok) throw new Error(cData.error ?? "Failed to load content");
      if (!mData.ok) throw new Error(mData.error ?? "Failed to load media");

      setContent(cData.content);
      setMedia(mData.files);
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    setOkMsg(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content as SiteContent),
      });
      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Save failed");
      }
      setOkMsg("Saved");
      setSaving(false);
      setTimeout(() => setOkMsg(null), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-zinc-400">Loading content…</div>;
  }

  if (!content) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        Failed to load content.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
            Content
          </p>
          <h1 className="mt-2 text-xl font-semibold text-white">
            Hero & content images
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Change hero background (image or video) and all content images. Upload files in{" "}
            <a className="text-zinc-200 underline" href="/admin/media">Media Library</a>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {okMsg ? (
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
              {okMsg}
            </span>
          ) : null}
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="gold-gradient inline-flex h-10 items-center justify-center rounded-full px-5 text-xs font-semibold uppercase tracking-[0.18em] text-black disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <EditorCard title="Hero Content">
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Brand Name</p>
              <input
                type="text"
                value={content.hero.brand}
                onChange={(e) => setContent((c: any) => ({ ...c, hero: { ...c.hero, brand: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Tagline</p>
              <input
                type="text"
                value={content.hero.tagline}
                onChange={(e) => setContent((c: any) => ({ ...c, hero: { ...c.hero, tagline: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Headline</p>
              <input
                type="text"
                value={content.hero.headline || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, hero: { ...c.hero, headline: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Sub-headline</p>
              <input
                type="text"
                value={content.hero.subheadline || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, hero: { ...c.hero, subheadline: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Primary CTA (Label)</p>
              <input
                type="text"
                value={content.hero.primaryCtaLabel}
                onChange={(e) => setContent((c: any) => ({ ...c, hero: { ...c.hero, primaryCtaLabel: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Secondary CTA (Label)</p>
              <input
                type="text"
                value={content.hero.secondaryCtaLabel}
                onChange={(e) => setContent((c: any) => ({ ...c, hero: { ...c.hero, secondaryCtaLabel: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Media type"
              value={content.hero.mediaType}
              options={[
                { label: "Image", value: "image" },
                { label: "Video", value: "video" },
              ]}
              onChange={(v) =>
                setContent((c: any) => ({ ...c, hero: { ...c.hero, mediaType: v } }))
              }
            />
            <div className="space-y-3">
              <Select
                label="Choose from Media Library"
                value={content.hero.mediaSrc}
                options={[
                  { label: "— Select —", value: "" },
                  ...(content.hero.mediaType === "video"
                    ? videoOptions.map((m) => ({ label: m.name, value: m.url }))
                    : imageOptions.map((m) => ({ label: m.name, value: m.url }))),
                ]}
                onChange={(v) =>
                  setContent((c: any) => ({ ...c, hero: { ...c.hero, mediaSrc: v } }))
                }
              />
              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Or paste media URL / path
                </p>
                <input
                  type="text"
                  value={content.hero.mediaSrc}
                  onChange={(e) =>
                    setContent((c: any) => ({
                      ...c,
                      hero: { ...c.hero, mediaSrc: e.target.value },
                    }))
                  }
                  placeholder="e.g. /uploads/hero.mp4 or https://..."
                  className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </EditorCard>

      <EditorCard title="About Azzurri">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Eyebrow</p>
              <input
                type="text"
                value={content.about.eyebrow}
                onChange={(e) => setContent((c: any) => ({ ...c, about: { ...c.about, eyebrow: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Title</p>
              <input
                type="text"
                value={content.about.title}
                onChange={(e) => setContent((c: any) => ({ ...c, about: { ...c.about, title: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            {(content.about.paragraphs || []).map((p: string, i: number) => (
              <div key={i} className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Paragraph {i + 1}</p>
                <textarea
                  value={p}
                  onChange={(e) => setContent((c: any) => {
                    const paras = [...(c.about.paragraphs || [])];
                    paras[i] = e.target.value;
                    return { ...c, about: { ...c.about, paragraphs: paras } };
                  })}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-zinc-700/80 bg-black/70 p-3 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <Select
              label="Choose Image from Media Library"
              value={content.about.imageSrc}
              options={[
                { label: "— Select —", value: "" },
                ...imageOptions.map((m) => ({ label: m.name, value: m.url })),
              ]}
              onChange={(v) =>
                setContent((c: any) => ({ ...c, about: { ...c.about, imageSrc: v } }))
              }
            />
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                Or paste image URL / path
              </p>
              <input
                type="text"
                value={content.about.imageSrc}
                onChange={(e) =>
                  setContent((c: any) => ({
                    ...c,
                    about: { ...c.about, imageSrc: e.target.value },
                  }))
                }
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Azzurri Excellence (Standard)">
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Eyebrow</p>
            <input
              type="text"
              value={content.excellence.eyebrow || ""}
              onChange={(e) => setContent((c: any) => ({ ...c, excellence: { ...c.excellence, eyebrow: e.target.value } }))}
              className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Heading</p>
              <input
                type="text"
                value={content.excellence.title}
                onChange={(e) => setContent((c: any) => ({ ...c, excellence: { ...c.excellence, title: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Quote/Accent Text</p>
              <input
                type="text"
                value={content.excellence.quote || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, excellence: { ...c.excellence, quote: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Description Body</p>
            <textarea
              value={content.excellence.description}
              onChange={(e) => setContent((c: any) => ({ ...c, excellence: { ...c.excellence, description: e.target.value } }))}
              rows={4}
              className="mt-2 w-full rounded-xl border border-zinc-700/80 bg-black/70 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <Select
              label="Choose Image from Media Library"
              value={content.excellence.imageSrc}
              options={[
                { label: "— Select —", value: "" },
                ...imageOptions.map((m) => ({ label: m.name, value: m.url })),
              ]}
              onChange={(v) =>
                setContent((c: any) => ({
                  ...c,
                  excellence: { ...c.excellence, imageSrc: v },
                }))
              }
            />
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Or paste image URL</p>
              <input
                type="text"
                value={content.excellence.imageSrc}
                onChange={(e) => setContent((c: any) => ({ ...c, excellence: { ...c.excellence, imageSrc: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </EditorCard>

      <EditorCard title="A Taste of Kigali (Description Section)">
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Heading</p>
            <input
              type="text"
              value={content.descriptionSection?.heading || ""}
              onChange={(e) => setContent((c: any) => ({ ...c, descriptionSection: { ...c.descriptionSection, heading: e.target.value } }))}
              className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          {(content.descriptionSection?.paragraphs || []).map((p: string, i: number) => (
            <div key={i} className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Paragraph {i + 1}</p>
              <textarea
                value={p}
                onChange={(e) => setContent((c: any) => {
                  const paras = [...(c.descriptionSection.paragraphs || [])];
                  paras[i] = e.target.value;
                  return { ...c, descriptionSection: { ...c.descriptionSection, paragraphs: paras } };
                })}
                rows={3}
                className="mt-2 w-full rounded-xl border border-zinc-700/80 bg-black/70 p-3 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          ))}
        </div>
      </EditorCard>

      <EditorCard title="Upcoming Events Meta">
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Eyebrow</p>
            <input
              type="text"
              value={content.events.eyebrow || ""}
              onChange={(e) => setContent((c: any) => ({ ...c, events: { ...c.events, eyebrow: e.target.value } }))}
              className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Section Title</p>
              <input
                type="text"
                value={content.events.title || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, events: { ...c.events, title: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Section Description</p>
              <input
                type="text"
                value={content.events.description || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, events: { ...c.events, description: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Upcoming Events Images (Static Fallbacks)">
        <div className="grid gap-4 md:grid-cols-2">
          {(content.events.items ?? []).map((_: any, i: number) => (
            <Select
              key={i}
              label={`Event ${i + 1} image`}
              value={content.events.items[i].imageSrc}
              options={[
                { label: "— Select —", value: "" },
                ...imageOptions.map((m) => ({ label: m.name, value: m.url })),
              ]}
              onChange={(v) =>
                setContent((c: any) => {
                  const items = [...(c.events.items ?? [])];
                  if (!items[i]) items[i] = { date: "", title: "", description: "", imageSrc: "" };
                  items[i] = { ...items[i], imageSrc: v };
                  return { ...c, events: { ...c.events, items } };
                })
              }
            />
          ))}
        </div>
      </EditorCard>

      <EditorCard title="Tasting Notes (Menu Intro)">
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Eyebrow</p>
            <input
              type="text"
              value={content.menuIntro.eyebrow || ""}
              onChange={(e) => setContent((c: any) => ({ ...c, menuIntro: { ...c.menuIntro, eyebrow: e.target.value } }))}
              className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Title</p>
              <input
                type="text"
                value={content.menuIntro.title || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, menuIntro: { ...c.menuIntro, title: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Description</p>
              <input
                type="text"
                value={content.menuIntro.description || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, menuIntro: { ...c.menuIntro, description: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <Select
              label="Choose from Media Library"
              value={content.menuIntro?.imageSrc || ""}
              options={[
                { label: "— Select —", value: "" },
                ...imageOptions.map((m) => ({ label: m.name, value: m.url })),
              ]}
              onChange={(v) =>
                setContent((c: any) => ({
                  ...c,
                  menuIntro: { ...c.menuIntro, imageSrc: v },
                }))
              }
            />
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                Or paste image URL / path
              </p>
              <input
                type="text"
                value={content.menuIntro?.imageSrc || ""}
                onChange={(e) =>
                  setContent((c: any) => ({
                    ...c,
                    menuIntro: { ...c.menuIntro, imageSrc: e.target.value },
                  }))
                }
                placeholder="e.g. /uploads/tasting-notes.jpg or https://..."
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Menu PDFs">
        <div className="grid gap-8">
          <div className="space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">Restaurant Menu</h3>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <Select
                label="Choose from Media Library"
                value={content.menu?.restaurantPdfUrl || ""}
                options={[
                  { label: "— Select —", value: "" },
                  ...pdfOptions.map((m) => ({ label: m.name, value: m.url })),
                ]}
                onChange={(v) =>
                  setContent((c: any) => ({
                    ...c,
                    menu: { ...c.menu, restaurantPdfUrl: v },
                  }))
                }
              />
              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Or paste PDF URL
                </p>
                <input
                  type="text"
                  value={content.menu?.restaurantPdfUrl || ""}
                  onChange={(e) =>
                    setContent((c: any) => ({
                      ...c,
                      menu: { ...c.menu, restaurantPdfUrl: e.target.value },
                    }))
                  }
                  className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-zinc-800">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">Club Menu</h3>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <Select
                label="Choose from Media Library"
                value={content.menu?.clubPdfUrl || ""}
                options={[
                  { label: "— Select —", value: "" },
                  ...pdfOptions.map((m) => ({ label: m.name, value: m.url })),
                ]}
                onChange={(v) =>
                  setContent((c: any) => ({
                    ...c,
                    menu: { ...c.menu, clubPdfUrl: v },
                  }))
                }
              />
              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Or paste PDF URL
                </p>
                <input
                  type="text"
                  value={content.menu?.clubPdfUrl || ""}
                  onChange={(e) =>
                    setContent((c: any) => ({
                      ...c,
                      menu: { ...c.menu, clubPdfUrl: e.target.value },
                    }))
                  }
                  className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Blog section">
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Section Eyebrow
            </p>
            <input
              type="text"
              value={content.blog.eyebrow || ""}
              onChange={(e) =>
                setContent((c: any) => ({ ...c, blog: { ...c.blog, eyebrow: e.target.value } }))
              }
              placeholder="e.g. From Our Blog"
              className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Section Title
            </p>
            <input
              type="text"
              value={content.blog.title || ""}
              onChange={(e) =>
                setContent((c: any) => ({ ...c, blog: { ...c.blog, title: e.target.value } }))
              }
              placeholder="e.g. Latest News & Updates"
              className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-8">
          {(content.blog.items ?? []).map((_: any, i: number) => (
            <div key={i} className="relative space-y-4 rounded-3xl border border-zinc-800 bg-black/20 p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-300">Blog Item {i + 1}</p>
                <button
                  onClick={() =>
                    setContent((c: any) => {
                      const items = [...(c.blog.items ?? [])];
                      items.splice(i, 1);
                      return { ...c, blog: { ...c.blog, items } };
                    })
                  }
                  className="text-xs font-medium text-red-400 hover:text-red-300 transition"
                  type="button"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Select
                  label="Image"
                  value={content.blog.items[i].imageSrc || ""}
                  options={[
                    { label: "— Select —", value: "" },
                    ...imageOptions.map((m) => ({ label: m.name, value: m.url })),
                  ]}
                  onChange={(v) =>
                    setContent((c: any) => {
                      const items = [...(c.blog.items ?? [])];
                      if (!items[i]) items[i] = { category: "", title: "", excerpt: "", imageSrc: "" };
                      items[i] = { ...items[i], imageSrc: v };
                      return { ...c, blog: { ...c.blog, items } };
                    })
                  }
                />

                <div className="space-y-4">
                  <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                      Category
                    </p>
                    <input
                      type="text"
                      value={content.blog.items[i].category || ""}
                      onChange={(e) =>
                        setContent((c: any) => {
                          const items = [...(c.blog.items ?? [])];
                          if (!items[i]) items[i] = { category: "", title: "", excerpt: "", imageSrc: "" };
                          items[i] = { ...items[i], category: e.target.value };
                          return { ...c, blog: { ...c.blog, items } };
                        })
                      }
                      placeholder="e.g. Chef's Notes"
                      className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                      Title
                    </p>
                    <input
                      type="text"
                      value={content.blog.items[i].title || ""}
                      onChange={(e) =>
                        setContent((c: any) => {
                          const items = [...(c.blog.items ?? [])];
                          if (!items[i]) items[i] = { category: "", title: "", excerpt: "", imageSrc: "" };
                          items[i] = { ...items[i], title: e.target.value };
                          return { ...c, blog: { ...c.blog, items } };
                        })
                      }
                      className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                      Excerpt
                    </p>
                    <textarea
                      value={content.blog.items[i].excerpt || ""}
                      onChange={(e) =>
                        setContent((c: any) => {
                          const items = [...(c.blog.items ?? [])];
                          if (!items[i]) items[i] = { category: "", title: "", excerpt: "", imageSrc: "" };
                          items[i] = { ...items[i], excerpt: e.target.value };
                          return { ...c, blog: { ...c.blog, items } };
                        })
                      }
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-zinc-700/80 bg-black/70 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setContent((c: any) => ({
                ...c,
                blog: {
                  ...c.blog,
                  items: [
                    ...(c.blog.items ?? []),
                    { category: "", title: "", excerpt: "", imageSrc: "" },
                  ],
                },
              }))
            }
            className="mt-4 flex w-full items-center justify-center rounded-3xl border-2 border-dashed border-zinc-700/50 bg-black/20 py-8 text-sm font-semibold text-zinc-400 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            + Add New Blog Item
          </button>
        </div>
      </EditorCard>

      <EditorCard title="Testimonials section">
        <div className="grid gap-8">
          {(content.testimonials.items ?? []).map((_: any, i: number) => (
            <div key={i} className="relative space-y-4 rounded-3xl border border-zinc-800 bg-black/20 p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-300">Testimonial {i + 1}</p>
                <button
                  onClick={() =>
                    setContent((c: any) => {
                      const items = [...(c.testimonials.items ?? [])];
                      items.splice(i, 1);
                      return { ...c, testimonials: { ...c.testimonials, items } };
                    })
                  }
                  className="text-xs font-medium text-red-400 hover:text-red-300 transition"
                  type="button"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-4 mt-4">
                <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Name</p>
                  <input
                    type="text"
                    value={content.testimonials.items[i].name || ""}
                    onChange={(e) =>
                      setContent((c: any) => {
                        const items = [...(c.testimonials.items ?? [])];
                        items[i] = { ...items[i], name: e.target.value };
                        return { ...c, testimonials: { ...c.testimonials, items } };
                      })
                    }
                    className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Quote</p>
                  <textarea
                    value={content.testimonials.items[i].quote || ""}
                    onChange={(e) =>
                      setContent((c: any) => {
                        const items = [...(c.testimonials.items ?? [])];
                        items[i] = { ...items[i], quote: e.target.value };
                        return { ...c, testimonials: { ...c.testimonials, items } };
                      })
                    }
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-zinc-700/80 bg-black/70 p-3 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setContent((c: any) => ({
                ...c,
                testimonials: {
                  ...c.testimonials,
                  items: [
                    ...(c.testimonials.items ?? []),
                    { quote: "", name: "", rating: 5 },
                  ],
                },
              }))
            }
            className="mt-4 flex w-full items-center justify-center rounded-3xl border-2 border-dashed border-zinc-700/50 bg-black/20 py-8 text-sm font-semibold text-zinc-400 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            + Add New Testimonial
          </button>
        </div>
      </EditorCard>

      <EditorCard title="Menu & Specials">
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Restaurant Menu PDF URL</p>
            <input
              type="text"
              value={content.menu.restaurantPdfUrl || ""}
              onChange={(e) => setContent((c: any) => ({ ...c, menu: { ...c.menu, restaurantPdfUrl: e.target.value } }))}
              placeholder="e.g. /restaurant-menu.pdf or https://..."
              className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Club & Lounge Menu PDF URL</p>
            <input
              type="text"
              value={content.menu.clubPdfUrl || ""}
              onChange={(e) => setContent((c: any) => ({ ...c, menu: { ...c.menu, clubPdfUrl: e.target.value } }))}
              placeholder="e.g. /club-menu.pdf or https://..."
              className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Specialty Title</p>
              <input
                type="text"
                value={content.specialty.title || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, specialty: { ...c.specialty, title: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Special Offers Title</p>
              <input
                type="text"
                value={content.specialOffers.title || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, specialOffers: { ...c.specialOffers, title: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Specialty Content</p>
              <textarea
                value={content.specialty.content || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, specialty: { ...c.specialty, content: e.target.value } }))}
                rows={4}
                className="mt-2 w-full rounded-xl border border-zinc-700/80 bg-black/70 p-3 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Special Offers Content</p>
              <textarea
                value={content.specialOffers.content || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, specialOffers: { ...c.specialOffers, content: e.target.value } }))}
                rows={4}
                className="mt-2 w-full rounded-xl border border-zinc-700/80 bg-black/70 p-3 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Contact Information">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Phone</p>
              <input
                type="text"
                value={content.contact.phone || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, contact: { ...c.contact, phone: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Email</p>
              <input
                type="text"
                value={content.contact.email || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, contact: { ...c.contact, email: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Address Lines (One per line)</p>
              <textarea
                value={(content.contact.addressLines || []).join("\n")}
                onChange={(e) => setContent((c: any) => ({ ...c, contact: { ...c.contact, addressLines: e.target.value.split("\n") } }))}
                rows={3}
                className="mt-2 w-full rounded-xl border border-zinc-700/80 bg-black/70 p-3 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Hours Lines (One per line)</p>
              <textarea
                value={(content.contact.hoursLines || []).join("\n")}
                onChange={(e) => setContent((c: any) => ({ ...c, contact: { ...c.contact, hoursLines: e.target.value.split("\n") } }))}
                rows={3}
                className="mt-2 w-full rounded-xl border border-zinc-700/80 bg-black/70 p-3 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Address Note</p>
            <input
              type="text"
              value={content.contact.addressNote || ""}
              onChange={(e) => setContent((c: any) => ({ ...c, contact: { ...c.contact, addressNote: e.target.value } }))}
              className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Map Embed URL (iframe src)</p>
            <input
              type="text"
              value={content.contact.mapEmbedSrc || ""}
              onChange={(e) => setContent((c: any) => ({ ...c, contact: { ...c.contact, mapEmbedSrc: e.target.value } }))}
              className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Get Directions Link (button URL)</p>
            <input
              type="text"
              value={content.contact.directionsUrl || ""}
              onChange={(e) => setContent((c: any) => ({ ...c, contact: { ...c.contact, directionsUrl: e.target.value } }))}
              className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Reservation Floor Plans">
        <div className="space-y-8">
          {/* Club Floor Plan */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">Club Floor Plan</p>
            {content.reservations?.clubFloorPlanUrl && (
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-zinc-700/50 bg-black/40 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={content.reservations.clubFloorPlanUrl} alt="Club floor plan preview" className="h-16 w-24 rounded-lg object-cover border border-zinc-700/50" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300 truncate">{content.reservations.clubFloorPlanUrl}</p>
                </div>
                <button type="button" onClick={() => setContent((c: any) => ({ ...c, reservations: { ...c.reservations, clubFloorPlanUrl: "" } }))} className="rounded-full border border-red-500/30 px-3 py-1 text-[10px] text-red-300 hover:border-red-400/50">Remove</button>
              </div>
            )}
            <p className="mb-2 text-[10px] uppercase tracking-widest text-zinc-500">Pick from Media Library</p>
            <div className="grid max-h-48 grid-cols-4 gap-2 overflow-y-auto rounded-xl border border-zinc-800 bg-black/20 p-2 md:grid-cols-6">
              {imageOptions.length === 0 ? (
                <p className="col-span-full py-4 text-center text-xs text-zinc-500">No images in Media Library yet.</p>
              ) : (
                imageOptions.map((img) => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => setContent((c: any) => ({ ...c, reservations: { ...c.reservations, clubFloorPlanUrl: img.url } }))}
                    className={`relative h-16 overflow-hidden rounded-lg border-2 transition ${content.reservations?.clubFloorPlanUrl === img.url ? "border-[#D4AF37]" : "border-zinc-700/50 hover:border-zinc-500"}`}
                    title={img.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                  </button>
                ))
              )}
            </div>
            <p className="mt-2 text-[10px] text-zinc-500">Or paste a URL manually:</p>
            <input
              type="text"
              value={content.reservations?.clubFloorPlanUrl || ""}
              onChange={(e) => setContent((c: any) => ({ ...c, reservations: { ...c.reservations, clubFloorPlanUrl: e.target.value } }))}
              placeholder="https://... or /uploads/floorplan-club.png"
              className="mt-1 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* Restaurant Floor Plan */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">Restaurant Floor Plan <span className="text-zinc-500 font-normal normal-case tracking-normal">(Optional)</span></p>
            {content.reservations?.restaurantFloorPlanUrl && (
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-zinc-700/50 bg-black/40 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={content.reservations.restaurantFloorPlanUrl} alt="Restaurant floor plan preview" className="h-16 w-24 rounded-lg object-cover border border-zinc-700/50" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300 truncate">{content.reservations.restaurantFloorPlanUrl}</p>
                </div>
                <button type="button" onClick={() => setContent((c: any) => ({ ...c, reservations: { ...c.reservations, restaurantFloorPlanUrl: "" } }))} className="rounded-full border border-red-500/30 px-3 py-1 text-[10px] text-red-300 hover:border-red-400/50">Remove</button>
              </div>
            )}
            <p className="mb-2 text-[10px] uppercase tracking-widest text-zinc-500">Pick from Media Library</p>
            <div className="grid max-h-48 grid-cols-4 gap-2 overflow-y-auto rounded-xl border border-zinc-800 bg-black/20 p-2 md:grid-cols-6">
              {imageOptions.length === 0 ? (
                <p className="col-span-full py-4 text-center text-xs text-zinc-500">No images in Media Library yet.</p>
              ) : (
                imageOptions.map((img) => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => setContent((c: any) => ({ ...c, reservations: { ...c.reservations, restaurantFloorPlanUrl: img.url } }))}
                    className={`relative h-16 overflow-hidden rounded-lg border-2 transition ${content.reservations?.restaurantFloorPlanUrl === img.url ? "border-[#D4AF37]" : "border-zinc-700/50 hover:border-zinc-500"}`}
                    title={img.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                  </button>
                ))
              )}
            </div>
            <p className="mt-2 text-[10px] text-zinc-500">Or paste a URL manually:</p>
            <input
              type="text"
              value={content.reservations?.restaurantFloorPlanUrl || ""}
              onChange={(e) => setContent((c: any) => ({ ...c, reservations: { ...c.reservations, restaurantFloorPlanUrl: e.target.value } }))}
              placeholder="https://... or /uploads/floorplan-restaurant.png"
              className="mt-1 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Social Media Links">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Instagram (Restaurant)</p>
              <input
                type="text"
                value={content.socialLinks?.instagramRestaurant || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, socialLinks: { ...c.socialLinks, instagramRestaurant: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Instagram (Club & Lounge)</p>
              <input
                type="text"
                value={content.socialLinks?.instagramClub || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, socialLinks: { ...c.socialLinks, instagramClub: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">TikTok</p>
              <input
                type="text"
                value={content.socialLinks?.tikTok || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, socialLinks: { ...c.socialLinks, tikTok: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Facebook</p>
              <input
                type="text"
                value={content.socialLinks?.facebook || ""}
                onChange={(e) => setContent((c: any) => ({ ...c, socialLinks: { ...c.socialLinks, facebook: e.target.value } }))}
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </EditorCard>
    </div>
  );
}

function EditorCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-glass rounded-3xl p-6">
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
      >
        {options.map((o) => (
          <option key={`${o.label}-${o.value}`} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
