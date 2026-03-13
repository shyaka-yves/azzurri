import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const BUCKET = "uploads";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { name?: string } | null;
  const name = (body?.name ?? "").trim();

  if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return NextResponse.json({ ok: false, error: "Invalid filename" }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).remove([name]);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: error.message === "Object not found" ? 404 : 500 });
  }

  return NextResponse.json({ ok: true });
}
