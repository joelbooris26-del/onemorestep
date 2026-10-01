"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { routes } from "@/config/site";
import { safeRedirectPath } from "@/lib/utils";

async function getOrigin() {
  if (env.siteUrl) return env.siteUrl.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export async function signInWithGoogle(formData: FormData) {
  const next = safeRedirectPath(formData.get("next")?.toString(), routes.home);
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}${routes.authCallback}?next=${encodeURIComponent(next)}`,
      queryParams: { prompt: "select_account" },
    },
  });

  if (error || !data.url) {
    redirect(`${routes.login}?error=oauth`);
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(routes.landing);
}
