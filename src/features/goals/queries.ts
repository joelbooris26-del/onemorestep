import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { MainGoalWithSteps } from "./types";

/** Objetivo principal activo con sus pasos (más recientes al final). */
export async function getMainGoal(userId: string): Promise<MainGoalWithSteps | null> {
  const supabase = await createClient();
  const { data: goal, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .eq("kind", "main")
    .eq("status", "active")
    .maybeSingle();
  if (error) throw error;
  if (!goal) return null;

  const { data: steps, error: stepsError } = await supabase
    .from("goals")
    .select("*")
    .eq("parent_id", goal.id)
    .eq("kind", "step")
    .order("created_at");
  if (stepsError) throw stepsError;

  return { ...goal, steps: steps ?? [] };
}

export async function countCompletedSteps(userId: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("goals")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("kind", "step")
    .eq("status", "completed");
  return count ?? 0;
}
