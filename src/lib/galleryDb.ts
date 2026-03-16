import { getSupabase } from "@/lib/supabaseServer";

export type GalleryImage = {
  id: string;
  imageUrl: string;
  label: string;
  order: number;
  createdAt: string;
  zone?: string;
};

type DbGalleryRow = { id: string; image_url: string; label: string; order: number; created_at: string; zone?: string };

const mapRow = (r: DbGalleryRow): GalleryImage => ({
  id: r.id,
  imageUrl: r.image_url,
  label: r.label,
  order: r.order,
  createdAt: r.created_at,
  zone: r.zone,
});

export async function listGalleryImages(): Promise<GalleryImage[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("gallery").select("*").order("order", { ascending: true });
    if (error) return [];
    return (data ?? []).map(mapRow);
  } catch {
    return [];
  }
}

export async function addGalleryImage(
  imageUrl: string,
  label: string,
  zone: "restaurant" | "club" | "both" = "both",
  order?: number
): Promise<GalleryImage> {
  const supabase = getSupabase();
  const existing = await listGalleryImages();
  const nextOrder = order ?? (existing.length > 0 ? Math.max(...existing.map((i) => i.order)) + 1 : 0);
  const { data, error } = await supabase
    .from("gallery")
    .insert({ image_url: imageUrl, label, order: nextOrder, zone })
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
}

export async function updateGalleryImage(
  id: string,
  updates: Partial<Pick<GalleryImage, "label" | "order" | "imageUrl" | "zone">>
): Promise<boolean> {
  const supabase = getSupabase();
  const row: Record<string, unknown> = {};
  if (updates.label !== undefined) row.label = updates.label;
  if (updates.order !== undefined) row.order = updates.order;
  if (updates.imageUrl !== undefined) row.image_url = updates.imageUrl;
  if (updates.zone !== undefined) row.zone = updates.zone;
  if (Object.keys(row).length === 0) return true;
  const { error } = await supabase.from("gallery").update(row).eq("id", id);
  return !error;
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  return !error;
}

export async function reorderGalleryImages(ids: string[]): Promise<void> {
  const supabase = getSupabase();
  for (let i = 0; i < ids.length; i++) {
    await supabase.from("gallery").update({ order: i }).eq("id", ids[i]);
  }
}
