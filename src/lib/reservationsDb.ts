import { getSupabase } from "@/lib/supabaseServer";

export type ReservationRecord = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  date?: string;
  guests?: number;
  notes?: string;
  status: "new" | "contacted" | "closed";
};

const mapRow = (r: {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  date: string | null;
  guests: number | null;
  notes: string | null;
  status: string;
}): ReservationRecord => ({
  id: r.id,
  createdAt: r.created_at,
  name: r.name,
  email: r.email,
  phone: r.phone ?? undefined,
  date: r.date ?? undefined,
  guests: r.guests ?? undefined,
  notes: r.notes ?? undefined,
  status: r.status as ReservationRecord["status"],
});

export async function listReservations(): Promise<ReservationRecord[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("reservations").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function addReservation(record: Omit<ReservationRecord, "id" | "createdAt">): Promise<ReservationRecord> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("reservations")
    .insert({
      name: record.name,
      email: record.email,
      phone: record.phone ?? null,
      date: record.date ?? null,
      guests: record.guests ?? null,
      notes: record.notes ?? null,
      status: record.status ?? "new",
    })
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
}

export async function updateReservationStatus(id: string, status: ReservationRecord["status"]): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
  return !error;
}
