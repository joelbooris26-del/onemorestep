import { labelFor, lifeGoalOptions, occupationOptions } from "@/features/onboarding/options";

export function occupationLabel(occupation: string | null, other: string | null) {
  if (!occupation) return null;
  if (occupation === "other") return other || null;
  return labelFor(occupationOptions, occupation);
}

export function focusAreaLabels(values: string[]) {
  return values
    .filter((v) => v !== "other")
    .map((v) => labelFor(lifeGoalOptions, v))
    .filter((v): v is string => Boolean(v));
}

export const visibilityCopy = {
  public: { label: "Perfil público", emoji: "🌍" },
  limited: { label: "Perfil limitado", emoji: "🌗" },
  private: { label: "Perfil privado", emoji: "🔒" },
} as const;
