"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const idSchema = z.uuid();

export type MembershipResult = { ok: true } | { ok: false; error: string };

async function currentUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return { supabase, userId: data?.claims?.sub ?? null };
}

function revalidateCommunityViews() {
  revalidatePath("/communities", "layout");
  revalidatePath("/home");
  revalidatePath("/profile");
}

export async function joinCommunity(communityId: string): Promise<MembershipResult> {
  const parsed = idSchema.safeParse(communityId);
  if (!parsed.success) return { ok: false, error: "Comunidad no válida." };

  const { supabase, userId } = await currentUserId();
  if (!userId) return { ok: false, error: "Necesitas iniciar sesión." };

  const { error } = await supabase
    .from("community_members")
    .insert({ community_id: parsed.data, user_id: userId });

  // 23505 = ya era miembro: no es un error para el usuario.
  if (error && error.code !== "23505") {
    return { ok: false, error: "No hemos podido unirte. Inténtalo de nuevo." };
  }

  revalidateCommunityViews();
  return { ok: true };
}

export async function leaveCommunity(communityId: string): Promise<MembershipResult> {
  const parsed = idSchema.safeParse(communityId);
  if (!parsed.success) return { ok: false, error: "Comunidad no válida." };

  const { supabase, userId } = await currentUserId();
  if (!userId) return { ok: false, error: "Necesitas iniciar sesión." };

  const { error } = await supabase
    .from("community_members")
    .delete()
    .eq("community_id", parsed.data)
    .eq("user_id", userId);

  if (error) return { ok: false, error: "No hemos podido sacarte. Inténtalo de nuevo." };

  revalidateCommunityViews();
  return { ok: true };
}
