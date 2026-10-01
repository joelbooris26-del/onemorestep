import type { Visibility } from "@/types/database";
import type { CommunitySummary } from "@/features/communities/types";

/** Datos que pinta la vista de perfil (propio o ajeno, ya filtrados por privacidad). */
export type ProfileViewData = {
  displayName: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  age: number | null;
  occupation: string | null;
  secondaryGoals: string[];
  mainGoal: string | null;
  stepsCompleted: number;
  joinedAt: string;
  visibility: Visibility;
  communities: CommunitySummary[];
};
