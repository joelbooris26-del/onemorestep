"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/config/site";
import { ONBOARDING_VERSION } from "./options";
import { onboardingSchema, type OnboardingInput } from "./schema";

export type OnboardingResult = { ok: false; error: string };

export async function completeOnboarding(input: OnboardingInput): Promise<OnboardingResult> {
  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Revisa tus respuestas." };
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims?.sub) redirect(routes.login);

  const { error } = await supabase.rpc("complete_onboarding", {
    payload: { ...parsed.data, version: ONBOARDING_VERSION },
  });

  if (error) {
    console.error("complete_onboarding failed", error);
    return { ok: false, error: "No hemos podido guardar tus respuestas. Inténtalo de nuevo." };
  }

  redirect(routes.welcome);
}
