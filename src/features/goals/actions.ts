"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type GoalActionResult = { ok: true } | { ok: false; error: string };

async function auth() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return { supabase, userId: data?.claims?.sub ?? null };
}

function revalidate() {
  revalidatePath("/home");
  revalidatePath("/profile");
}

const toggleSchema = z.object({ stepId: z.uuid(), done: z.boolean() });

export async function setStepDone(stepId: string, done: boolean): Promise<GoalActionResult> {
  const parsed = toggleSchema.safeParse({ stepId, done });
  if (!parsed.success) return { ok: false, error: "Paso no válido." };

  const { supabase, userId } = await auth();
  if (!userId) return { ok: false, error: "Necesitas iniciar sesión." };

  const { error } = await supabase
    .from("goals")
    .update({
      status: done ? "completed" : "active",
      completed_at: done ? new Date().toISOString() : null,
      progress: done ? 100 : 0,
    })
    .eq("id", parsed.data.stepId)
    .eq("user_id", userId)
    .eq("kind", "step");

  if (error) return { ok: false, error: "No se ha podido actualizar el paso." };
  revalidate();
  return { ok: true };
}

const addSchema = z.object({
  parentId: z.uuid(),
  title: z.string().trim().min(1, "Escribe tu siguiente paso.").max(200),
});

export async function addStep(parentId: string, title: string): Promise<GoalActionResult> {
  const parsed = addSchema.safeParse({ parentId, title });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Paso no válido." };

  const { supabase, userId } = await auth();
  if (!userId) return { ok: false, error: "Necesitas iniciar sesión." };

  // El padre debe ser un objetivo del propio usuario (RLS ya lo impide, esto da un error claro).
  const { data: parent } = await supabase
    .from("goals")
    .select("id")
    .eq("id", parsed.data.parentId)
    .eq("user_id", userId)
    .neq("kind", "step")
    .maybeSingle();
  if (!parent) return { ok: false, error: "Objetivo no encontrado." };

  const { error } = await supabase
    .from("goals")
    .insert({ user_id: userId, parent_id: parent.id, kind: "step", title: parsed.data.title });

  if (error) return { ok: false, error: "No se ha podido guardar el paso." };
  revalidate();
  return { ok: true };
}
