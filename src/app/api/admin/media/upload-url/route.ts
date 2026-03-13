import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getSupabase } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const BUCKET = "uploads";

export async function POST(req: Request) {
    const body = (await req.json().catch(() => ({}))) as {
        filename: string;
        contentType: string;
    };

    const { filename, contentType } = body;

    if (!filename) {
        return NextResponse.json({ ok: false, error: "Missing filename" }, { status: 400 });
    }

    const ext = filename.includes(".") ? `.${filename.split(".").pop()}`.toLowerCase() : "";
    const safeExt = ext.match(/^\.(png|jpg|jpeg|webp|gif|mp4|webm|mov|pdf)$/) ? ext : "";
    const newFilename = `${Date.now()}-${crypto.randomBytes(10).toString("hex")}${safeExt}`;

    let supabase;
    try {
        supabase = getSupabase();
    } catch (err) {
        return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 500 });
    }

    // Create a signed upload URL that is valid for 1 hour
    const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUploadUrl(newFilename);

    if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const base = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
    const publicUrl = `${base}/storage/v1/object/public/${BUCKET}/${newFilename}`;

    return NextResponse.json({
        ok: true,
        signedUrl: data.signedUrl,
        token: data.token,
        path: newFilename,
        publicUrl,
    });
}
