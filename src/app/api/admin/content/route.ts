import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent, type SiteContent } from "@/lib/siteContent";

export const runtime = "nodejs";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({ ok: true, content });
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as SiteContent | null;
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }
    await saveSiteContent(body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Admin content save error:", err);
    return NextResponse.json({ ok: false, error: err.message || "Save failed" }, { status: 500 });
  }
}

