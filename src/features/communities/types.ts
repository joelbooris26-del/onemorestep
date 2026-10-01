import type { Tables } from "@/types/database";

export type Community = Tables<"communities">;
export type CommunityWithMembership = Community & { isMember: boolean };

/** Forma resumida (la que expone public_profiles.communities). */
export type CommunitySummary = Pick<Community, "slug" | "name" | "icon" | "color">;
