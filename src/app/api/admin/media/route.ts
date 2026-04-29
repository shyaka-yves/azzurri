import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseServer";
import { uploadToCloudinary, listCloudinaryImages } from "@/lib/cloudinary";

export const runtime = "nodejs";

const BUCKET = "uploads";

function fileType(name: string): "image" | "video" | "pdf" {
  const lower = name.toLowerCase();
  if (lower.match(/\.(mp4|webm|mov)$/)) return "video";
  if (lower.match(/\.(pdf)$/)) return "pdf";
  return "image";
}

function supabasePublicUrl(filename: string): string {
  const base = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
  return `${base}/storage/v1/object/public/${BUCKET}/${filename}`;
}

export async function GET() {
  const allFiles: Array<{ name: string; url: string; type: "image" | "video" | "pdf"; provider: "supabase" | "cloudinary" }> = [];

  // 1. Fetch from Cloudinary
  try {
    const cloudResources = await listCloudinaryImages('azzurri');
    cloudResources.forEach(res => {
      allFiles.push({
        name: res.public_id.split('/').pop() || res.public_id,
        url: res.secure_url,
        type: fileType(res.secure_url),
        provider: 'cloudinary'
      });
    });
  } catch (err) {
    console.error("Cloudinary list error:", err);
  }

  // 2. Fetch from Supabase (keep as secondary for legacy support)
  let supabase;
  try {
    supabase = getSupabase();
    const { data: list, error } = await supabase.storage
      .from(BUCKET)
      .list("", { sortBy: { column: "name", order: "asc" } });

    if (!error && list) {
      list
        .filter((f) => f.name && !f.name.startsWith("."))
        .forEach((f) => {
          allFiles.push({
            name: f.name,
            url: supabasePublicUrl(f.name),
            type: fileType(f.name),
            provider: 'supabase'
          });
        });
    }
  } catch (err) {
    // Supabase might fail if credentials aren't set or limit reached, just ignore
    console.error("Supabase list error:", err);
  }

  return NextResponse.json({ ok: true, files: allFiles });
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to Cloudinary instead of Supabase
    const result = await uploadToCloudinary(buffer, 'azzurri');

    return NextResponse.json({
      ok: true,
      file: { 
        name: result.public_id, 
        url: result.secure_url,
        provider: 'cloudinary'
      },
    });
  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Failed to upload to Cloudinary" 
    }, { status: 500 });
  }
}
