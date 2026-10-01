import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/config/site";
import type { Tables } from "@/types/database";

export type SessionUser = {
  id: string;
  email: string | null;
  account: Tables<"users">;
  profile: Tables<"profiles">;
};

/**
 * Usuario actual con su cuenta y perfil. Se cachea por petición (React cache),
 * así layouts y páginas pueden llamarlo sin repetir consultas.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return null;

  const [{ data: account }, { data: profile }] = await Promise.all([
    supabase.from("users").select("*").eq("id", userId).maybeSingle(),
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
  ]);

  if (!account || !profile) return null;

  return { id: userId, email: account.email, account, profile };
});

/** Exige sesión. */
export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  return user;
}

/** Exige sesión y onboarding terminado (para toda la app principal). */
export async function requireOnboardedUser() {
  const user = await requireUser();
  if (!user.account.onboarding_completed_at) redirect(routes.onboarding);
  return user;
}
