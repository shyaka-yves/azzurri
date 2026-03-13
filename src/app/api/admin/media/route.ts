import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getSupabase } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const BUCKET = "uploads";

function fileType(name: string): "image" | "video" | "pdf" {
  const lower = name.toLowerCase();
  if (lower.match(/\.(mp4|webm|mov)$/)) return "video";
  if (lower.match(/\.(pdf)$/)) return "pdf";
  return "image";
}

function publicUrl(filename: string): string {
  const base = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
  return `${base}/storage/v1/object/public/${BUCKET}/${filename}`;
}

export async function GET() {
  let supabase;
  try {
    supabase = getSupabase();
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes("SUPABASE_URL")
        ? 'Server is missing "SUPABASE_URL" or "SUPABASE_SERVICE_ROLE_KEY". Set these environment variables in your Vercel project (see .env.example).'
        : err instanceof Error
          ? err.message
          : "Failed to initialize Supabase client.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }

  const { data: list, error } = await supabase.storage
    .from(BUCKET)
    .list("", { sortBy: { column: "name", order: "asc" } });

  if (error) {
    const msg =
      error.message?.toLowerCase().includes("not found") ||
      error.message?.toLowerCase().includes("bucket")
        ? `Storage bucket "${BUCKET}" not found. Create a public bucket named "uploads" in Supabase Dashboard → Storage → New bucket.`
        : error.message;
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  const files = (list ?? [])
    .filter((f) => f.name && !f.name.startsWith("."))
    .map((f) => ({
      name: f.name,
      url: publicUrl(f.name),
      type: fileType(f.name),
    }));

  return NextResponse.json({ ok: true, files });
}

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
  }

  const ext = file.name.includes(".") ? `.${file.name.split(".").pop()}`.toLowerCase() : "";
  const safeExt = ext.match(/^\.(png|jpg|jpeg|webp|gif|mp4|webm|mov|pdf)$/) ? ext : "";
  const filename = `${Date.now()}-${crypto.randomBytes(10).toString("hex")}${safeExt}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  let supabase;
  try {
    supabase = getSupabase();
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes("SUPABASE_URL")
        ? 'Server is missing "SUPABASE_URL" or "SUPABASE_SERVICE_ROLE_KEY". Set these environment variables in your Vercel project (see .env.example).'
        : err instanceof Error
          ? err.message
          : "Failed to initialize Supabase client.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }

  const { error } = await supabase.storage.from(BUCKET).upload(filename, buffer, {
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) {
    const msg = error.message?.toLowerCase().includes("not found") || error.message?.toLowerCase().includes("bucket")
      ? `Storage bucket "${BUCKET}" not found. Create a public bucket named "uploads" in Supabase Dashboard → Storage → New bucket.`
      : error.message;
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    file: { name: filename, url: publicUrl(filename) },
  });
}
