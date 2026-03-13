import { getSupabase } from "@/lib/supabaseServer";

export type AdminUser = {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
  lastLogin?: string;
};

const mapRow = (r: { id: string; username: string; password_hash: string; created_at: string; last_login: string | null }): AdminUser => ({
  id: r.id,
  username: r.username,
  passwordHash: r.password_hash,
  createdAt: r.created_at,
  lastLogin: r.last_login ?? undefined,
});

export async function listAdmins(): Promise<AdminUser[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("admins").select("id, username, password_hash, created_at, last_login").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function findAdminByUsername(username: string): Promise<AdminUser | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("admins").select("id, username, password_hash, created_at, last_login").eq("username", username).maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : null;
}

export async function createAdmin(username: string, passwordHash: string): Promise<AdminUser> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("admins").insert({ username, password_hash: passwordHash }).select("id, username, password_hash, created_at, last_login").single();
  if (error) throw error;
  return mapRow(data);
}

export async function updateAdminLastLogin(username: string): Promise<void> {
  const supabase = getSupabase();
  await supabase.from("admins").update({ last_login: new Date().toISOString() }).eq("username", username);
}

export async function deleteAdmin(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase.from("admins").delete().eq("id", id);
  if (error) return false;
  return true;
}
