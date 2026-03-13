import { NextResponse } from "next/server";
import {
  listEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  reorderEvents,
} from "@/lib/eventsDb";

export const runtime = "nodejs";

export async function GET() {
  try {
    const events = await listEvents();
    return NextResponse.json({ ok: true, events });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to list events" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { date?: string; title?: string; description?: string; imageUrl?: string; order?: number }
      | null;

    const date = body?.date?.trim() ?? "";
    const title = body?.title?.trim() ?? "";
    const description = body?.description?.trim() ?? "";
    const imageUrl = body?.imageUrl?.trim() ?? "";
    const order = body?.order;

    if (!date || !title || !description || !imageUrl) {
      return NextResponse.json(
        { ok: false, error: "Date, title, description, and image URL are required" },
        { status: 400 }
      );
    }

    const event = await addEvent(date, title, description, imageUrl, order);
    return NextResponse.json({ ok: true, event });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to add event" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { id?: string; date?: string; title?: string; description?: string; imageUrl?: string; order?: number }
      | null;

    const id = body?.id;
    if (!id) {
      return NextResponse.json({ ok: false, error: "Event ID required" }, { status: 400 });
    }

    const updates: Partial<{ date: string; title: string; description: string; imageUrl: string; order: number }> =
      {};
    if (body?.date) updates.date = body.date.trim();
    if (body?.title) updates.title = body.title.trim();
    if (body?.description) updates.description = body.description.trim();
    if (body?.imageUrl) updates.imageUrl = body.imageUrl.trim();
    if (typeof body?.order === "number") updates.order = body.order;

    const updated = await updateEvent(id, updates);
    if (!updated) {
      return NextResponse.json({ ok: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { id?: string } | null;
    const id = body?.id;

    if (!id) {
      return NextResponse.json({ ok: false, error: "Event ID required" }, { status: 400 });
    }

    const deleted = await deleteEvent(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to delete event" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { ids?: string[] } | null;
    const ids = body?.ids;

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ ok: false, error: "IDs array required" }, { status: 400 });
    }

    await reorderEvents(ids);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to reorder events" },
      { status: 500 }
    );
  }
}
