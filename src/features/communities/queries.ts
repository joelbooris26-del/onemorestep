import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Community, CommunityWithMembership } from "./types";

const COLUMNS =
  "id, slug, name, description, icon, color, cover_url, is_official, member_count, sort_order, created_by, archived_at, created_at, updated_at";

/** Comunidades activas, sin datos de usuario (sirve también para visitantes). */
export async function listActiveCommunities(): Promise<Community[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("communities")
    .select(COLUMNS)
    .is("archived_at", null)
    .order("sort_order")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

async function myCommunityIds(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("community_members")
    .select("community_id")
    .eq("user_id", userId);
  if (error) throw error;
  return new Set((data ?? []).map((row) => row.community_id));
}

/** Todas las comunidades activas marcando a cuáles pertenece el usuario. */
export async function listCommunitiesForUser(userId: string): Promise<CommunityWithMembership[]> {
  const [communities, mine] = await Promise.all([listActiveCommunities(), myCommunityIds(userId)]);
  return communities.map((c) => ({ ...c, isMember: mine.has(c.id) }));
}

export async function getCommunityForUser(
  slug: string,
  userId: string,
): Promise<CommunityWithMembership | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("communities")
    .select(COLUMNS)
    .eq("slug", slug)
    .is("archived_at", null)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const { count } = await supabase
    .from("community_members")
    .select("community_id", { count: "exact", head: true })
    .eq("community_id", data.id)
    .eq("user_id", userId);

  return { ...data, isMember: (count ?? 0) > 0 };
}
