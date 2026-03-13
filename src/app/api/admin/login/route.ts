import { NextResponse } from "next/server";
import { getAdminCookieName, issueAdminToken } from "@/lib/adminAuth";
import { findAdminByUsername, updateAdminLastLogin } from "@/lib/adminDb";
import { compare } from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";

  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "Username and password required" }, { status: 400 });
  }

  const admin = await findAdminByUsername(username);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Invalid username or password" }, { status: 401 });
  }

  const passwordMatch = await compare(password, admin.passwordHash);
  if (!passwordMatch) {
    return NextResponse.json({ ok: false, error: "Invalid username or password" }, { status: 401 });
  }

  await updateAdminLastLogin(username);
  const token = await issueAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getAdminCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

