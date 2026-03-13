import { getSupabase } from "@/lib/supabaseServer";

export type Event = {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  createdAt: string;
};

const mapRow = (r: { id: string; date: string; title: string; description: string; image_url: string; order: number; created_at: string }): Event => ({
  id: r.id,
  date: r.date,
  title: r.title,
  description: r.description,
  imageUrl: r.image_url,
  order: r.order,
  createdAt: r.created_at,
});

export async function listEvents(): Promise<Event[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("events").select("*").order("order", { ascending: true });
    if (error) return [];
    return (data ?? []).map(mapRow);
  } catch {
    return [];
  }
}

export async function addEvent(
  date: string,
  title: string,
  description: string,
  imageUrl: string,
  order?: number
): Promise<Event> {
  const supabase = getSupabase();
  const existing = await listEvents();
  const nextOrder = order ?? (existing.length > 0 ? Math.max(...existing.map((e) => e.order)) + 1 : 0);
  const { data, error } = await supabase
    .from("events")
    .insert({ date, title, description, image_url: imageUrl, order: nextOrder })
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
}

export async function updateEvent(
  id: string,
  updates: Partial<Pick<Event, "date" | "title" | "description" | "imageUrl" | "order">>
): Promise<boolean> {
  const supabase = getSupabase();
  const row: Record<string, unknown> = {};
  if (updates.date !== undefined) row.date = updates.date;
  if (updates.title !== undefined) row.title = updates.title;
  if (updates.description !== undefined) row.description = updates.description;
  if (updates.imageUrl !== undefined) row.image_url = updates.imageUrl;
  if (updates.order !== undefined) row.order = updates.order;
  if (Object.keys(row).length === 0) return true;
  const { error } = await supabase.from("events").update(row).eq("id", id);
  return !error;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase.from("events").delete().eq("id", id);
  return !error;
}

export async function reorderEvents(ids: string[]): Promise<void> {
  const supabase = getSupabase();
  for (let i = 0; i < ids.length; i++) {
    await supabase.from("events").update({ order: i }).eq("id", ids[i]);
  }
}
