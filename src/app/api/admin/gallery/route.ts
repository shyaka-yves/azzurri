import { NextResponse } from "next/server";
import {
  listGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
} from "@/lib/galleryDb";

export const runtime = "nodejs";

// GET - List all gallery images
export async function GET() {
  try {
    const images = await listGalleryImages();
    return NextResponse.json({ ok: true, images });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to list gallery images" },
      { status: 500 }
    );
  }
}

// POST - Add image to gallery
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { imageUrl?: string; label?: string; order?: number }
      | null;

    const imageUrl = body?.imageUrl?.trim();
    const label = body?.label?.trim() ?? "Gallery Image";
    const order = body?.order;

    if (!imageUrl) {
      return NextResponse.json({ ok: false, error: "Image URL required" }, { status: 400 });
    }

    const image = await addGalleryImage(imageUrl, label, order);
    return NextResponse.json({ ok: true, image });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to add gallery image" },
      { status: 500 }
    );
  }
}

// PUT - Update gallery image
export async function PUT(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { id?: string; imageUrl?: string; label?: string; order?: number }
      | null;

    const id = body?.id;
    if (!id) {
      return NextResponse.json({ ok: false, error: "Image ID required" }, { status: 400 });
    }

    const updates: Partial<{ imageUrl: string; label: string; order: number }> = {};
    if (body?.imageUrl) updates.imageUrl = body.imageUrl.trim();
    if (body?.label) updates.label = body.label.trim();
    if (typeof body?.order === "number") updates.order = body.order;

    const updated = await updateGalleryImage(id, updates);
    if (!updated) {
      return NextResponse.json({ ok: false, error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to update gallery image" },
      { status: 500 }
    );
  }
}

// DELETE - Remove image from gallery
export async function DELETE(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { id?: string } | null;
    const id = body?.id;

    if (!id) {
      return NextResponse.json({ ok: false, error: "Image ID required" }, { status: 400 });
    }

    const deleted = await deleteGalleryImage(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}

// PATCH - Reorder gallery images
export async function PATCH(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { ids?: string[] } | null;
    const ids = body?.ids;

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ ok: false, error: "IDs array required" }, { status: 400 });
    }

    await reorderGalleryImages(ids);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to reorder gallery images" },
      { status: 500 }
    );
  }
}
