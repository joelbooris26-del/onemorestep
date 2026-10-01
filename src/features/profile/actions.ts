"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/config/site";
import { privacyOptions, valuesOf } from "@/features/onboarding/options";

const profileSchema = z.object({
  display_name: z.string().trim().min(1, "Escribe tu nombre.").max(50),
  bio: z.string().trim().max(280, "Máximo 280 caracteres."),
  visibility: z.enum(valuesOf(privacyOptions)),
});

export type ProfileFormState = { error?: string } | undefined;

export async function updateProfile(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const parsed = profileSchema.safeParse({
    display_name: formData.get("display_name"),
    bio: formData.get("bio") ?? "",
    visibility: formData.get("visibility"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa los datos." };

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect(routes.login);

  const { error } = await supabase
    .from("profiles")
    .update({ ...parsed.data, bio: parsed.data.bio || null })
    .eq("id", userId);

  if (error) return { error: "No hemos podido guardar los cambios." };

  revalidatePath("/", "layout");
  redirect(routes.profile);
}
