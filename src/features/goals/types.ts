import type { Tables } from "@/types/database";

export type Goal = Tables<"goals">;
export type MainGoalWithSteps = Goal & { steps: Goal[] };
