import { NextResponse } from "next/server";
import { listAdmins, createAdmin, findAdminByUsername, deleteAdmin } from "@/lib/adminDb";
import { compare, hash } from "bcryptjs";

export const runtime = "nodejs";

// GET - List all admins (for admin panel)
export async function GET() {
  try {
    const admins = await listAdmins();
    // Don't return password hashes
    const safe = admins.map(({ passwordHash, ...rest }) => rest);
    return NextResponse.json({ ok: true, admins: safe });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to list admins" },
      { status: 500 }
    );
  }
}

// POST - Create new admin
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { username?: string; password?: string }
      | null;

    const username = body?.username?.trim();
    const password = body?.password;

    if (!username || !password) {
      return NextResponse.json({ ok: false, error: "Username and password required" }, { status: 400 });
    }

    if (username.length < 3) {
      return NextResponse.json({ ok: false, error: "Username must be at least 3 characters" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await findAdminByUsername(username);
    if (existing) {
      return NextResponse.json({ ok: false, error: "Username already exists" }, { status: 400 });
    }

    const passwordHash = await hash(password, 10);
    const admin = await createAdmin(username, passwordHash);

    return NextResponse.json({
      ok: true,
      admin: { id: admin.id, username: admin.username, createdAt: admin.createdAt },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to create admin" },
      { status: 500 }
    );
  }
}

// DELETE - Delete admin
export async function DELETE(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { id?: string } | null;
    const id = body?.id;

    if (!id) {
      return NextResponse.json({ ok: false, error: "Admin ID required" }, { status: 400 });
    }

    const deleted = await deleteAdmin(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to delete admin" },
      { status: 500 }
    );
  }
}
