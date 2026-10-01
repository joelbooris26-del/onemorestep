import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { CommunitySummary } from "@/features/communities/types";
import { countCompletedSteps, getMainGoal } from "@/features/goals/queries";
import type { SessionUser } from "@/features/auth/session";
import { focusAreaLabels, occupationLabel } from "./mappers";
import type { ProfileViewData } from "./types";

/** Perfil propio: el dueño ve todos sus datos. */
export async function getOwnProfileView(user: SessionUser): Promise<ProfileViewData> {
  const supabase = await createClient();
  const [goal, stepsCompleted, { data: memberships }] = await Promise.all([
    getMainGoal(user.id),
    countCompletedSteps(user.id),
    supabase
      .from("community_members")
      .select("communities!inner(slug, name, icon, color, sort_order, archived_at)")
      .eq("user_id", user.id)
      .is("communities.archived_at", null),
  ]);

  const communities = (memberships ?? [])
    .map((m) => m.communities)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(({ slug, name, icon, color }) => ({ slug, name, icon, color }));

  const p = user.profile;
  return {
    displayName: p.display_name,
    username: p.username,
    avatarUrl: p.avatar_url,
    bio: p.bio,
    age: p.age,
    occupation: occupationLabel(p.occupation, p.occupation_other),
    secondaryGoals: focusAreaLabels(p.focus_areas),
    mainGoal: goal?.title ?? null,
    stepsCompleted,
    joinedAt: p.created_at,
    visibility: p.visibility,
    communities,
  };
}

/** Perfil de otra persona, ya filtrado por la vista public_profiles. */
export async function getPublicProfileView(username: string): Promise<ProfileViewData | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    displayName: data.display_name,
    username: data.username,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    age: data.age,
    occupation: occupationLabel(data.occupation, data.occupation_other),
    secondaryGoals: focusAreaLabels(data.focus_areas),
    mainGoal: data.main_goal,
    stepsCompleted: data.steps_completed,
    joinedAt: data.joined_at,
    visibility: data.visibility,
    communities: (data.communities as CommunitySummary[] | null) ?? [],
  };
}
